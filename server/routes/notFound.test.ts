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

describe('Not Found Routes', () => {
  describe('GET * (catch-all)', () => {
    it('should log page view and return 404 for unknown routes', () => {
      return request(app)
        .get('/unknown-route')
        .expect('Content-Type', /html/)
        .expect(404)
        .expect(res => {
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.NOT_FOUND, {
            who: user.username,
            correlationId: expect.any(String),
            details: { path: '/unknown-route' },
          })
        })
    })

    it('should handle 404 for deeply nested unknown routes', () => {
      return request(app)
        .get('/this/path/does/not/exist')
        .expect(404)
        .expect(res => {
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.NOT_FOUND, {
            who: user.username,
            correlationId: expect.any(String),
            details: { path: '/this/path/does/not/exist' },
          })
        })
    })
  })
})
