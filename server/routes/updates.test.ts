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

describe('Updates Routes', () => {
  describe('GET /updates', () => {
    it('should throw error showing route is functional', () => {
      return request(app)
        .get('/updates')
        .expect('Content-Type', /html/)
        .expect(500)
        .expect(res => {
          expect(res.text).toContain('Updates route is functional - pending implementation')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.UPDATES, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })

  describe('GET /updates/json', () => {
    it('should throw error showing route is functional', () => {
      return request(app)
        .get('/updates/json')
        .expect('Content-Type', /html/)
        .expect(500)
        .expect(res => {
          expect(res.text).toContain('Updates JSON route is functional - pending implementation')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.UPDATES_JSON, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })
})
