import { dataAccess } from '../data'
import AuditService from './auditService'
import CmsService from './cmsService'
import ExampleService from './exampleService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, exampleApiClient, jsonApiClient } = dataAccess()

  return {
    applicationInfo,
    auditService: new AuditService(hmppsAuditClient),
    cmsService: new CmsService(jsonApiClient),
    exampleService: new ExampleService(exampleApiClient),
  }
}

export type Services = ReturnType<typeof services>
