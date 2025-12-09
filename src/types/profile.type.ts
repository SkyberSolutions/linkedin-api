import type { EmployeeCountRange } from "./company.type.js"
import type { DefaultLocale } from "./locale.type.js"
import type { PagedList } from "./paging.type.js"

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
  school: SchoolItem
}

export interface SchoolItem {
  name: string
  entityUrn?: string
  id?: string
  active?: boolean
  logo?: string
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
  company: CompanyItem
}

export interface CompanyItem {
  name: string
  entityUrn?: string
  id?: string
  publicIdentifier?: string
  industry?: string
  logo?: string
  employeeCountRange?: EmployeeCountRange
}

