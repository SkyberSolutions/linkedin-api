import type { CredentialStore } from "./credential-store.js";
import Conf from 'conf'
import type { Logger } from "../utils/logger/logger.js";

export class LocalCredentialStore implements CredentialStore {
    config!: Conf
    private logger?: Logger
    email!: string
    password!: string
    private storeName: string

    constructor({
        email,
        logger = undefined,
        storeName = 'linkedin-api'
    }: {
        email?: string
        logger?: Logger
        storeName?: string
    } = {}) {
        assert(
            storeName,
            'LocalCredentialStore: storeName not defined'
        )
        this.storeName = storeName

        this.logger = logger
        this.switchUser(email)
    }

    get cookies(): string {
        const cookies = this.config.get('cookies') as string
        this.logger?.debug(`LocalCredentialStore: Cookies from store: ${cookies}`)
        return cookies
    }

    set cookies(value: string) {
        this.config.set('cookies', value)
    }

    deleteCookies(): void {
        this.config.delete('cookies')
    }

    switchUser(email?: string) {
        const emails = this.getEnvArray('LINKEDIN_EMAILS');
        const passwords = this.getEnvArray('LINKEDIN_PASSWORDS');

        assert(
            emails && emails.length > 0,
            'LocalCredentialStore: LINKEDIN_EMAILS empty'
        )

        assert(
            passwords && passwords.length > 0,
            'LocalCredentialStore: LINKEDIN_PASSWORDS empty'
        )

        assert(
            emails.length === passwords.length,
            'LocalCredentialStore: LINKEDIN_EMAILS / LINKEDIN_PASSWORDS mismatch'
        )

        let emailIndex: number;

        if (email) {
            emailIndex = emails.indexOf(email);
            if (emailIndex === -1) {
                this.logger?.warn(`LocalCredentialStore: Email '${email}' not in LINKEDIN_EMAILS, using random user instead`);
                emailIndex = Math.floor(Math.random() * emails.length);
            }
        } else {
            // If no email is passed, select a random email
            emailIndex = Math.floor(Math.random() * emails.length);
        }

        // Update the email and password with the found or random values
        this.email = emails[emailIndex];
        this.password = passwords[emailIndex]; // Assuming passwords array is aligned with emails array

        this.config = this.getConfigForUser(this.email);
        this.logger?.debug('LocalCredentialStore: ConfigForUser: ', JSON.stringify(this.config, null, 2));
    }

    private getConfigForUser(email: string) {
        return new Conf({ projectName: this.storeName, configName: email })
    }

    private getEnv(name: string): string | undefined {
        try {
            return typeof process !== 'undefined'
                ? // eslint-disable-next-line no-process-env
                process.env?.[name]
                : undefined
        } catch {
            return undefined
        }
    }

    private getEnvArray(name: string): string[] | undefined {
        try {
            const value = typeof process !== 'undefined' ? process.env?.[name] : undefined;
            // If the environment variable is not found or is empty, return undefined.
            if (!value) {
                return undefined;
            }
            return JSON.parse(value)
        } catch {
            return undefined;
        }
    }
}