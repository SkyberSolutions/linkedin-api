
import 'dotenv/config'
import ky from 'ky'
import { LinkedInClient } from '../../src/index.js'
import { ConsoleLogger } from '../../src/utils/logger/console-logger.js'
import { writeJsonToFile } from './test-util.js'

describe('LinkedInClient', () => {
  let linkedin: LinkedInClient
  let id = 'chrispawley'
  //let id = 'harry-pentire-555b92343'
  // let id = 'christopher-tuck-52608737'
  //let id = 'ACoAAAyzwfMBFQDk2KohwcQbrShKZf49BQJCdnw' // id for chris-pawley
  //let id = 'fisch2'
  //let id = 'ACoAAAdVCacB9uO3u3vDtvGPnDQeweefI2nV0gw' // id for fitch2

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

  it("SAVE: getProfileRaw(id)", async () => {
    const res = await linkedin.profile.getProfileRaw(id)
    await writeJsonToFile(res, `./example/profile/profile-raw-${id}.json`);
  }, 30_000)

  it("SAVE: getProfileView(id)", async () => {
    const res = await linkedin.profile.getProfileView(id)
    await writeJsonToFile(res, `./example/profile/profile-view-${id}.json`);
  }, 30_000)

  it("SAVE: getProfileView(id) with fullProfile==true", async () => {
    const res = await linkedin.profile.getProfileView('chrispawley', {fullProfile: true})
    await writeJsonToFile(res, `./example/profile/profile-view-full-${id}.json`);
  }, 30_000)

  it("SAVE: getProfileView(id) with recommendations==true", async () => {
    const res = await linkedin.profile.getProfileView('chrispawley', {recommendations: true})
    await writeJsonToFile(res, `./example/profile/profile-view-with-recommendations-${id}.json`);
  }, 30_000)

  it("SAVE: getProfileView(id) with fullProfile==true and recommendations==true", async () => {
    const res = await linkedin.profile.getProfileView('chrispawley', {fullProfile: true, recommendations: true})
    await writeJsonToFile(res, `./example/profile/profile-view-full-with-recommendations-${id}.json`);
  }, 30_000)

  it("SAVE: getProfilePositions(id)", async () => {
    const res = await linkedin.profile.getProfilePositions(id)
    await writeJsonToFile(res, `./example/profile/profile-positions-${id}.json`);
  }, 30_000)

  it("SAVE: getProfilePositionGroups(id)", async () => {
    const res = await linkedin.profile.getProfilePositionGroups(id)
    await writeJsonToFile(res, `./example/profile/profile-position-groups-${id}.json`);
  }, 30_000)

  it("SAVE: getProfilePatents(id)", async () => {
    const res = await linkedin.profile.getProfilePatents(id)
    await writeJsonToFile(res, `./example/profile/profile-patents-${id}.json`);
  }, 30_000)

  it("SAVE: getProfileEducations(id)", async () => {
    const res = await linkedin.profile.getProfileEducations(id)
    await writeJsonToFile(res, `./example/profile/profile-education-${id}.json`);
  }, 30_000)

  it("SAVE: getProfileRecommendations(id)", async () => {
    const res = await linkedin.profile.getProfileRecommendations(id)
    await writeJsonToFile(res, `./example/profile/profile-recommendations-${id}.json`);
  }, 30_000)

  it("SAVE: getProfileSkills(id)", async () => {
    const res = await linkedin.profile.getProfileSkills(id)
    await writeJsonToFile(res, `./example/profile/profile-skills-${id}.json`);
  }, 30_000)

  it("SAVE: getProfileOrganizations(id)", async () => {
    const res = await linkedin.profile.getProfileOrganizations(id)
    await writeJsonToFile(res, `./example/profile/profile-organizations-${id}.json`);
  }, 30_000)

  it("SAVE: getProfileLanguages(id)", async () => {
    const res = await linkedin.profile.getProfileLanguages(id)
    await writeJsonToFile(res, `./example/profile/profile-languages-${id}.json`);
  }, 30_000)

  it("SAVE: getProfileCertifications(id)", async () => {
    const res = await linkedin.profile.getProfileCertifications(id)
    await writeJsonToFile(res, `./example/profile/profile-certifications-${id}.json`);
  }, 30_000)

  it("SAVE: getProfileTestScores(id)", async () => {
    const res = await linkedin.profile.getProfileTestScores(id)
    await writeJsonToFile(res, `./example/profile/profile-testscores-${id}.json`);
  }, 30_000)

  it("SAVE: getProfileCourses(id)", async () => {
    const res = await linkedin.profile.getProfileCourses(id)
    await writeJsonToFile(res, `./example/profile/profile-courses-${id}.json`);
  }, 30_000)

  it("SAVE: getProfileHonors(id)", async () => {
    const res = await linkedin.profile.getProfileHonors(id)
    await writeJsonToFile(res, `./example/profile/profile-honors-${id}.json`);
  }, 30_000)

  it("SAVE: getProfilePublications(id)", async () => {
    const res = await linkedin.profile.getProfilePublications(id)
    await writeJsonToFile(res, `./example/profile/profile-publications-${id}.json`);
  }, 30_000)

  it("SAVE: getProfileContactInfo(id)", async () => {
    const res = await linkedin.profile.getProfileContactInfo(id)
    await writeJsonToFile(res, `./example/profile/profile-contact-info-${id}.json`);
  }, 30_000)


})
