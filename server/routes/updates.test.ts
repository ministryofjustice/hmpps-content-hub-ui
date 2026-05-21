import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from './testutils/appSetup'
import AuditService, { Page } from '../services/auditService'
import AuditServiceSource from '../services/auditServiceSource'
import CmsService from '../services/cmsService'
import { UpdatesContent } from '../services/cms/types'
import { ContentTile } from '../@types/content'

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

const mockContentTiles: ContentTile[] = [
  {
    id: 1,
    contentType: 'topics',
    externalContent: false,
    title: 'test-title-1',
    summary: 'test-field-summary-1',
    contentUrl: 'test-content-url-1',
    displayUrl: 'test-field-display-url-1',
    image: { url: 'test-small-image', alt: '' },
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
    image: { url: 'test-small-image', alt: '' },
    isNew: false,
    publishedAt: undefined,
  },
]

const mockUpdatesContent: UpdatesContent = {
  largeUpdateTileDefault: mockContentTiles[0],
  updatesContent: mockContentTiles,
  isLastPage: false,
}

const mockNoUpdatesContent: UpdatesContent = {
  largeUpdateTileDefault: {} as ContentTile,
  updatesContent: [],
  isLastPage: false,
}

describe('Updates Routes', () => {
  describe('GET /updates', () => {
    it('should render updates content with appropriate title and summary', () => {
      cmsService.getUpdatesContent.mockResolvedValue(mockUpdatesContent)

      return request(app)
        .get('/updates')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('test-title-1')
          expect(res.text).toContain('test-title-2')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.UPDATES, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })

    it('should render an appropriate message when updates content is unavailable', () => {
      cmsService.getUpdatesContent.mockResolvedValue(mockNoUpdatesContent)

      return request(app)
        .get('/updates')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('There are no updates available')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.UPDATES, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })

  describe('GET /updates/show-more', () => {
    it('should render additional content to show on the server-side', () => {
      cmsService.getUpdatesContent.mockResolvedValue(mockUpdatesContent)
      return request(app)
        .get('/updates/show-more')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .expect(res => {
          const responseJson = JSON.parse(res.text)
          expect(responseJson.html).toContain('test-title-1')
          expect(responseJson.html).toContain('test-title-2')
          expect(responseJson.isLastPage).toBe(false)
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.UPDATES_JSON, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })
})
