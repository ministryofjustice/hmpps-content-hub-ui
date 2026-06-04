import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from './testutils/appSetup'
import CmsService from '../services/cmsService'
import config from '../config'
import AuditService, { Page } from '../services/auditService'
import AuditServiceSource from '../services/auditServiceSource'
import { ContentTile } from '../@types/content'
import { ExploreContent, HomePageContent, UpdatesContent } from '../services/cms/types'

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
  const mockTopics = [
    { id: '1', linkText: 'Education', href: '/tags/1' },
    { id: '2', linkText: 'Health', href: '/tags/2' },
  ]

  const mockContentTile = (contentUrl: string): ContentTile[] => {
    return [
      {
        id: 42,
        contentType: 'topics',
        externalContent: false,
        title: 'test-title',
        summary: 'test-field-summary',
        contentUrl,
        displayUrl: 'test-field-display-url',
        thumbnailUrl: 'test-small-image',
        thumbnailAlt: '',
        isNew: false,
        publishedAt: undefined,
      },
    ]
  }

  const mockExploreContent: ExploreContent = {
    data: mockContentTile('/content/explore'),
    isLastPage: false,
  }

  const mockRecentlyAddedContent = mockContentTile('/content/recently-added')

  const mockUpdatesContent: UpdatesContent = {
    largeUpdateTileDefault: mockContentTile('/content/large-update-default')[0],
    updatesContent: mockContentTile('/content/updates'),
    isLastPage: false,
  }

  const mockHomepageContent: HomePageContent = {
    featuredContent: { data: mockContentTile('/content/featured') },
    keyInfo: { data: mockContentTile('/content/key-info') },
    largeUpdateTile: mockContentTile('/content/large-update')[0],
  }

  const setupMocks = () => {
    cmsService.getTopics.mockResolvedValue(mockTopics)
    cmsService.getExploreContent.mockResolvedValue(mockExploreContent)
    cmsService.getRecentlyAddedHomepageContent.mockResolvedValue(mockRecentlyAddedContent)
    cmsService.getUpdatesContent.mockResolvedValue(mockUpdatesContent)
    cmsService.getHomepageContent.mockResolvedValue(mockHomepageContent)
  }

  it('should render the footer topics', () => {
    setupMocks()
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

  it('should render homepage content', () => {
    setupMocks()

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
        expect(res.text).toContain('/content/explore')
        expect(res.text).toContain('/content/recently-added')
        expect(res.text).toContain('/content/featured')
        expect(res.text).toContain('/content/key-info')
        expect(res.text).toContain('/content/large-update')
        expect(res.text).not.toContain('/content/updates') // duplicate should be removed
        expect(res.text).not.toContain('/content/large-update-default') // should prefer large update tile over default
        expect(cmsService.getExploreContent).toHaveBeenCalledWith(config.establishments[0].name, 'en')
        expect(cmsService.getRecentlyAddedHomepageContent).toHaveBeenCalledWith(config.establishments[0].name, 'en')
        expect(cmsService.getUpdatesContent).toHaveBeenCalledWith(config.establishments[0].name, 'en')
        expect(cmsService.getHomepageContent).toHaveBeenCalledWith(config.establishments[0].name, 'en')
      })
  })
})
