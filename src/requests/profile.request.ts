import { LinkedInRequest } from "../core/linkedin-request.js";

import type {
  CertificationView,
  CourseView,
  EducationView,
  ExperienceItem,
  HonorView,
  LanguageView,
  OrganizationView,
  PagedView,
  PatentView,
  PositionGroupView,
  PositionView,
  Profile,
  ProfileContactInfo,
  ProfileView,
  PublicationView,
  RecommendationView,
  SelfProfile,
  SkillView,
  TestScoreView
} from '../types/index.js'
import {
  getGroupedItemId,
  getIdFromUrn,
  isLinkedInUrn,
  parseExperienceItem,
} from '../core/linkedin-utils.js'

import { LinkedInClient } from "../core/linkedin-client.js";
import type { Logger } from "../utils/logger/logger.js";
import { ProfileParser } from "../parser/profile.parser.js";


// Utility type for the idOrOptions parameter
type IdOrOptions = string | {
   id: string; 
   offset?: number; 
   limit?: number
   q?: string // "received" when fetching recommendations
   };

export class ProfileRequest {
  private request: LinkedInRequest
  private logger?: Logger
  private profileParser: ProfileParser = new ProfileParser()
  constructor(request: LinkedInRequest, logger?: Logger) {
    this.request = request
    this.logger = logger
  }

  /**
     * Fetches basic profile information for the authenticated user.
     */
  async getMe() {
    const res = await this.request.get('me')

    return res.json<SelfProfile>()
  }

  
  async getProfileRaw(id: string, fullProfile: boolean = false): Promise<unknown> {
    if (isLinkedInUrn(id)) {
      id = getIdFromUrn(id)!
    }

    // NOTE: the `/profileView` sub-route returns more detailed data.
    const raw = await this.request
      .get(`identity/profiles/${id}/profileView`)
      .json()
      return raw
  }
  

  /**
   * Fetches basic profile information for a given LinkedIn user.
   *
   * Returns the ProfileView data from the LinkedIn API without normalizing it.
   *
   * @param id The LinkedIn user's public identifier or internal URN ID.
   * @param fullProfile Check all items are contained in PagedLists
   * and re-fetch full list if needed
   */
  async getProfileView(id: string, options?: {fullProfile?: boolean, recommendations?: boolean}): Promise<ProfileView> {
    if (isLinkedInUrn(id)) {
      id = getIdFromUrn(id)!
    }

    // NOTE: the `/profileView` sub-route returns more detailed data.
    const profileView = await this.request
      .get(`identity/profiles/${id}/profileView`)
      .json<ProfileView>()

    if (options?.fullProfile) {

      profileView.skillView = await this.updateIfNeeded(profileView.skillView, 'SkillView', id, this.getProfileSkills.bind(this))

      profileView.positionGroupView = await this.updateIfNeeded(profileView.positionGroupView, 'PositionGroupView', id, this.getProfilePositionGroups.bind(this))
    
      profileView.positionView = await this.updateIfNeeded(profileView.positionView, 'PositionView', id, this.getProfilePositions.bind(this))

      profileView.patentView = await this.updateIfNeeded(profileView.patentView, 'PatentView', id, this.getProfilePatents.bind(this))

      profileView.educationView = await this.updateIfNeeded(profileView.educationView, 'EducationView', id, this.getProfileEducations.bind(this))

      profileView.organizationView = await this.updateIfNeeded(profileView.organizationView, 'OrganizationView', id, this.getProfileOrganizations.bind(this))

      profileView.languageView = await this.updateIfNeeded(profileView.languageView, 'LanguageView', id,  this.getProfileLanguages.bind(this))

      profileView.certificationView = await this.updateIfNeeded(profileView.certificationView, 'CertificationView', id, this.getProfileCertifications.bind(this))

      profileView.testScoreView = await this.updateIfNeeded(profileView.testScoreView, 'TestScoreView', id, this.getProfileTestScores.bind(this))

      profileView.courseView = await this.updateIfNeeded(profileView.courseView, 'CourseView', id, this.getProfileCourses.bind(this))

      profileView.honorView = await this.updateIfNeeded(profileView.honorView, 'HonorView', id, this.getProfileHonors.bind(this))

      profileView.publicationView = await this.updateIfNeeded(profileView.publicationView, 'PublicationView', id, this.getProfilePublications.bind(this))

    }
    if (options?.recommendations) {
      profileView.recommendationView = await this.getProfileRecommendations(id)
    }

    return profileView
  }

/**
 * Re-fetched the view if all paging items have not been
 * included in getProfileRaw()
 */
private async updateIfNeeded<U, T extends PagedView<U>>(currentView: T, viewName: string, id: string, fetcher: (idOrOptions: IdOrOptions) => Promise<T>): Promise<T> {
  if (currentView.paging.total > currentView.paging.count) {
    const itemCount = currentView.paging.count
    const itemTotal = currentView.paging.total
    this.logger?.debug(`${viewName} incomplete: ${itemCount} of ${itemTotal} items`)

    currentView = await fetcher({ id: id, limit: itemTotal })
    this.logger?.debug(`${viewName} re-fetched: ${currentView.paging.count} of ${currentView.paging.total} items`)
  }
  return currentView
}

  /**
   * Fetches basic profile information for a given LinkedIn user.
   *
   * @param id The LinkedIn user's public identifier or internal URN ID.
   */
  async getProfile(id: string): Promise<Profile> {
    const profileView = await this.getProfileView(id)

    return this.profileParser.parseProfile(profileView)
  }

  /**
   * @param id The target LinkedIn user's public identifier or internal URN ID.
   */
  async getProfileContactInfo(id: string) {
    if (isLinkedInUrn(id)) {
      id = getIdFromUrn(id)!
    }

    return this.request
      .get(`identity/profiles/${id}/profileContactInfo`)
      .json<ProfileContactInfo>()
  }

  /**
   * Recommendations you receive are only visible to 1st, 2nd, and 3rd-degree connections:
   * REFERENCE: https://www.linkedin.com/help/linkedin/answer/a544830/visibility-of-recommendations-on-your-profile
   * 
   */
  async getProfileRecommendations(idOrOptions: IdOrOptions): Promise<RecommendationView> {
    
    const options = typeof idOrOptions === 'string' ? { id: idOrOptions } : idOrOptions;
    // Required for fetching 'recommendations' otherwise fails with '400 Bad request'
    // Reference: https://github.com/jarivas/linkedin-exporter/blob/master/src/linkedIn.js#L321
    options.q = "received"

    const {data, ...other} = await this.getProfileData(options, 'recommendations') as RecommendationView;

    if (data) {
      // Will return "com.linkedin.voyager.common.VoyagerUserVisibleException"
      // if this is not a 1st, 2nd, and 3rd-degree connections
      const errorMessage = data.errors[0]?.message
      this.logger?.warn(
        `Error fetching recommendations: ${errorMessage},
         ${JSON.stringify(data, null, 2)}`
        )
    } 

    return other
  }

  /**
   * * Fetch SkillView (paged positions) in the same format as getProfile.
   */
  async getProfileSkills(idOrOptions: IdOrOptions): Promise<SkillView> {
    return this.getProfileData(idOrOptions, 'skills');
  }

  /**
   * * Fetch PositionView (paged positions) in the same format as getProfile.
   */
  async getProfilePositions(idOrOptions: IdOrOptions): Promise<PositionView> {
    return this.getProfileData(idOrOptions, 'positions');
  }

   /**
   * * Fetch PositionView (paged positions) in the same format as getProfile.
   */
   async getProfilePositionGroups(idOrOptions: IdOrOptions): Promise<PositionGroupView> {
    return this.getProfileData(idOrOptions, 'positionGroups');
  }

  /**
   * * Fetch PatentView (paged patents) in the same format as getProfile.
   */
  async getProfilePatents(idOrOptions: IdOrOptions): Promise<PatentView> {
    return this.getProfileData(idOrOptions, 'patents');
  }

  /**
   * * Fetch EducationView (paged schools) in the same format as getProfile.
   */
  async getProfileEducations(idOrOptions: IdOrOptions): Promise<EducationView> {
    return this.getProfileData(idOrOptions, 'educations');
  }

  /**
   * * Fetch OrganizationView (paged organizations) in the same format as getProfile.
   */
  async getProfileOrganizations(idOrOptions: IdOrOptions): Promise<OrganizationView> {
    return this.getProfileData(idOrOptions, 'organizations');
  }

  /**
   * * Fetch LanguageView (paged languages) in the same format as getProfile.
   */
  async getProfileLanguages(idOrOptions: IdOrOptions): Promise<LanguageView> {
    return this.getProfileData(idOrOptions, 'languages');
  }

  /**
   * * Fetch CertificationView (paged certifications) in the same format as getProfile.
   */
  async getProfileCertifications(idOrOptions: IdOrOptions): Promise<CertificationView> {
    return this.getProfileData(idOrOptions, 'certifications');
  }

  /**
   * * Fetch TestScoreView (paged testscores) in the same format as getProfile.
   */
  async getProfileTestScores(idOrOptions: IdOrOptions): Promise<TestScoreView> {
    return this.getProfileData(idOrOptions, 'testScores');
    // Not testscores, test-scores, test_scores, testScores, scores
  }

  /**
  * * Fetch CourseView (paged course) in the same format as getProfile.
  */
  async getProfileCourses(idOrOptions: IdOrOptions): Promise<CourseView> {
    return this.getProfileData(idOrOptions, 'courses');
  }

  /**
* * Fetch HonorView (paged honor) in the same format as getProfile.
*/
  async getProfileHonors(idOrOptions: IdOrOptions): Promise<HonorView> {
    return this.getProfileData(idOrOptions, 'honors');
  }

/**
* * Fetch PublicationView (paged publication) in the same format as getProfile.
*/
  async getProfilePublications(idOrOptions: IdOrOptions): Promise<PublicationView> {
    return this.getProfileData(idOrOptions, 'publications');
  }


// q: "received"

  /**
     * * Generic function to fetch profile data.
     * TODO: Split requests if limit too high?
     *
     * @param id The target LinkedIn user's public identifier or internal URN ID.
     */
  private async getProfileData<T>(idOrOptions: IdOrOptions, apiPath: string): Promise<T>  {
   
    const {
      id,
      offset = 0,
      limit = 100,
      q,
    } = typeof idOrOptions === 'string' ? { id: idOrOptions } : idOrOptions;

    const resolvedId = isLinkedInUrn(id) ? getIdFromUrn(id)! : id;

    const searchParams: Record<string, any> = {
      count: limit,
      start: offset,
  };

  if (q !== undefined) {
      searchParams.q = q; // Include `q` in searchParams only if it's defined
  }


    return this.request
      .get(`identity/profiles/${resolvedId}/${apiPath}`, {
        searchParams: searchParams,
      })
      .json<T>();
  }

  /**
   * @param urnId The target LinkedIn user's internal URN ID.
   */

  async getProfileExperiences(urnId: string): Promise<ExperienceItem[]> {
    if (isLinkedInUrn(urnId)) {
      urnId = getIdFromUrn(urnId)!
    }

    const profileUrn = `urn:li:fsd_profile:${urnId}`
    const variables = [
      `profileUrn:${encodeURIComponent(profileUrn)}`,
      'sectionType:experience'
    ].join(',')
    const queryId =
      'voyagerIdentityDashProfileComponents.7af5d6f176f11583b382e37e5639e69e'

    const data = await this.request
      .get(
        `graphql?variables=(${variables})&queryId=${queryId}&includeWebMeta=true`,
        {
          headers: {
            accept: 'application/vnd.linkedin.normalized+json+2.1'
          }
        }
      )
      .json<any>()

    const experienceItems: ExperienceItem[] = []
    const included = data.included
    if (!included) return experienceItems

    const elements = included[0]?.components?.elements

    for (const item of elements) {
      const groupedItemId = getGroupedItemId(item)

      if (groupedItemId) {
        const component = item.components.entityComponent
        const company = component.titleV2.text.text
        const location = component.caption?.text || null

        const group = data.included.find((i: any) =>
          i.entityUrn?.includes(groupedItemId)
        )
        if (!group) continue

        for (const groupItem of group.components.elements) {
          const parsedData = parseExperienceItem(groupItem, {
            isGroupItem: true,
            included
          })
          parsedData.companyName = company
          parsedData.location = location
          experienceItems.push(parsedData)
        }
      } else {
        // Parse the regular item
        const parsedData = parseExperienceItem(item, {
          included
        })
        experienceItems.push(parsedData)
      }
    }

    return experienceItems
  }

  /**
   * Fetch profile updates (newsfeed activity) for a given LinkedIn profile.
   *
   * @TODO This method is currently untested and may not be working.

   * @param id The target LinkedIn user's public identifier or internal URN ID.
   */
  async getProfileUpdates(
    idOrOptions: string | { id: string; offset?: number; limit?: number }
  ) {
    const {
      id,
      offset = 0,
      limit = LinkedInClient.MAX_UPDATE_COUNT
    } = typeof idOrOptions === 'string' ? { id: idOrOptions } : idOrOptions

    const res = await this.request
      .get('feed/updates', {
        searchParams: {
          profileId: id,
          q: 'memberShareFeed',
          moduleKey: 'member-share',
          count: Math.max(2, Math.min(limit, LinkedInClient.MAX_UPDATE_COUNT)),
          start: offset
        }
      })
      // TODO
      .json<any>()

    return res.elements
  }

}