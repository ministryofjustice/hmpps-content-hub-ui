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

describe('Content Routes', () => {
  describe('GET /content/:id', () => {
    it('should render page template for page content', () => {
      cmsService.getContent.mockResolvedValue({
        id: 123,
        title: 'Test Page',
        contentType: 'page',
        description: '<p>Body content</p>',
        standFirst: 'A stand first',
        breadcrumbs: [],
        categories: null,
        topics: [],
        excludeFeedback: false,
      })

      return request(app)
        .get('/content/123')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Test Page')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.CONTENT, {
            who: user.username,
            correlationId: expect.any(String),
            subjectId: '123',
          })
        })
    })

    it('should render video template for video content', () => {
      cmsService.getContent.mockResolvedValue({
        id: 456,
        uuid: 'video-uuid-456',
        created: '2024-01-01T00:00:00Z',
        title: 'Test Video',
        contentType: 'video',
        description: '<p>Video description</p>',
        media: '/video.mp4',
        image: '/thumb.jpg',
        breadcrumbs: [],
        categories: null,
        topics: [],
        episodeId: null,
        seasonId: null,
        seriesId: null,
        seriesPath: null,
        seriesName: null,
        seriesSortValue: null,
        excludeFeedback: false,
      })

      return request(app)
        .get('/content/456')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Test Video')
        })
    })

    it('should render audio template for radio content', () => {
      cmsService.getContent.mockResolvedValue({
        id: 789,
        uuid: 'audio-uuid-789',
        created: '2024-01-01T00:00:00Z',
        title: 'Test Audio',
        contentType: 'radio',
        description: '<p>Audio description</p>',
        media: '/audio.mp3',
        image: '/thumb.jpg',
        breadcrumbs: [],
        categories: null,
        topics: [],
        programmeCode: 'PC01',
        episodeId: null,
        seasonId: null,
        seriesId: null,
        seriesPath: null,
        seriesName: null,
        seriesSortValue: null,
        excludeFeedback: false,
      })

      return request(app)
        .get('/content/789')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Test Audio')
        })
    })

    it('should return 404 when content is not found', () => {
      cmsService.getContent.mockResolvedValue(null)

      return request(app)
        .get('/content/999')
        .expect(404)
    })
  })
})
