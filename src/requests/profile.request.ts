import { LinkedInRequest } from "../core/linkedin-request.js";

import type {
  CertificationView,
  CourseView,
  EducationItem,
  EducationView,
  ExperienceItem,
  HonorView,
  LanguageView,
  OrganizationView,
  PagedList,
  Paging,
  PatentView,
  PositionGroupView,
  PositionView,
  Profile,
  ProfileContactInfo,
  ProfileSkills,
  ProfileView,
  PublicationView,
  SelfProfile,
  SkillView,
  TestScoreView
} from '../types/index.js'
import {
  getGroupedItemId,
  getIdFromUrn,
  isLinkedInUrn,
  parseExperienceItem,
  resolveLinkedVectorImageUrl,
  stringifyLinkedInDate
} from '../core/linkedin-utils.js'

import { LinkedInAuth } from '../core/linkedin-auth.js'

import { LinkedInClient } from "../core/linkedin-client.js";
import { Logger } from "../utils/logger/logger.js";

// Utility type for the idOrOptions parameter
type IdOrOptions = string | { id: string; offset?: number; limit?: number };

export class ProfileRequest {
  private request: LinkedInRequest
  private auth: LinkedInAuth
  private logger?: Logger
  constructor(request: LinkedInRequest, auth: LinkedInAuth, logger?: Logger) {
    this.request = request
    this.auth = auth
    this.logger = logger
  }

  /**
     * Fetches basic profile information for the authenticated user.
     */
  async getMe() {
    await this.auth.ensureAuthenticated()

    const res = await this.request.apiKy.get('me')

    return res.json<SelfProfile>()
  }

  /**
   * Fetches basic profile information for a given LinkedIn user.
   *
   * Returns the raw data from the LinkedIn API without normalizing it.
   *
   * @param id The LinkedIn user's public identifier or internal URN ID.
   * @param fullProfile Check all items are contained in PagedLists
   * and re-fetch full list if needed
   */
  async getProfileRaw(id: string, fullProfile: boolean = false): Promise<ProfileView> {
    if (isLinkedInUrn(id)) {
      id = getIdFromUrn(id)!
    }

    await this.auth.ensureAuthenticated()

    // NOTE: the `/profileView` sub-route returns more detailed data.
    const profileView = await this.request.apiKy
      .get(`identity/profiles/${id}/profileView`)
      .json<ProfileView>()

    if (fullProfile) {



      if (!this.isPagingComplete(profileView.positionView.paging)) {
        const itemCount = profileView.positionView.paging.count
        const itemTotal = profileView.positionView.paging.total
        this.logger?.debug(`PositionView incomplete: ${itemCount} of ${itemTotal} items`)

        profileView.positionView = await this.getProfilePositions({ id: id, limit: itemTotal })
        this.logger?.debug(`PositionView re-fetched: ${profileView.positionView.paging.count} of ${profileView.positionView.paging.total} items`)
      }

    }




    return profileView
  }


  isPagingComplete(paging: Paging): boolean {
    return paging.count === paging.total
  }

  /**
   * Fetches basic profile information for a given LinkedIn user.
   *
   * @param id The LinkedIn user's public identifier or internal URN ID.
   */
  async getProfile(id: string): Promise<Profile> {
    const res = await this.getProfileRaw(id)

    const { profile, educationView, positionView } = res
    const miniProfile = profile.miniProfile

    const education: Profile['education'] = this.parseEducationView(educationView)

    const experience: Profile['experience'] = this.parsePositionView(positionView)

    // TODO: add other sections (skills, recommendations, etc.)
    const result: Profile = {
      id: getIdFromUrn(res.entityUrn)!,
      entityUrn: res.entityUrn,
      firstName: profile.firstName,
      lastName: profile.lastName,
      headline: profile.headline,
      summary: profile.summary,
      occupation: miniProfile?.occupation,
      location: profile.locationName,
      industryName: profile.industryName,
      industryUrn: profile.industryUrn,
      publicIdentifier: miniProfile?.publicIdentifier,
      trackingId: miniProfile?.trackingId,
      defaultLocale: profile.defaultLocale,
      backgroundImage: resolveLinkedVectorImageUrl(
        miniProfile?.backgroundImage
      ),
      image: resolveLinkedVectorImageUrl(miniProfile?.picture),
      education,
      experience
    }

    return result
  }

  parseEducationView(educationView: EducationView | undefined): PagedList<EducationItem> | undefined {

    const education: PagedList<EducationItem> | undefined = educationView
      ? {
        paging: {
          offset: educationView.paging.start,
          count: educationView.paging.count,
          total: educationView.paging.total
        },
        elements: educationView.elements.map((item) => {
          const educationItem: EducationItem = {
            entityUrn: item.entityUrn,
            schoolName: item.schoolName,
            degreeName: item.degreeName,
            fieldOfStudy: item.fieldOfStudy,
            startDate: stringifyLinkedInDate(item.timePeriod?.startDate),
            endDate: stringifyLinkedInDate(item.timePeriod?.endDate),
            school: {
              name: item.school?.schoolName ?? item.schoolName,
              entityUrn: item.school?.entityUrn,
              id: getIdFromUrn(item.school?.entityUrn),
              active: item.school?.active,
              logo: resolveLinkedVectorImageUrl(item.school?.logo)
            }
          }

          return educationItem
        })
      }
      : undefined
    return education
  }

  parsePositionView(positionView: PositionView | undefined): PagedList<ExperienceItem> | undefined {

    const experience: PagedList<ExperienceItem> | undefined = positionView
      ? {
        paging: {
          offset: positionView.paging.start,
          count: positionView.paging.count,
          total: positionView.paging.total
        },
        elements: positionView.elements.map((item) => {
          const companyUrn =
            item.companyUrn ?? item.company?.miniCompany?.entityUrn!

          const experienceItem: ExperienceItem = {
            entityUrn: item.entityUrn,
            title: item.title,
            companyName: item.companyName,
            description: item.description,
            location: item.locationName,
            startDate: stringifyLinkedInDate(item.timePeriod?.startDate),
            endDate: stringifyLinkedInDate(item.timePeriod?.endDate),
            company: {
              entityUrn: companyUrn,
              id: getIdFromUrn(companyUrn),
              publicIdentifier: item.company?.miniCompany?.universalName,
              name: item.company?.miniCompany?.name ?? item.companyName,
              industry: item.company?.industries?.[0],
              logo: resolveLinkedVectorImageUrl(
                item.company?.miniCompany?.logo
              ),
              employeeCountRange: item.company?.employeeCountRange
            }
          }

          return experienceItem
        })
      }
      : undefined

    return experience
  }

  /**
   * @param id The target LinkedIn user's public identifier or internal URN ID.
   */
  async getProfileContactInfo(id: string) {
    if (isLinkedInUrn(id)) {
      id = getIdFromUrn(id)!
    }

    await this.auth.ensureAuthenticated()

    return this.request.apiKy
      .get(`identity/profiles/${id}/profileContactInfo`)
      .json<ProfileContactInfo>()
  }




  /**
   * * Fetch SkillView (paged positions) in the same format as getProfile.
   */
  async getProfileSkills(idOrOptions: IdOrOptions) {
    return this.getProfileData<SkillView>(idOrOptions, 'skills');
  }

  /**
   * * Fetch PositionView (paged positions) in the same format as getProfile.
   */
  async getProfilePositions(idOrOptions: IdOrOptions) {
    return this.getProfileData<PositionView>(idOrOptions, 'positions');
  }

  /**
   * * Fetch PatentView (paged patents) in the same format as getProfile.
   */
  async getProfilePatents(idOrOptions: IdOrOptions) {
    return this.getProfileData<PatentView>(idOrOptions, 'patents');
  }

  /**
   * * Fetch EducationView (paged schools) in the same format as getProfile.
   */
  async getProfileEducations(idOrOptions: IdOrOptions) {
    return this.getProfileData<EducationView>(idOrOptions, 'educations');
  }

  /**
   * * Fetch OrganizationView (paged organizations) in the same format as getProfile.
   */
  async getProfileOrganizations(idOrOptions: IdOrOptions) {
    return this.getProfileData<OrganizationView>(idOrOptions, 'organizations');
  }

  /**
   * * Fetch LanguageView (paged languages) in the same format as getProfile.
   */
  async getProfileLanguages(idOrOptions: IdOrOptions) {
    return this.getProfileData<LanguageView>(idOrOptions, 'languages');
  }

  /**
   * * Fetch CertificationView (paged certifications) in the same format as getProfile.
   */
  async getProfileCertifications(idOrOptions: IdOrOptions) {
    return this.getProfileData<CertificationView>(idOrOptions, 'certifications');
  }

  /**
   * * Fetch TestScoreView (paged testscores) in the same format as getProfile.
   */
  async getProfileTestScores(idOrOptions: IdOrOptions) {
    return this.getProfileData<TestScoreView>(idOrOptions, 'testScores');
    // Not testscores, test-scores, test_scores, testScores, scores
  }

  /**
  * * Fetch CourseView (paged course) in the same format as getProfile.
  */
  async getProfileCourses(idOrOptions: IdOrOptions) {
    return this.getProfileData<CourseView>(idOrOptions, 'courses');
  }

  /**
* * Fetch HonorView (paged honor) in the same format as getProfile.
*/
  async getProfileHonors(idOrOptions: IdOrOptions) {
    return this.getProfileData<HonorView>(idOrOptions, 'honors');
  }

/**
* * Fetch PublicationView (paged publication) in the same format as getProfile.
*/
  async getProfilePublications(idOrOptions: IdOrOptions) {
    return this.getProfileData<PublicationView>(idOrOptions, 'publications');
  }


  /**
     * * Generic function to fetch profile data.
     *
     * @param id The target LinkedIn user's public identifier or internal URN ID.
     */
  private async getProfileData<T>(idOrOptions: string | { id: string; offset?: number; limit?: number }, apiPath: string): Promise<T> {
    const {
      id,
      offset = 0,
      limit = 100
    } = typeof idOrOptions === 'string' ? { id: idOrOptions } : idOrOptions;

    const resolvedId = isLinkedInUrn(id) ? getIdFromUrn(id)! : id;

    await this.auth.ensureAuthenticated();

    return this.request.apiKy
      .get(`identity/profiles/${resolvedId}/${apiPath}`, {
        searchParams: {
          count: limit,
          start: offset
        }
      })
      .json<T>();
  }

  /**
   * * Fetch PositionView (paged positions) in the same format as getProfile.
   *
   * @param id The target LinkedIn user's public identifier or internal URN ID.
   */
  async getProfilePositionGroups(
    idOrOptions: string | { id: string; offset?: number; limit?: number }
  ) {
    const {
      id,
      offset = 0,
      limit = 100
    } = typeof idOrOptions === 'string' ? { id: idOrOptions } : idOrOptions

    const resolvedId = isLinkedInUrn(id) ? getIdFromUrn(id)! : id

    await this.auth.ensureAuthenticated()

    return this.request.apiKy
      .get(`identity/profiles/${resolvedId}/positionGroups`, {
        searchParams: {
          count: limit,
          start: offset
        }
      })
      .json<PositionGroupView>()
  }



  /**
   * @param urnId The target LinkedIn user's internal URN ID.
   */

  async getProfileExperiences(urnId: string): Promise<ExperienceItem[]> {
    if (isLinkedInUrn(urnId)) {
      urnId = getIdFromUrn(urnId)!
    }

    await this.auth.ensureAuthenticated()

    const profileUrn = `urn:li:fsd_profile:${urnId}`
    const variables = [
      `profileUrn:${encodeURIComponent(profileUrn)}`,
      'sectionType:experience'
    ].join(',')
    const queryId =
      'voyagerIdentityDashProfileComponents.7af5d6f176f11583b382e37e5639e69e'

    const data = await this.request.apiKy
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

    const res = await this.request.apiKy
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