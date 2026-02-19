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

describe('Recently Added Routes', () => {
  describe('GET /recently-added', () => {
    it('should throw error showing route is functional', () => {
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
