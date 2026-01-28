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

describe('Recently Added Routes', () => {
  describe('GET /recently-added', () => {
    it('should throw error showing route is functional', () => {
      auditService.logPageView.mockResolvedValue(null)

      return request(app)
        .get('/recently-added')
        .expect('Content-Type', /html/)
        .expect(500)
        .expect(res => {
          expect(res.text).toContain('Recently added route is functional - pending implementation')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.RECENTLY_ADDED, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })

  describe('GET /recently-added/json', () => {
    it('should throw error showing route is functional', () => {
      auditService.logPageView.mockResolvedValue(null)

      return request(app)
        .get('/recently-added/json')
        .expect('Content-Type', /html/)
        .expect(500)
        .expect(res => {
          expect(res.text).toContain('Recently added JSON route is functional - pending implementation')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.RECENTLY_ADDED_JSON, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })
})
