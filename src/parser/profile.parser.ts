import { getIdFromUrn, resolveLinkedVectorImageUrl, stringifyLinkedInDate } from "../core/linkedin-utils.js"
import type { PagedList } from "../types/index.js"
import type { EducationItem, EducationView, ExperienceItem, PositionView, Profile, ProfileView } from "../types/profile.type.js"

export class ProfileParser {

    parseProfile(rawProfile: ProfileView): Profile {
        
        const { profile, educationView, positionView } = rawProfile
        const miniProfile = profile.miniProfile
    
        const education: Profile['education'] = this.parseEducationView(educationView)
    
        const experience: Profile['experience'] = this.parsePositionView(positionView)
    
        // TODO: add other sections (skills, recommendations, etc.)
        const result: Profile = {
          id: getIdFromUrn(rawProfile.entityUrn)!,
          entityUrn: rawProfile.entityUrn,
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

}