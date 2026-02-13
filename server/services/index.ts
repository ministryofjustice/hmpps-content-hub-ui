import { dataAccess } from '../data'
import AuditService from './auditService'
import CmsService from './cmsService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, jsonApiClient } = dataAccess()

  return {
    applicationInfo,
    auditService: new AuditService(hmppsAuditClient),
    cmsService: new CmsService(jsonApiClient),
  }
}

export type Services = ReturnType<typeof services>
