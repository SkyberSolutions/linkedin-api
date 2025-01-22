import { LocalCredentialStore } from "../../src/core/local-credential-store.js"
import 'dotenv/config'
import { deleteFilesByExtension, readJsonFromFile } from "./test-util.js"
import Conf from "conf"
import path from 'path';

describe('LocalCredentialStore', () => {
    let credentialStore: LocalCredentialStore
    let initialEmail: string
    let mockEmails: string[]
    let mockPasswords: string[]
    const cookie_path_1 = `./example/cookie/cookies-harry-pentire-250330-1028.json`
    const cookie_path_2 = `./example/cookie/cookies-harry-pentire-250331-1611.json`
    
    beforeAll(async () => {
        const storeName = 'TEST-linkedin-api'
        

        // Clear existing .config files
        let config: Conf<Record<string, unknown>> | undefined = new Conf({projectName: storeName});
        const configFile = config.path
        const configPath = path.dirname(configFile);
        await deleteFilesByExtension(configPath, '.json')
        config = undefined
        
        mockEmails = ["tester1@test.email", "tester2@test.email"]
        mockPasswords = ["tester1_password", "tester2_password"]

        process.env.LINKEDIN_EMAILS = JSON.stringify(mockEmails);
        process.env.LINKEDIN_PASSWORDS = JSON.stringify(mockPasswords);

        initialEmail = mockEmails[0]
        
        credentialStore = new LocalCredentialStore({ email: initialEmail, storeName: storeName })
    })

    it('readInitialConfig()', async () => {
        expect(credentialStore.email).toBe(initialEmail)

        const credentialIndex: number = mockEmails.findIndex((email) => email === initialEmail);
        expect(credentialStore.password).toBe(mockPasswords[credentialIndex])

        const cookiesJson = await readJsonFromFile(cookie_path_1);
        const cookies = cookiesJson['cookies'] as string
        credentialStore.cookies = cookies

        expect(credentialStore.cookies).toBe(cookies)

        credentialStore.deleteCookies()
        console.log(`credentialStore.cookies: ${credentialStore.cookies}`)
        expect(credentialStore.cookies).toBeUndefined()

    }, 30_000)

    it('switchUser()', async () => {
        
        const cookiesJson_1 = await readJsonFromFile(cookie_path_1);
        const cookies_1 = cookiesJson_1['cookies'] as string
        credentialStore.cookies = cookies_1

        const newUserEmail = mockEmails[1]
        credentialStore.switchUser(newUserEmail)

        expect(credentialStore.cookies).toBeUndefined()

        const cookiesJson_2 = await readJsonFromFile(cookie_path_2);
        const cookies_2 = cookiesJson_2['cookies'] as string
        credentialStore.cookies = cookies_2

        expect(credentialStore.email).toBe(newUserEmail)
        const credentialIndex: number = mockEmails.findIndex((email) => email === newUserEmail);
        expect(credentialStore.password).toBe(mockPasswords[credentialIndex])
        expect(credentialStore.cookies).toBe(cookies_2)
        


    }, 30_000)

})