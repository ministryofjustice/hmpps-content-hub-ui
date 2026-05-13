import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from './testutils/appSetup'
import AuditService, { Page } from '../services/auditService'
import AuditServiceSource from '../services/auditServiceSource'
import CmsService from '../services/cmsService'

jest.mock('../services/auditService')
jest.mock('../services/auditServiceSource')
jest.mock('../services/cmsService')

const auditServiceSource = new AuditServiceSource(null) as jest.Mocked<AuditServiceSource>
const auditService = new AuditService(null) as jest.Mocked<AuditService>
const cmsService = new CmsService(null) as jest.Mocked<CmsService>
let app: Express

const TEST_URL = 'test-url'

beforeEach(() => {
  auditServiceSource.get.mockReturnValue(auditService)
  app = appWithAllRoutes({
    services: {
      auditServiceSource,
      cmsService,
    },
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Link Routes', () => {
  describe('GET /link/:id', () => {
    it('should display an acknowledgement page when required that links to the external route', () => {
      cmsService.getLink.mockResolvedValue({
        url: TEST_URL,
        intercept: true,
      })

      return request(app)
        .get('/link/external123')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(`href=${TEST_URL}`)
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.LINK, {
            who: user.username,
            correlationId: expect.any(String),
            subjectId: 'external123',
          })
        })
    })

    it('should redirect to the external route when required', () => {
      cmsService.getLink.mockResolvedValue({
        url: TEST_URL,
        intercept: false,
      })

      return request(app)
        .get('/link/external123')
        .expect('Content-Type', /text\/plain/)
        .expect(302)
        .expect(res => {
          expect(res.text).toEqual(`Found. Redirecting to ${TEST_URL}`)
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.LINK, {
            who: user.username,
            correlationId: expect.any(String),
            subjectId: 'external123',
          })
        })
    })
  })
})
