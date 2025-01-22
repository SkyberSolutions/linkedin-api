import 'dotenv/config'
import ky from 'ky'
import { LinkedInClient } from '../../src/index.js'
import { ConsoleLogger } from '../../src/utils/logger/console-logger.js'
import { writeJsonToFile } from './test-util.js'

describe('SearchRequest', () => {
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

  it("searchPeopleByTitle-Raw", async () => {
    const res = await linkedin.search.searchPeopleRaw('Chris Pawley')
    await writeJsonToFile(res, `./example/search/people-search-raw-title-chris_pawley.json`);

  }, 30_000)

  it("searchPeopleByTitle", async () => {
    const res = await linkedin.search.searchPeople('Chris Pawley')
    await writeJsonToFile(res, `./example/search/people-search-title-chris_pawley.json`);

  }, 30_000)


})