import { LinkedInRequest } from "../core/linkedin-request.js";
import { LinkedInAuth } from '../core/linkedin-auth.js'

import {
  getIdFromUrn,
  isLinkedInUrn
} from '../core/linkedin-utils.js'
import { Auth } from "../core/auth.js";
 
export class JobRequest{
    private request: LinkedInRequest
    constructor(request: LinkedInRequest) {
        this.request = request
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