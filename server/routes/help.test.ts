import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from './testutils/appSetup'
import AuditService, { Page } from '../services/auditService'
import AuditServiceSource from '../services/auditServiceSource'
import config from '../config'

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

describe('Help Routes', () => {
  describe('GET /help', () => {
    it('should redirect to the help page defined in config', () => {
      const redirectMessage = `Found. Redirecting to ${config.knownPages.help}`
      return request(app)
        .get('/help')
        .expect('Content-Type', 'text/plain; charset=utf-8')
        .expect(302)
        .expect(res => {
          expect(res.text).toBe(redirectMessage)
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.HELP, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })
})
