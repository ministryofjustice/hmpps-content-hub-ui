import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from './testutils/appSetup'
import AuditService, { Page } from '../services/auditService'
import AuditServiceSource from '../services/auditServiceSource'

jest.mock('../services/auditService')
jest.mock('../services/auditServiceSource')

const auditServiceSource = new AuditServiceSource(null) as jest.Mocked<AuditServiceSource>
const auditService = new AuditService(null) as jest.Mocked<AuditService>
let app: Express

beforeEach(() => {
  auditServiceSource.get.mockReturnValue(auditService)

  app = appWithAllRoutes({
    services: {
      auditServiceSource,
    },
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Feedback Routes', () => {
  describe('POST /feedback/:feedbackId', () => {
    it('should throw error showing route is functional', () => {
      return request(app)
        .post('/feedback/feedback123')
        .expect('Content-Type', /html/)
        .expect(500)
        .expect(res => {
          expect(res.text).toContain('Feedback route is functional - pending implementation')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.FEEDBACK, {
            who: user.username,
            correlationId: expect.any(String),
            subjectId: 'feedback123',
          })
        })
    })
  })
})
