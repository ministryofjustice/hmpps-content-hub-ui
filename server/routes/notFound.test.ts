import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from './testutils/appSetup'
import AuditService, { Page } from '../services/auditService'
import i18next from '../i18n'

jest.mock('../services/auditService')

const auditService = new AuditService(null) as jest.Mocked<AuditService>

let app: Express

beforeAll(async () => {
  await i18next.isInitialized
})

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
    },
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Not Found Routes', () => {
  describe('GET * (catch-all)', () => {
    it('should log page view and return 404 for unknown routes', () => {
      auditService.logPageView.mockResolvedValue(null)

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
      auditService.logPageView.mockResolvedValue(null)

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
