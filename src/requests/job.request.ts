import { LinkedInRequest } from "../core/linkedin-request.js";

import {
  getIdFromUrn,
  isLinkedInUrn
} from '../core/linkedin-utils.js'
import type { Logger } from "../utils/logger/logger.js";
 
export class JobRequest{
    private request: LinkedInRequest
    private logger?: Logger
    constructor(request: LinkedInRequest, logger?: Logger) {
        this.request = request
        this.logger = logger
    }

  
 /**
   * Fetches data about a job posting on LinkedIn.
   *
   * @param jobId The ID of the job posting.
   */
 async getJob(jobId: string) {
  if (isLinkedInUrn(jobId)) {
    jobId = getIdFromUrn(jobId)!
  }

  const res = await this.request
    .get(`jobs/jobPostings/${jobId}`, {
      searchParams: {
        decorationId:
          'com.linkedin.voyager.deco.jobs.web.shared.WebLightJobPosting-23'
      }
    })
    .json<any>()

  return res
}
    
}