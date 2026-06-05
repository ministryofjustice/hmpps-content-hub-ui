import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from './testutils/appSetup'
import AuditService, { Page } from '../services/auditService'
import AuditServiceSource from '../services/auditServiceSource'
import CmsService from '../services/cmsService'
import { CmsTag } from '../services/cms/types'

jest.mock('../services/cmsService')
jest.mock('../services/auditService')
jest.mock('../services/auditServiceSource')

const auditServiceSource = new AuditServiceSource(null) as jest.Mocked<AuditServiceSource>
const cmsService = new CmsService(null) as jest.Mocked<CmsService>
const auditService = new AuditService(null) as jest.Mocked<AuditService>
let app: Express

beforeEach(() => {
  auditServiceSource.get.mockReturnValue(auditService)
  auditService.logPageView.mockResolvedValue(null)

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

describe('Topics Routes', () => {
  describe('GET /topics', () => {
    it('should render topics grouped by letter with links', () => {
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
    const BASE_TAG: CmsTag = {
      id: '1',
      uuid: 'uuid-1',
      type: 'topic',
      name: 'Education',
      description: 'Topic description',
      breadcrumbs: [{ text: 'Home', href: '/' }, { text: 'Topics', href: '/topics' }, { text: 'Education' }],
      isLastPage: true,
    }

    const SHOW_MORE_BUTTON_CLASS = 'show-more-tiles'

    it('should render tag name, description, and breadcrumbs', () => {
      cmsService.getTag.mockResolvedValue(BASE_TAG)
      return request(app)
        .get('/tags/123')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('govuk-breadcrumbs')
          expect(res.text).toContain('href="/topics"')
          expect(res.text).toContain('Education')
          expect(res.text).toContain('Topic description')
          expect(res.text).not.toContain(SHOW_MORE_BUTTON_CLASS)
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.TAG, {
            who: user.username,
            correlationId: expect.any(String),
            subjectId: '123',
          })
          expect(cmsService.getTag).toHaveBeenCalled()
        })
    })

    it('should render show more button when there is additional content available', () => {
      cmsService.getTag.mockResolvedValue({ ...BASE_TAG, isLastPage: false })

      return request(app)
        .get('/tags/123')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(SHOW_MORE_BUTTON_CLASS)
        })
    })

    it('should render topic tag-types', () => {
      cmsService.getTag.mockResolvedValue({
        ...BASE_TAG,
        topicHeaderImageUrl: 'topic-header-url',
        topicItems: [
          {
            id: 'topic-item-id',
            title: 'topic-item-title',
            summary: 'topic-item-summary',
            contentUrl: 'topic-item-content-url',
            thumbnailUrl: 'topic-item-thumbnail-url',
            contentType: 'video',
          },
        ],
      })
      return request(app)
        .get('/tags/123')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('topic-header-url')
          expect(res.text).toContain('topic-item-title')
          expect(res.text).toContain('topic-item-content-url')
          expect(res.text).toContain('topic-item-thumbnail-url')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.TAG, {
            who: user.username,
            correlationId: expect.any(String),
            subjectId: '123',
          })
          expect(cmsService.getTag).toHaveBeenCalled()
        })
    })

    it('should render series tag-types', () => {
      cmsService.getTag.mockResolvedValue({
        ...BASE_TAG,
        type: 'series',
        seriesHeaderImageUrl: 'series-header-url',
        seriesItems: [
          {
            id: 'series-item-id',
            title: 'series-item-title',
            summary: 'series-item-summary',
            contentUrl: 'series-item-content-url',
            thumbnailUrl: 'series-item-thumbnail-url',
            contentType: 'video',
          },
        ],
      })
      return request(app)
        .get('/tags/123')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('series-header-url')
          expect(res.text).toContain('series-item-title')
          expect(res.text).toContain('series-item-content-url')
          expect(res.text).toContain('series-item-thumbnail-url')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.TAG, {
            who: user.username,
            correlationId: expect.any(String),
            subjectId: '123',
          })
          expect(cmsService.getTag).toHaveBeenCalled()
        })
    })

    it('should render category tag-types', () => {
      cmsService.getTag.mockResolvedValue({
        ...BASE_TAG,
        type: 'category',
        categoryFeaturedContent: [
          {
            id: 'featured-item-id',
            title: 'featured-item-title',
            summary: 'featured-item-summary',
            contentUrl: 'featured-item-content-url',
            thumbnailUrl: 'featured-item-thumbnail-url',
            contentType: 'category',
          },
        ],
        categoryMenu: [
          {
            id: 'menu-item-id',
            title: 'menu-item-title',
            summary: 'menu-item-summary',
            contentUrl: 'menu-item-content-url',
            thumbnailUrl: 'menu-item-thumbnail-url',
            contentType: 'series',
          },
        ],
      })
      return request(app)
        .get('/tags/123')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('featured-item-title')
          expect(res.text).toContain('featured-item-content-url')
          expect(res.text).toContain('featured-item-thumbnail-url')
          expect(res.text).toContain('menu-item-title')
          expect(res.text).toContain('menu-item-content-url')
          expect(res.text).toContain('menu-item-thumbnail-url')
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
