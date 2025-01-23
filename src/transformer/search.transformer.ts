import { getIdFromUrn, getUrnFromRawUpdate, resolveImageUrl } from "../core/linkedin-utils.js"
import type { SearchPeopleResponse, SearchResponse } from "../types/search.type.js"

export class SearchTransformer {


transformPeopleSearchResponse(res: SearchResponse, includePrivateProfiles: boolean): SearchPeopleResponse {

    const response: SearchPeopleResponse = {
      paging: res.paging,
      results: []
    }

    for (const result of res.results) {
      if (
        !includePrivateProfiles &&
        result.entityCustomTrackingInfo?.memberDistance === 'OUT_OF_NETWORK'
      ) {
        continue
      }

      const urnId = getIdFromUrn(getUrnFromRawUpdate(result.entityUrn))
      assert(urnId)

      const name = result.title?.text
      assert(name)

      const url = result.navigationUrl?.split('?')[0]
      assert(url)

      response.results.push({
        urnId,
        name,
        url,
        distance: result.entityCustomTrackingInfo?.memberDistance,
        jobTitle: result.primarySubtitle?.text,
        location: result.secondarySubtitle?.text,
        summary: result.summary?.text,
        image: resolveImageUrl(
          result.image?.attributes?.[0]?.detailData?.nonEntityProfilePicture
            ?.vectorImage
        )
      })
    }

    return response
  }


}