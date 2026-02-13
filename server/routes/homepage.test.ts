import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from './testutils/appSetup'
import AuditService, { Page } from '../services/auditService'
import CmsService from '../services/cmsService'
import config from '../config'
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

describe('GET /', () => {
  it('should render the homepage with footer topics', () => {
    auditService.logPageView.mockResolvedValue(null)
    cmsService.getTopics.mockResolvedValue([
      { id: '1', linkText: 'Education', href: '/tags/1' },
      { id: '2', linkText: 'Health', href: '/tags/2' },
    ])

    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('This site is under construction...')
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
    auditService.logPageView.mockResolvedValue(null)
    cmsService.getTopics.mockRejectedValue(new Error('CMS service error!'))

    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('This site is under construction...')
      })
  })
})
