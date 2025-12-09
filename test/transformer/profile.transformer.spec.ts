import { ProfileTransformer } from "../../src/transformer/profile.transformer.js"
import type { ProfileView } from "../../src/types/profile-raw.type.js"
import { readJsonFromFile, writeJsonToFile } from "../core/test-util.js"

describe('LocalCredentialStore', () => {
   let transformer: ProfileTransformer
    
    beforeAll(async () => {
        transformer = new ProfileTransformer()
    })

    it('transformProfile()', async () => {
        const profileViewPath = `./example/profile/profile-view-full-with-recommendations-chrispawley.json`
        const transformedProfilePath = `./example/profile/transformed/profile-full-with-recommendations-chrispawley.json`
        const profileView = await readJsonFromFile(profileViewPath) as ProfileView;
        //console.log(rawProfile)
        const transformedProfile = transformer.transformProfile(profileView)
        //console.log(JSON.stringify(transformedProfile, null, 2))
        
        await writeJsonToFile(transformedProfile, transformedProfilePath)

    }, 30_000)

    

})