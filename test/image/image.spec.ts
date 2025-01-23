import { resolveImageUrl } from "../../src/core/linkedin-utils.js"
import { VectorImage } from "../../src/index.js"
import { ProfileParser } from "../../src/transformer/profile.transformer.js"
import { ProfileView } from "../../src/types/profile.type.js"
import { isValidUrl, readJsonFromFile, writeJsonToFile } from "../core/test-util.js"

describe('ImageParse', () => {
  

    it('parseImageFromProfile()', async () => {
        const rawImagePath = `./test/example/image/image-from-raw-profile-chris_pawley.json`
        const rawImage = await readJsonFromFile(rawImagePath) as VectorImage;
        const imageUrl = resolveImageUrl(rawImage)
        expect(imageUrl).not.toBeUndefined()
        expect(isValidUrl(imageUrl)).toBeTruthy()
        //console.log(`URL: ${imageUrl}`)
    }, 30_000)

    

})