import { dataAccess } from '../data'
import AuditService from './auditService'
import AuditServiceSource from './auditServiceSource'
import CmsService from './cmsService'

export const services = () => {
  const { applicationInfo, hmppsPrisonerAuditClient, hmppsStaffAuditClient, jsonApiClient } = dataAccess()

  return {
    applicationInfo,
    auditServiceSource: new AuditServiceSource({
      prisoner: new AuditService(hmppsPrisonerAuditClient),
      staff: new AuditService(hmppsStaffAuditClient),
    }),
    cmsService: new CmsService(jsonApiClient),
  }
}

export type Services = ReturnType<typeof services>
