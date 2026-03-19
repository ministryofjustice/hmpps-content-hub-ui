import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from './testutils/appSetup'
import CmsService from '../services/cmsService'
import config from '../config'
import AuditService, { Page } from '../services/auditService'
import AuditServiceSource from '../services/auditServiceSource'

jest.mock('../services/auditService')
jest.mock('../services/auditServiceSource')
jest.mock('../services/cmsService')

const cmsService = new CmsService(null) as jest.Mocked<CmsService>
const auditServiceSource = new AuditServiceSource(null) as jest.Mocked<AuditServiceSource>
const auditService = new AuditService(null) as jest.Mocked<AuditService>
let app: Express

beforeEach(() => {
  auditServiceSource.get.mockReturnValue(auditService)

  app = appWithAllRoutes({
    services: {
      cmsService,
      auditServiceSource,
    },
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /', () => {
  it('should render the homepage with footer topics', () => {
    cmsService.getTopics.mockResolvedValue([
      { id: '1', linkText: 'Education', href: '/tags/1' },
      { id: '2', linkText: 'Health', href: '/tags/2' },
    ])

    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('Browse all topics')
        expect(res.text).toContain('hmpps-section--dark')
        expect(res.text).toContain('Education')
        expect(res.text).toContain('Health')
        expect(auditService.logPageView).toHaveBeenCalledWith(Page.HOMEPAGE, {
          who: user.username,
          correlationId: expect.any(String),
        })
        expect(cmsService.getTopics).toHaveBeenCalledWith(config.establishments[0].name, 'en')
      })
  })

  it('should render the homepage even if the cms service errors', () => {
    cmsService.getTopics.mockRejectedValue(new Error('CMS service error!'))

    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('Browse all topics')
      })
  })
})
