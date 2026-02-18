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

describe('Search Routes', () => {
  describe('GET /search', () => {
    it('should throw error showing route is functional', () => {
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
