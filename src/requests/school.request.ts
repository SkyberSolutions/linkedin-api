import { LinkedInRequest } from "../core/linkedin-request.js";

import type {
  Organization,
  RawOrganization,
  RawOrganizationResponse,
} from '../types/index.js'
import {
  getIdFromUrn,
  isLinkedInUrn,
  normalizeRawOrganization,
} from '../core/linkedin-utils.js'
import type { Logger } from "../utils/logger/logger.js";

 
export class SchoolRequest{
    private request: LinkedInRequest
    private logger?: Logger
    constructor(request: LinkedInRequest, logger?: Logger) {
        this.request = request
        this.logger = logger
    }

 /**
   * Fetches basic data about a school on LinkedIn. Returns the raw data from
   * the LinkedIn API without normalizing it.
   *
   * @param id The company's public LinkedIn identifier or internal URN ID. E.g. "brown-university"
   *
   * @note When using a URN, it should be the school company's entityUrn ID, not
   * the school's URN ID.
   */
 async getSchoolRaw(id: string): Promise<RawOrganization> {
  if (isLinkedInUrn(id)) {
    id = getIdFromUrn(id)!
  }

  const res = await this.request
    .get('organization/companies', {
      searchParams: {
        decorationId:
          'com.linkedin.voyager.deco.organization.web.WebFullCompanyMain-12',
        q: 'universalName',
        universalName: id
      }
    })
    .json<RawOrganizationResponse>()

  return res.elements[0]!
}

/**
 * Fetches basic data about a school on LinkedIn.
 *
 * @param id The company's public LinkedIn identifier or internal URN ID. E.g. "brown-university"
 *
 * @note When using a URN, it should be the school company's entityUrn ID, not
 * the school's URN ID.
 */
async getSchool(id: string): Promise<Organization> {
  const rawOrganization = await this.getSchoolRaw(id)
  return normalizeRawOrganization(rawOrganization)
}

    
}