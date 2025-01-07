
import 'dotenv/config'
import ky from 'ky'
import { LinkedInClient } from '../../src/index.js'
import { ConsoleLogger } from '../../src/utils/logger/console-logger.js'
import { writeResponseToFile } from './test-util.js'

describe('LinkedInClient', () => {
  let linkedin: LinkedInClient
  let id = 'chrispawley'
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
    await writeResponseToFile(res, `./test/example/profile-raw-${id}.json`);
  }, 30_000)

  it("SAVE: getProfileRaw(id) with fetchMissingItems", async () => {
    const res = await linkedin.profile.getProfileRaw('chrispawley', true)
    await writeResponseToFile(res, `./test/example/profile-raw-full-${id}.json`);
  }, 30_000)

  it("SAVE: getProfilePositions(id)", async () => {
    const res = await linkedin.profile.getProfilePositions(id)
    await writeResponseToFile(res, `./test/example/profile-positions-${id}.json`);
  }, 30_000)

  it("SAVE: getProfilePositionGroups(id)", async () => {
    const res = await linkedin.profile.getProfilePositionGroups(id)
    await writeResponseToFile(res, `./test/example/profile-position-groups-${id}.json`);
  }, 30_000)

  it("SAVE: getProfilePatents(id)", async () => {
    const res = await linkedin.profile.getProfilePatents(id)
    await writeResponseToFile(res, `./test/example/profile-patents-${id}.json`);
  }, 30_000)

  it("SAVE: getProfileEducations(id)", async () => {
    const res = await linkedin.profile.getProfileEducations(id)
    await writeResponseToFile(res, `./test/example/profile-education-${id}.json`);
  }, 30_000)

  it("SAVE: getProfileSkills(id)", async () => {
    const res = await linkedin.profile.getProfileSkills(id)
    await writeResponseToFile(res, `./test/example/profile-skills-${id}.json`);
  }, 30_000)

  it("SAVE: getProfileOrganizations(id)", async () => {
    const res = await linkedin.profile.getProfileOrganizations(id)
    await writeResponseToFile(res, `./test/example/profile-organizations-${id}.json`);
  }, 30_000)

  it("SAVE: getProfileLanguages(id)", async () => {
    const res = await linkedin.profile.getProfileLanguages(id)
    await writeResponseToFile(res, `./test/example/profile-languages-${id}.json`);
  }, 30_000)

  it("SAVE: getProfileCertifications(id)", async () => {
    const res = await linkedin.profile.getProfileCertifications(id)
    await writeResponseToFile(res, `./test/example/profile-certifications-${id}.json`);
  }, 30_000)

  it("SAVE: getProfileTestScores(id)", async () => {
    const res = await linkedin.profile.getProfileTestScores(id)
    await writeResponseToFile(res, `./test/example/profile-testscores-${id}.json`);
  }, 30_000)

  it("SAVE: getProfileCourses(id)", async () => {
    const res = await linkedin.profile.getProfileCourses(id)
    await writeResponseToFile(res, `./test/example/profile-courses-${id}.json`);
  }, 30_000)

  it("SAVE: getProfileHonors(id)", async () => {
    const res = await linkedin.profile.getProfileHonors(id)
    await writeResponseToFile(res, `./test/example/profile-honors-${id}.json`);
  }, 30_000)

  it("SAVE: getProfilePublications(id)", async () => {
    const res = await linkedin.profile.getProfilePublications(id)
    await writeResponseToFile(res, `./test/example/profile-publications-${id}.json`);
  }, 30_000)


})
