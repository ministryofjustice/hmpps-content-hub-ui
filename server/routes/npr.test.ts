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

describe('NPR Routes', () => {
  describe('GET /npr', () => {
    it('should throw error showing route is functional', () => {
      return request(app)
        .get('/npr')
        .expect('Content-Type', /html/)
        .expect(500)
        .expect(res => {
          expect(res.text).toContain('NPR route is functional - pending implementation')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.NPR, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })
})
