import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from './testutils/appSetup'
import AuditService, { Page } from '../services/auditService'
import CmsService from '../services/cmsService'
import i18next from '../i18n'

jest.mock('../services/auditService')
jest.mock('../services/cmsService')

const auditService = new AuditService(null) as jest.Mocked<AuditService>
const cmsService = new CmsService(null) as jest.Mocked<CmsService>

let app: Express

beforeAll(async () => {
  await i18next.isInitialized
})

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
      cmsService,
    },
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Topics Routes', () => {
  describe('GET /topics', () => {
    it('should render topics returned from the CMS', () => {
      auditService.logPageView.mockResolvedValue(null)
      cmsService.getTopics.mockResolvedValue([
        { id: '1', linkText: 'Education', href: '/tags/1' },
        { id: '2', linkText: 'Health', href: '/tags/2' },
      ])

      return request(app)
        .get('/topics')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Education')
          expect(res.text).toContain('Health')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.TOPICS, {
            who: user.username,
            correlationId: expect.any(String),
          })
          expect(cmsService.getTopics).toHaveBeenCalled()
        })
    })
  })

  describe('GET /tags/:id', () => {
    it('should throw error showing route is functional', () => {
      auditService.logPageView.mockResolvedValue(null)

      return request(app)
        .get('/tags/123')
        .expect('Content-Type', /html/)
        .expect(500)
        .expect(res => {
          expect(res.text).toContain('Tag route is functional - pending implementation')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.TAG, {
            who: user.username,
            correlationId: expect.any(String),
            subjectId: '123',
          })
        })
    })
  })

  describe('GET /tags/:id/json', () => {
    it('should throw error showing route is functional', () => {
      auditService.logPageView.mockResolvedValue(null)

      return request(app)
        .get('/tags/456/json')
        .expect('Content-Type', /html/)
        .expect(500)
        .expect(res => {
          expect(res.text).toContain('Tag JSON route is functional - pending implementation')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.TAG_JSON, {
            who: user.username,
            correlationId: expect.any(String),
            subjectId: '456',
          })
        })
    })
  })
})
