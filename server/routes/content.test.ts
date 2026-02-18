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

describe('Content Routes', () => {
  describe('GET /content/:id', () => {
    it('should throw error showing route is functional', () => {
      return request(app)
        .get('/content/abc123')
        .expect('Content-Type', /html/)
        .expect(500)
        .expect(res => {
          expect(res.text).toContain('Content route is functional - pending implementation')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.CONTENT, {
            who: user.username,
            correlationId: expect.any(String),
            subjectId: 'abc123',
          })
        })
    })
  })
})
