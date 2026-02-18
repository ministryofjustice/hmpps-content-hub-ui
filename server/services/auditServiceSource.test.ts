import AuditService from './auditService'
import AuditServiceSource from './auditServiceSource'

describe('AuditServiceSource', () => {
  let auditServiceSource: AuditServiceSource
  let prisonerAuditService: AuditService
  let staffAuditService: AuditService

  beforeEach(() => {
    prisonerAuditService = new AuditService(null)
    staffAuditService = new AuditService(null)
    auditServiceSource = new AuditServiceSource({
      staff: staffAuditService,
      prisoner: prisonerAuditService,
    })
  })

  it('returns the prisonerAuditService on the prisoner portal', () => {
    expect(auditServiceSource.get('prisoner')).toEqual(prisonerAuditService)
  })

  it('returns the staffAuditService on the staff portal', () => {
    expect(auditServiceSource.get('staff')).toEqual(staffAuditService)
  })
})
