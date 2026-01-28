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

describe('Search Routes', () => {
  describe('GET /search', () => {
    it('should throw error showing route is functional', () => {
      auditService.logPageView.mockResolvedValue(null)

      return request(app)
        .get('/search')
        .expect('Content-Type', /html/)
        .expect(500)
        .expect(res => {
          expect(res.text).toContain('Search route is functional - pending implementation')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.SEARCH, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })

  describe('GET /search/suggest', () => {
    it('should throw error showing route is functional', () => {
      auditService.logPageView.mockResolvedValue(null)

      return request(app)
        .get('/search/suggest')
        .expect('Content-Type', /html/)
        .expect(500)
        .expect(res => {
          expect(res.text).toContain('Search suggest route is functional - pending implementation')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.SEARCH_SUGGEST, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })
})
