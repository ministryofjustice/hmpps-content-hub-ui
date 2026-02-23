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
    it('should render topics grouped by letter with links', () => {
      auditService.logPageView.mockResolvedValue(null)
      cmsService.getTopics.mockResolvedValue([
        { id: '1', linkText: 'Education', href: '/tags/1' },
        { id: '2', linkText: 'Health', href: '/tags/2' },
        { id: '3', linkText: 'Art', href: '/tags/3' },
      ])

      return request(app)
        .get('/topics')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('<h2>A</h2>')
          expect(res.text).toContain('<h2>E</h2>')
          expect(res.text).toContain('<h2>H</h2>')
          expect(res.text).toContain('Education')
          expect(res.text).toContain('Health')
          expect(res.text).toContain('Art')
          expect(res.text).toContain('href="/tags/1"')
          expect(res.text).toContain('href="/tags/2"')
          expect(res.text).toContain('href="/tags/3"')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.TOPICS, {
            who: user.username,
            correlationId: expect.any(String),
          })
          expect(cmsService.getTopics).toHaveBeenCalled()
        })
    })
  })

  describe('GET /tags/:id', () => {
    it('should render the topic page for the tag', () => {
      auditService.logPageView.mockResolvedValue(null)
      cmsService.getTag.mockResolvedValue({
        id: '1',
        type: 'topic',
        name: 'Education',
        description: 'Topic description',
      })

      return request(app)
        .get('/tags/123')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Education')
          expect(res.text).toContain('Tag type: topic')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.TAG, {
            who: user.username,
            correlationId: expect.any(String),
            subjectId: '123',
          })
          expect(cmsService.getTag).toHaveBeenCalled()
        })
    })
  })

})
