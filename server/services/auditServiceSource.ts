import { PortalType } from '../@types/portalType'
import AuditService from './auditService'

type PortalToAuditService = {
  [key in PortalType]: AuditService
}

export default class AuditServiceSource {
  constructor(private readonly auditServices: PortalToAuditService) {}

  get(portalType: PortalType): AuditService {
    return this.auditServices[portalType]
  }
}
