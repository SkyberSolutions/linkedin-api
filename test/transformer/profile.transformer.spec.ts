import { ProfileTransformer } from "../../src/transformer/profile.transformer.js"
import type { ProfileView } from "../../src/types/profile.type.js"
import { readJsonFromFile, writeJsonToFile } from "../core/test-util.js"

describe('LocalCredentialStore', () => {
   let transformer: ProfileTransformer
    
    beforeAll(async () => {
        transformer = new ProfileTransformer()
    })

    it('parseProfile()', async () => {
        const rawProfilePath = `./test/example/profile-raw-full-chrispawley.json`
        const rawProfile = await readJsonFromFile(rawProfilePath) as ProfileView;
        //console.log(rawProfile)
        const parsedProfile = transformer.transformProfile(rawProfile)
        console.log(JSON.stringify(parsedProfile, null, 2))
        const parsedProfilePath = rawProfilePath.replace('raw', 'parsed')
        await writeJsonToFile(parsedProfile, parsedProfilePath)

    }, 30_000)

    

})