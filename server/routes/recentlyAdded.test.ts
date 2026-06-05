import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from './testutils/appSetup'
import AuditService, { Page } from '../services/auditService'
import AuditServiceSource from '../services/auditServiceSource'
import CmsService from '../services/cmsService'
import { ContentTile } from '../@types/content'
import { RecentlyAddedContent } from '../services/cms/types'

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
      auditServiceSource,
      cmsService,
    },
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

const mockContentTiles: ContentTile[] = [
  {
    id: 1,
    contentType: 'topics',
    externalContent: false,
    title: 'test-title-1',
    summary: 'test-field-summary-1',
    contentUrl: 'test-content-url-1',
    displayUrl: 'test-field-display-url-1',
    thumbnailUrl: 'test-small-image',
    thumbnailAlt: '',
    isNew: false,
    publishedAt: undefined,
  },
  {
    id: 2,
    contentType: 'topics',
    externalContent: false,
    title: 'test-title-2',
    summary: 'test-field-summary-2',
    contentUrl: 'test-content-url-2',
    displayUrl: 'test-field-display-url-2',
    thumbnailUrl: 'test-small-image',
    thumbnailAlt: '',
    isNew: false,
    publishedAt: undefined,
  },
]

const mockRecentlyAddedContent: RecentlyAddedContent = {
  data: mockContentTiles,
  isLastPage: false,
}

const mockNoRecentlyAddedContent: RecentlyAddedContent = {
  data: [],
  isLastPage: true,
}

describe('Recently Added Routes', () => {
  describe('GET /recently-added', () => {
    it('should render updates content with appropriate title and summary', () => {
      cmsService.getRecentlyAddedContent.mockResolvedValue(mockRecentlyAddedContent)

      return request(app)
        .get('/recently-added')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('test-title-1')
          expect(res.text).toContain('test-title-2')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.RECENTLY_ADDED, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })

    it('should render an appropriate message when updates content is unavailable', () => {
      cmsService.getRecentlyAddedContent.mockResolvedValue(mockNoRecentlyAddedContent)

      return request(app)
        .get('/recently-added')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('There is no recently added content available')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.RECENTLY_ADDED, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })

  describe('GET /recently-added/show-more', () => {
    it('should render additional content to show on the server-side', () => {
      cmsService.getRecentlyAddedContent.mockResolvedValue(mockRecentlyAddedContent)
      return request(app)
        .get('/recently-added/show-more')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .expect(res => {
          const responseJson = JSON.parse(res.text)
          expect(responseJson.html).toContain('test-title-1')
          expect(responseJson.html).toContain('test-title-2')
          expect(responseJson.isLastPage).toBe(false)
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.RECENTLY_ADDED_JSON, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })
})
