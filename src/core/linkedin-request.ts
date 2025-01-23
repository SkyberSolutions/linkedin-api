import { rangeDelay } from 'delay'
import defaultKy from 'ky'
import type { KyRequest, Options, ResponsePromise, KyInstance } from 'ky'
import pThrottle from 'p-throttle'
import type { Logger } from "../utils/logger/logger.js"
import type { Auth } from './auth.js'

// Allow up to 1 request per second by default.
const defaultThrottle = pThrottle({
  limit: 1,
  interval: 1000
})

export class LinkedInRequest {
  private _apiKy: KyInstance
  private logger?: Logger
  private auth: Auth

  constructor({
    auth,
    baseUrl = 'https://www.linkedin.com',
    ky = defaultKy,
    throttle = true,
    logger = undefined,
    apiHeaders = {},
  }: {
    auth?: Auth
    baseUrl?: string
    ky?: KyInstance
    throttle?: boolean
    logger?: Logger
    apiHeaders?: Record<string, string>
    authHeaders?: Record<string, string>
  } = {}) {

    this.auth = auth!
    this.logger = logger

    this._apiKy = ky.extend({
      prefixUrl: `${baseUrl}/voyager/api`,
      headers: {
        'user-agent': [
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5)',
          'AppleWebKit/537.36 (KHTML, like Gecko)',
          'Chrome/83.0.4103.116 Safari/537.36'
        ].join(' '),
        'accept-language': 'en-AU,en-GB;q=0.9,en-US;q=0.8,en;q=0.7',
        'x-li-lang': 'en_US',
        'x-restli-protocol-version': '2.0.0',
        ...apiHeaders
      },
      hooks: {
        beforeRequest: [
          async () => {
            // Ensure the user is authenticated before making a request.
            const authenticated = await this.auth.ensureAuthenticated();
            if (!authenticated) return Promise.reject("Not authenticated")

            // Check if throttling is enabled.
            if (throttle) {
              // Add a random delay before each API request in an attempt to
              // avoid suspicion.
              await rangeDelay(1000, 5000);
            }
          },

          // Conditionally add the default throttle function if throttling is enabled.
          ...(throttle ? [defaultThrottle(() => Promise.resolve(undefined))] : []),
        ],

        beforeRetry: [
          async ({request, options, error, retryCount}) => {

            if (error.name === "TypeError" && error.message === "fetch failed") {
              if (retryCount === 1) { //Only try re-authentication once
                try {
                  logger?.debug(`LinkedInRequest: beforeRetry: TypeError: fetch failed - Attempting Re-authentication`)
                  await this.reAuthenticateAndUpdateRequest(request)
                } catch (error: any) { // Failed to re-authenticate - rethrow error to stop retries
                  logger?.debug(`LinkedInRequest: beforeRetry: Re-authentication failed after 'TypeError: fetch failed'`)
                  throw error
                }
              } else {
                logger?.debug(`LinkedInRequest: beforeRetry: TypeError: fetch failed, retryCount: ${retryCount}`)
              }
            } else {
              logger?.warn(`LinkedInRequest: beforeRetry: Unhandled error: ${error.name}, ${error.message}`)
            }
            
          }
        ],

        afterResponse: [
          async (request, _options, response) => {
            this.logger?.debug(`Request: ${request.url}`)
            try {
              // Attempt to automatically re-authenticate after receiving an auth error.
              if (response.status === 403 || response.status === 401) {
                this.logger?.log(
                  'LinkedInRequest: auth error (attempting to re-authenticate)',
                  {
                    method: request.method,
                    url: request.url,
                    status: response.status
                    // responseHeaders: Object.fromEntries(response.headers.entries())
                  }
                )
                try {
                  await this.reAuthenticateAndUpdateRequest(request)
                } catch (err: any) { // Failed to re-authenticate - just return what we've got
                  return response
                }

                return await ky(request)

              }
            } catch (err) {
              this.logger?.error(
                'LinkedInRequest: unhandled auth error',
                {
                  method: request.method,
                  url: request.url,
                  status: response.status
                },
                err
              )
            }
          }
        ]
      }
    })
  }

  private async reAuthenticateAndUpdateRequest(request: KyRequest) {
    try {
      assert(this.auth, "LinkedInRequest: Client not defined")
      const headers = await this.auth.reAuthenticate()
      if (headers) {
        // Update the failed request after successfully re-authenticating.
        request.headers.set('csrf-token', headers['csrf-token'])
        request.headers.set('cookie', headers.cookie)
      } else {
        throw new Error('Failed to Re-Authenticate')
      }
    } catch (error: any) {
      this.logger?.warn(
        `LinkedInRequest: auth error from request ${request.method} ${request.url} error re-authenticating: ${error.message}`
      )
      throw error
    }
  }

  get(path: string, options: Options = {}): ResponsePromise {
    return this._apiKy.get(path, options);
  }
  
  updateAuthHeaders(csrfToken: string, encodedCookies: string) {

    // Update apiKy instance headers
    this._apiKy = this._apiKy.extend({
      headers: {
        'csrf-token': csrfToken,
        cookie: encodedCookies
      }
    })
  }


}