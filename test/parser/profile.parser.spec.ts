import { ProfileParser } from "../../src/parser/profile.parser.js"
import { ProfileView } from "../../src/types/profile.type.js"
import { readJsonFromFile, writeJsonToFile } from "../core/test-util.js"

describe('LocalCredentialStore', () => {
   let parser: ProfileParser
    
    beforeAll(async () => {
        parser = new ProfileParser()
        
    })

    it('parseProfile()', async () => {
        const rawProfilePath = `./test/example/profile-raw-full-chrispawley.json`
        const rawProfile = await readJsonFromFile(rawProfilePath) as ProfileView;
        //console.log(rawProfile)
        const parsedProfile = parser.parseProfile(rawProfile)
        console.log(JSON.stringify(parsedProfile, null, 2))
        const parsedProfilePath = rawProfilePath.replace('raw', 'parsed')
        await writeJsonToFile(parsedProfile, parsedProfilePath)

    }, 30_000)

    

})