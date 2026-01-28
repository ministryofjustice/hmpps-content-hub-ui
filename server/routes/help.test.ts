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

describe('Help Routes', () => {
  describe('GET /help', () => {
    it('should throw error showing route is functional', () => {
      auditService.logPageView.mockResolvedValue(null)

      return request(app)
        .get('/help')
        .expect('Content-Type', /html/)
        .expect(500)
        .expect(res => {
          expect(res.text).toContain('Help route is functional - pending implementation')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.HELP, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })
})
