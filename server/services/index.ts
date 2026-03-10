import { dataAccess } from '../data'
import AuditService from './auditService'
import AuditServiceSource from './auditServiceSource'
import CmsService from './cmsService'
import FeedbackService from './feedbackService'

export const services = () => {
  const { applicationInfo, hmppsPrisonerAuditClient, hmppsStaffAuditClient, jsonApiClient, feedbackClient } =
    dataAccess()

  return {
    applicationInfo,
    auditServiceSource: new AuditServiceSource({
      prisoner: new AuditService(hmppsPrisonerAuditClient),
      staff: new AuditService(hmppsStaffAuditClient),
    }),
    cmsService: new CmsService(jsonApiClient),
    feedbackService: new FeedbackService(feedbackClient),
  }
}

export type Services = ReturnType<typeof services>
