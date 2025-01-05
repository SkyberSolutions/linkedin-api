
import 'dotenv/config'
import ky from 'ky'
import { LinkedInClient } from '../../src/index.js'
import { ConsoleLogger } from '../../src/utils/logger/console-logger.js'
import { writeResponseToFile } from './test-util.js'

describe('LinkedInClient', () => {
  let linkedin: LinkedInClient

  beforeAll(async () => {
    linkedin = new LinkedInClient({
      logger: new ConsoleLogger(),
      ky: ky.extend({
        /*
        dispatcher: new EnvHttpProxyAgent() as any,
        */
      })
    })

    await linkedin.ensureReady()
  })

  it('getMe()', async () => {
    const res = await linkedin.profile.getMe()
    console.log('First name: ' + res.miniProfile.firstName + ', Last name: ' + res.miniProfile.lastName)
    expect(res.miniProfile.entityUrn).toBeTruthy()
    expect(res.miniProfile.firstName).toBeTruthy()
    expect(res.miniProfile.lastName).toBeTruthy()
  }, 30_000)

  it("getProfile('fisch2')", async () => {
    const res = await linkedin.profile.getProfile('fisch2')
    expect(res.firstName).toBe('Travis')
    expect(res.lastName).toBe('Fischer')
    expect(res.id).toBe('ACoAAAdVCacB9uO3u3vDtvGPnDQeweefI2nV0gw')
  }, 30_000)

 
  it("getProfileRaw('chrispawley') with fetchMissingItems", async () => {
    const res = await linkedin.profile.getProfileRaw('chrispawley', true)

    //expect(res.positionGroupView.paging.count).toEqual(res.positionGroupView.paging.total)
    expect(res.patentView.paging.count).toEqual(res.patentView.paging.total)
    expect(res.educationView.paging.count).toEqual(res.educationView.paging.total)
    expect(res.organizationView.paging.count).toEqual(res.organizationView.paging.total)
    expect(res.positionView.paging.count).toEqual(res.positionView.paging.total)
    expect(res.languageView.paging.count).toEqual(res.languageView.paging.total)
    expect(res.certificationView.paging.count).toEqual(res.certificationView.paging.total)
    expect(res.testScoreView.paging.count).toEqual(res.testScoreView.paging.total)
    expect(res.volunteerCauseView.paging.count).toEqual(res.volunteerCauseView.paging.total)
    expect(res.courseView.paging.count).toEqual(res.courseView.paging.total)
    expect(res.honorView.paging.count).toEqual(res.honorView.paging.total)
    expect(res.skillView.paging.count).toEqual(res.skillView.paging.total)
    expect(res.volunteerExperienceView.paging.count).toEqual(res.volunteerExperienceView.paging.total)
    expect(res.publicationView.paging.count).toEqual(res.publicationView.paging.total)
    
  }, 30_000)

  it(
    "getProfileExperiences('fisch2')", async () => {
      const res = await linkedin.profile.getProfileExperiences(
        'ACoAAAdVCacB9uO3u3vDtvGPnDQeweefI2nV0gw'
      )
      expect(res.length).toBeGreaterThanOrEqual(5)
    }, 30_000)

  it("getSchool('brown-university')",
    async () => {
      const res = await linkedin.school.getSchool('brown-university')
      expect(res.name).toBe('Brown University')
      expect(res.id).toBe('157343')
    }, 30_000
  )

  it("getCompany('microsoft')",
    async () => {
      const res = await linkedin.company.getCompany('microsoft')
      expect(res.name).toBe('Microsoft')
      expect(res.id).toBe('1035')
    }, 30_000
  )
})
