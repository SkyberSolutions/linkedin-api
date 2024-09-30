export interface ProfileView {
  entityUrn: string
  profile: Profile
  positionGroupView: PositionGroupView
  positionView: PositionView
  patentView: PatentView
  summaryTreasuryMediaCount: number
  summaryTreasuryMedias: any[]
  educationView: EducationView
  organizationView: OrganizationView
  projectView: ProjectView
  languageView: LanguageView
  certificationView: CertificationView
  testScoreView: TestScoreView
  volunteerCauseView: VolunteerCauseView
  courseView: CourseView
  honorView: HonorView
  skillView: SkillView
  volunteerExperienceView: VolunteerExperienceView
  primaryLocale: PrimaryLocale
  publicationView: PublicationView
}

export interface PositionGroupView {
  entityUrn: string
  profileId: string
  elements: Element[]
  paging: Paging
}

export interface Paging {
  start: number
  count: number
  total: number
  links: any[]
}

export interface Element {
  entityUrn: string
  name: string
  positions?: Position[]
  paging?: Paging
  timePeriod?: TimePeriod
  miniCompany?: MiniCompany
}

export interface TimePeriod {
  startDate?: StartDate
  endDate?: EndDate
}

export interface StartDate {
  month?: number
  year?: number
}

export interface EndDate {
  month?: number
  year?: number
}

export interface Position {
  entityUrn: string
  companyName: string
  timePeriod: TimePeriod
  description?: string
  title: string
  companyUrn: string
  company?: Company
  locationName?: string
  geoLocationName?: string
  geoUrn?: string
  region?: string
}

export interface Company {
  miniCompany: MiniCompany
  employeeCountRange: EmployeeCountRange
  industries: string[]
}

export interface MiniCompany {
  objectUrn: string
  entityUrn: string
  name: string
  showcase: boolean
  active: boolean
  logo: LinkedVectorImage
  universalName: string
  dashCompanyUrn: string
  trackingId: string
}

export interface VectorImage {
  artifacts: Artifact[]
  rootUrl: string
}

export interface Artifact {
  fileIdentifyingUrlPathSegment: string
  width: number
  height: number
  expiresAt: number
  $recipeTypes?: string[]
  $type?: string
}

export interface EmployeeCountRange {
  start: number
  end?: number
}

export interface PatentView {
  paging: Paging
  entityUrn: string
  profileId: string
  elements: any[]
}

export interface EducationView {
  paging: Paging
  entityUrn: string
  profileId: string
  elements: {
    entityUrn: string
    school?: MiniSchool
    timePeriod: TimePeriod
    degreeName: string
    schoolName: string
    fieldOfStudy?: string
    schoolUrn?: string
  }[]
}

export interface MiniSchool {
  objectUrn: string
  entityUrn: string
  active: boolean
  logo: LinkedVectorImage
  schoolName: string
  trackingId: string
}

export interface OrganizationView {
  paging: Paging
  entityUrn: string
  profileId: string
  elements: any[]
}

export interface ProjectView {
  paging: Paging
  entityUrn: string
  profileId: string
  elements: any[]
}

export interface PositionView {
  paging: Paging
  entityUrn: string
  profileId: string
  elements: {
    entityUrn: string
    title: string
    description?: string
    timePeriod: TimePeriod
    companyUrn: string
    companyName: string
    company?: Company
    locationName?: string
    geoLocationName?: string
    geoUrn?: string
    region?: string
  }[]
}

export interface Profile {
  entityUrn: string
  firstName: string
  lastName: string
  headline: string
  summary: string
  locationName: string
  miniProfile: MiniProfile
  industryName: string
  supportedLocales: SupportedLocale[]
  student: boolean
  geoCountryName: string
  geoCountryUrn: string
  versionTag: string
  geoLocationBackfilled: boolean
  elt: boolean
  industryUrn: string
  defaultLocale: DefaultLocale
  showEducationOnProfileTopCard: boolean
  geoLocation: GeoLocation
  geoLocationName: string
  location: Location
}

export interface SupportedLocale {
  country: string
  language: string
}

export interface DefaultLocale {
  country: string
  language: string
}

export interface GeoLocation {
  geoUrn: string
}

export interface Location {
  basicLocation: BasicLocation
}

export interface BasicLocation {
  countryCode: string
}

export interface MiniProfile {
  entityUrn: string
  firstName: string
  lastName: string
  occupation: string
  dashEntityUrn: string
  objectUrn: string
  publicIdentifier: string
  trackingId: string
  backgroundImage?: LinkedVectorImage
  picture?: LinkedVectorImage
}

export interface LinkedVectorImage {
  'com.linkedin.common.VectorImage': VectorImage
}

export interface LinkedMediaProcessorImage {
  'com.linkedin.voyager.common.MediaProcessorImage': {
    id: string
  }
}

export interface LanguageView {
  paging: Paging
  entityUrn: string
  profileId: string
  elements: any[]
}

export interface CertificationView {
  paging: Paging
  entityUrn: string
  profileId: string
  elements: any[]
}

export interface TestScoreView {
  paging: Paging
  entityUrn: string
  profileId: string
  elements: any[]
}

export interface VolunteerCauseView {
  paging: Paging
  entityUrn: string
  profileId: string
  elements: any[]
}

export interface CourseView {
  paging: Paging
  entityUrn: string
  profileId: string
  elements: any[]
}

export interface HonorView {
  paging: Paging
  entityUrn: string
  profileId: string
  elements: any[]
}

export interface SkillView {
  paging: Paging
  entityUrn: string
  profileId: string
  elements: Element[]
}

export interface VolunteerExperienceView {
  paging: Paging
  entityUrn: string
  profileId: string
  elements: any[]
}

export interface PrimaryLocale {
  country: string
  language: string
}

export interface PublicationView {
  paging: Paging
  entityUrn: string
  profileId: string
  elements: any[]
}

export type ProfileContactInfo = {
  entityUrn: string

  websites?: Array<{
    type: Record<
      string,
      {
        category: string
      }
    >
    url: string
  }>

  twitterHandles?: Array<{
    name: string
    credentialId: string
  }>

  emailAddress?: any[]
  phoneNumbers?: any[]
  ims?: any[]
  birthDateOn?: any
}

export type ProfileSkills = {
  paging: Paging
  elements: Element[]
}

export type ExperienceItem = {
  title: string
  companyName?: string
  companyImage?: string
  companyId?: string
  employmentType?: string
  locationName?: string
  duration?: string
  startDate?: string
  endDate?: string
  description?: string
}

export type SelfProfile = {
  plainId: number
  miniProfile: MiniProfile
  publicContactInfo?: any
  premiumSubscriber: boolean
}

export type Industry = {
  localizedName: string
  entityUrn: string
}

export type FollowingInfo = {
  entityUrn: string
  following: boolean
  dashFollowingStateUrn: string
  followingType: string
  followerCount: number
}

export type AffiliatedCompany = {
  entityUrn: string
  name: string
  universalName: string
  url: string
  description: string
  followingInfo: FollowingInfo
  companyIndustries: Array<Industry>
  school: string
  logo: {
    image: LinkedVectorImage
    type: string
  }
  paidCompany: boolean
  showcase: boolean
  $recipeType: string
}

export type AssociatedHashtag = {
  entityUrn: string
  feedTopic: {
    topic: {
      name: string
      trending: boolean
      recommendationTrackingId: string
      useCase: string
      backendUrn: string
    }
    entityUrn: string
    tracking: {
      trackingId: string
    }
  }
  $recipeType: string
  followAction: {
    followingInfo: FollowingInfo
    unfollowTrackingActionType: string
    followTrackingActionType: string
    trackingActionType: string
    type: string
  }
}

export type FundingData = {
  fundingRoundListCrunchbaseUrl: string
  lastFundingRound: {
    investorsCrunchbaseUrl: string
    leadInvestors: Array<{
      name: {
        text: string
      }
      investorCrunchbaseUrl: string
      image: {
        attributes: Array<{
          sourceType: string
          imageUrl: string
        }>
      }
    }>
    fundingRoundCrunchbaseUrl: string
    fundingType: string
    moneyRaised: {
      currencyCode: string
      amount: string
    }
    numOtherInvestors: number
    announcedOn: {
      month: number
      day: number
      year: number
    }
  }
  companyCrunchbaseUrl: string
  numFundingRounds: number
  updatedAt: number
}

export type Group = {
  groupName: string
  entityUrn: string
  memberCount: number
  logo: LinkedVectorImage
  $recipeType: string
  url: string
}

export type ShowcasePage = {
  entityUrn: string
  name: string
  universalName: string
  description: string
  url: string
  followingInfo: {
    entityUrn: string
    following: boolean
    dashFollowingStateUrn: string
    followingType: string
    followerCount: number
  }
  companyIndustries: Array<Industry>
  logo: {
    image: LinkedVectorImage
    type: string
  }
  paidCompany: boolean
  showcase: boolean
  $recipeType: string
}

/** School or Company */
export type Organization = {
  name: string
  universalName: string
  tagline: string
  description: string
  entityUrn: string
  url: string
  staffingCompany: boolean
  companyIndustries: Array<Industry>
  callToAction?: {
    callToActionType: string
    visible: boolean
    callToActionMessage: {
      textDirection: string
      text: string
    }
    url: string
  }
  staffCount: number
  adsRule: string
  companyEmployeesSearchPageUrl: string
  viewerFollowingJobsUpdates: boolean
  school?: string
  staffCountRange: {
    start: number
    end: number
  }
  permissions: {
    landingPageAdmin: boolean
    admin: boolean
    adAccountHolder: boolean
  }
  logo: {
    image: LinkedVectorImage
    type: string
  }
  claimable: boolean
  specialities: Array<string>
  confirmedLocations: Array<FullLocation>
  followingInfo: FollowingInfo
  viewerEmployee: boolean
  lcpTreatment: boolean
  phone?: {
    number: string
  }
  $recipeType: string
  fundingData: FundingData
  overviewPhoto: LinkedMediaProcessorImage
  coverPhoto: LinkedMediaProcessorImage
  multiLocaleTaglines: {
    localized: {
      en_US: string
    }
    preferredLocale: {
      country: string
      language: string
    }
  }
  headquarter?: FullLocation
  paidCompany: boolean
  viewerPendingAdministrator: boolean
  companyPageUrl: string
  viewerConnectedToAdministrator: boolean
  dataVersion: number
  foundedOn: {
    year: number
  }
  companyType: {
    localizedName: string
    code: string
  }
  claimableByViewer: boolean
  jobSearchPageUrl: string
  showcase: boolean
  autoGenerated: boolean
  backgroundCoverImage?: {
    image: LinkedVectorImage
    cropInfo: {
      x: number
      y: number
      width: number
      height: number
    }
  }
  affiliatedCompanies: Array<string>
  affiliatedCompaniesResolutionResults: Record<string, AffiliatedCompany>
  affiliatedCompaniesWithEmployeesRollup: Array<string>
  affiliatedCompaniesWithJobsRollup: Array<string>
  associatedHashtags: Array<string>
  associatedHashtagsResolutionResults: Record<string, AssociatedHashtag>
  groups: Array<string>
  groupsResolutionResults: Record<string, Group>
  showcasePages: Array<string>
  showcasePagesResolutionResults: Record<string, ShowcasePage>
}

export type OrganizationResponse = {
  elements: Array<Organization>
}

export type NetworkDepth = 'F' | 'S' | 'O'

export type SearchParams = {
  offset?: number
  limit?: number
  filters?: string
  query?: string
}

export type SearchPeopleParams = Omit<SearchParams, 'filters'> & {
  connectionOf?: string
  networkDepths?: NetworkDepth[]
  currentCompany?: string[]
  pastCompanies?: string[]
  nonprofitInterests?: string[]
  profileLanguages?: string[]
  regions?: string[]
  industries?: string[]
  schools?: string[]
  contactInterests?: string[]
  serviceCategories?: string[]
  includePrivateProfiles?: boolean
  keywordFirstName?: string
  keywordLastName?: string
  keywordTitle?: string
  keywordCompany?: string
  keywordSchool?: string

  /** @deprecated use `networkDepths` instead. */
  networkDepth?: NetworkDepth

  /** @deprecated Use `keywordTitle` instead. */
  title?: string
}

export type SearchCompaniesParams = Omit<SearchParams, 'filters'>

export interface ProfileSearchResult {
  urnId: string
  name: string
  url: string
  image?: string
  distance?: string
  jobTitle?: string
  location?: string
  summary?: string
}

export interface CompanySearchResult {
  urnId: string
  name: string
  url: string
  image?: string
  industry?: string
  location?: string
  numFollowers?: string
  summary?: string
}

export interface PagingResponse {
  offset: number
  count: number
  total: number
}

export interface SearchResponse {
  paging: PagingResponse
  results: EntitySearchResult[]
}

export interface SearchPeopleResponse {
  paging: PagingResponse
  results: ProfileSearchResult[]
}

export interface SearchCompaniesResponse {
  paging: PagingResponse
  results: CompanySearchResult[]
}

export interface TextData {
  textDirection: string
  text: string
  attributesV2: Array<any>
  accessibilityTextAttributesV2: Array<any>
  accessibilityText: string
  $recipeTypes: Array<string>
  $type: string
}

export type FullLocation = {
  country: string
  geographicArea: string
  city: string
  postalCode: string
  line1: string
  headquarter?: boolean
  streetAddressOptOut?: boolean
}

export type ImageViewModel = {
  attributes: Array<{
    scalingType: any
    detailData: {
      imageUrl: any
      icon: string
      systemImage: any
      vectorImage: any
      ghostImage: any
      profilePicture: any
      profilePictureWithoutFrame: any
      profilePictureWithRingStatus: any
      companyLogo: any
      professionalEventLogo: any
      groupLogo: any
      schoolLogo: any
      nonEntityGroupLogo?: any
      nonEntityProfessionalEventLogo?: any
      nonEntityCompanyLogo?: any
      nonEntitySchoolLogo?: any
      nonEntityProfilePicture?: any
    }
    tintColor: any
    $recipeTypes: Array<string>
    tapTargets: Array<any>
    displayAspectRatio: any
    $type: string
  }>
  editableAccessibilityText: boolean
  actionTarget: any
  accessibilityTextAttributes: Array<any>
  totalCount: any
  accessibilityText: any
  $recipeTypes: Array<string>
  $type: string
}

export type EntitySearchResult = {
  $type: string
  entityUrn: string
  title: TextData
  summary: TextData
  primarySubtitle: TextData
  secondarySubtitle: TextData
  badgeText: TextData
  navigationUrl: string
  template: string
  actorNavigationContext: any
  bserpEntityNavigationalUrl: string
  trackingUrn: string
  controlName: any
  interstitialComponent: any
  primaryActions: Array<any>
  entityCustomTrackingInfo: {
    memberDistance: string
    privacySettingsInjectionHolder: any
    $recipeTypes: Array<string>
    nameMatch: boolean
    $type: string
  }
  badgeData: {
    badgeHoverText: string
    targetUrn: string
    $recipeTypes: Array<string>
    $type: string
  }
  overflowActions: Array<any>
  '*lazyLoadedActions': string
  searchActionType: any
  actorInsights: Array<any>
  insightsResolutionResults: Array<{
    jobPostingInsight: any
    relationshipsInsight: any
    serviceProviderRatingInsight: any
    simpleInsight: {
      image: ImageViewModel
      controlName: any
      navigationUrl: any
      title: TextData
      $recipeTypes: Array<string>
      $type: string
      searchActionType: string
      subtitleMaxNumLines: number
      titleFontSize: any
      subtitle: any
      subtitleFontSize: any
      titleMaxNumLines: number
    }
    jobPostingFooterInsight: any
    socialActivityCountsInsight: any
    labelsInsight: any
    premiumCustomCtaInsight: any
  }>
  image: ImageViewModel
  badgeIcon: ImageViewModel
  showAdditionalCluster: boolean
  ringStatus: any
  trackingId: string
  addEntityToSearchHistory: boolean
  actorNavigationUrl: any
  entityEmbeddedObject: any
  unreadIndicatorDetails: any
  $recipeTypes: Array<string>
  target: any
  actorTrackingUrn: any
  navigationContext: {
    openExternally: boolean
    $recipeTypes: Array<string>
    url: string
    $type: string
  }
}