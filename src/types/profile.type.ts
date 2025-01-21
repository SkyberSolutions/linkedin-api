import { Company, EmployeeCountRange, MiniCompany } from "./company.type.js"
import { LIDate, TimePeriod } from "./date.type.js"
import { LinkedVectorImage } from "./image.type.js"
import { DefaultLocale, SupportedLocale } from "./locale.type.js"
import { GeoLocation, Location } from "./location.type.js"
import { PagedList, Paging } from "./paging.type.js"

export interface ProfileView {
  entityUrn: string
  profile: ProfileViewProfile
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

export interface PatentViewItem {
  
    number: string
    applicationNumber: string
    filingDate: LIDate
    entityUrn: string
    inventors: Member[],
    pending: boolean
    description: string
    title: string
    issueDate?: LIDate
    issuer: string
    url: string
}

export interface PatentView {
  paging: Paging
  entityUrn: string
  profileId: string
  elements: PatentViewItem[]
}

export interface EducationViewItem {
  entityUrn: string
  school?: MiniSchool
  timePeriod: TimePeriod
  degreeName: string
  schoolName: string
  fieldOfStudy?: string
  schoolUrn?: string
}

export interface EducationView {
  paging: Paging
  entityUrn: string
  profileId: string
  elements: EducationViewItem[]
}

export interface MiniSchool {
  objectUrn: string
  entityUrn: string
  active: boolean
  logo: LinkedVectorImage
  schoolName: string
  trackingId: string
}

export interface OrganizationViewItem {
  name: string
  timePeriod: TimePeriod
  description: string
  position: string
  entityUrn: string
}

export interface OrganizationView {
  paging: Paging
  entityUrn: string
  profileId: string
  elements: OrganizationViewItem[]
}

export interface ProjectViewItem {
    occupation: string
    entityUrn: string
    members: Member[]
    timePeriod: TimePeriod
    description: string
    title: string
}

export interface ProjectView {
  paging: Paging
  entityUrn: string
  profileId: string
  elements: ProjectViewItem[]
}

export interface PositionViewItem {
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
}

export interface PositionView {
  paging: Paging
  entityUrn: string
  profileId: string
  elements: PositionViewItem[]
}

export interface ProfileViewProfile {
  entityUrn: string
  firstName: string
  lastName: string
  headline: string
  summary: string
  locationName: string
  location: Location
  miniProfile: MiniProfile
  industryName: string
  industryUrn: string
  versionTag: string
  defaultLocale: DefaultLocale
  supportedLocales: SupportedLocale[]
  geoCountryName: string
  geoCountryUrn: string
  elt: boolean
  student: boolean
  geoLocationBackfilled: boolean
  showEducationOnProfileTopCard: boolean
  geoLocation: GeoLocation
  geoLocationName: string
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

export interface LanguageViewItem {
  name: string
  entityUrn: string
  proficiency: "ELEMENTARY" | "LIMITED_WORKING" | "PROFESSIONAL_WORKING" | "FULL_PROFESSIONAL" | "NATIVE_OR_BILINGUAL"
}

export interface LanguageView {
  paging: Paging
  entityUrn: string
  profileId: string
  elements: LanguageViewItem[]
}

export interface CertificationViewItem {

  entityUrn: string
  authority: string
  name: string
  timePeriod: TimePeriod
  company: MiniCompany
  companyUrn: string
}

export interface CertificationView {
  paging: Paging
  entityUrn: string
  profileId: string
  elements: CertificationViewItem[]
}

export interface TestScoreItem {
  name: string
  date: LIDate
  description: string
  score: string
  occupation: string
  entityUrn: string
}

export interface TestScoreView {
  paging: Paging
  entityUrn: string
  profileId: string
  elements: TestScoreItem[]
}

type causeType = "ANIMAL_RIGHTS" | "ARTS_AND_CULTURE" | "CHILDREN" | "CIVIL_RIGHTS" | "HUMANITARIAN_RELIEF" |
"ECONOMIC_EMPOWERMENT" | "EDUCATION" | "ENVIRONMENT" | "HEALTH" | "HUMAN_RIGHTS" | "POLITICS" | "POVERTY_ALLEVIATION" | "SCIENCE_AND_TECHNOLOGY" | "SOCIAL_SERVICES" | "VETERANS"

type causeName = "Animal Welfare" | "Arts and Culture" | "Children" | "Civil Rights and Social Action" | "Disaster and Humanitarian Relief" | "Economic Empowerment" | "Education" | "Environment" | "Health" | "Human Rights" | "Politics" | "Poverty Alleviation" | "Science and Technology" | "Social Services" | "Veteran Support"


export interface VolunteerCauseViewItem {
  causeType: causeType
  causeName: string
}

export interface VolunteerCauseView {
  paging: Paging
  entityUrn: string
  profileId: string
  elements: VolunteerCauseViewItem[]
}

export interface CourseViewItem {
  name: string
  occupation: string
  entityUrn: string

}

export interface CourseView {
  paging: Paging
  entityUrn: string
  profileId: string
  elements: CourseViewItem[]
}

export interface HonorViewItem {
  occupation: string
  title: string
  issueDate: LIDate
  entityUrn: string

}

export interface HonorView {
  paging: Paging
  entityUrn: string
  profileId: string
  elements: HonorViewItem[]
}

export interface SkillViewItem {
  name: string
  entityUrn: string
}

export interface SkillView {
  paging: Paging
  entityUrn: string
  profileId: string
  elements: SkillViewItem[]
}

export interface VolunteerExperienceViewItem {
  role: string
  entityUrn: string
  companyName: string
  timePeriod: TimePeriod
  cause: causeType

}

export interface VolunteerExperienceView {
  paging: Paging
  entityUrn: string
  profileId: string
  elements: VolunteerExperienceViewItem[]
}

export interface PrimaryLocale {
  country: string
  language: string
}

export interface Member {
  member: MiniProfile,
  entityUrn: string
  profileUrn: string
}

export interface PublicationViewItem {
  date: LIDate
  entityUrn: string
  name: string
  publisher: string
  description: string
  authors: Member[]
}

export interface PublicationView {
  paging: Paging
  entityUrn: string
  profileId: string
  elements: PublicationViewItem[]
}

export interface Profile {
  entityUrn: string
  id: string
  publicIdentifier: string
  firstName: string
  lastName: string
  headline: string
  summary: string
  occupation: string
  location: string
  industryName: string
  industryUrn: string
  trackingId: string
  defaultLocale: DefaultLocale
  backgroundImage?: string
  image?: string
  education?: PagedList<EducationItem>
  experience?: PagedList<ExperienceItem>
}



export interface EducationItem {
  entityUrn?: string
  schoolName: string
  degreeName?: string
  fieldOfStudy?: string
  startDate?: string
  endDate?: string
  school: {
    name: string
    entityUrn?: string
    id?: string
    active?: boolean
    logo?: string
  }
}

export interface ExperienceItem {
  entityUrn?: string
  title: string
  companyName?: string
  description?: string
  location?: string
  employmentType?: string
  duration?: string
  startDate?: string
  endDate?: string
  company: {
    name: string
    entityUrn?: string
    id?: string
    publicIdentifier?: string
    industry?: string
    logo?: string
    employeeCountRange?: EmployeeCountRange
  }
}

export interface ProfileContactInfo {
  entityUrn: string
  address?: string

  websites?: {
    type: Record<
      "com.linkedin.voyager.identity.profile.StandardWebsite" | string,
      {
        category: "PERSONAL" | "COMPANY" | "BLOG" | string
      }
    >
    url: string
  }[]

  twitterHandles?: {
    name: string
    credentialId: string
  }[]

  emailAddress?: string[]
  phoneNumbers?: {
    type: "HOME" | "WORK" | "MOBILE",
    number: string
  }[]
  ims?: {
    provider: "SKYPE" | string,
    id: string
  }[]
  birthdayVisibilitySetting: "LINKEDIN_USER" | string,
  birthDateOn?: {
    month: number
    day: number
  }
}

export interface ProfileSkills {
  paging: Paging
  elements: Element[]
}

export interface SelfProfile {
  plainId: number
  miniProfile: MiniProfile
  publicContactInfo?: any
  premiumSubscriber: boolean
}

export interface Element {
  entityUrn: string
  name: string
  positions?: Position[]
  paging?: Paging
  timePeriod?: TimePeriod
  miniCompany?: MiniCompany
}
