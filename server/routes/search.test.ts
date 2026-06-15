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

describe('Search Routes', () => {
  describe('GET /search', () => {
    it('should return a message when no search results are available', () => {
      cmsService.getSearchContent.mockResolvedValue([])
      return request(app)
        .get('/search')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('search.noResults')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.SEARCH, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })

    it('should show results when results are available', () => {
      cmsService.getSearchContent.mockResolvedValue([
        {
          title: 'title-1',
          summary: 'summary-1',
          url: 'url-1',
        },
        {
          title: 'title-2',
          summary: 'summary-2',
          url: 'url-2',
        },
      ])
      return request(app)
        .get('/search')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('title-1')
          expect(res.text).toContain('summary-1')
          expect(res.text).toContain('url-1')
          expect(res.text).toContain('title-2')
          expect(res.text).toContain('summary-2')
          expect(res.text).toContain('url-2')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.SEARCH, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })

  describe('GET /search/suggest', () => {
    it('should return search results with keywords highlighted in bold', () => {
      cmsService.getSearchContent.mockResolvedValue([
        {
          title: 'no matches but still returned by the query',
          summary: 'summary-1',
          url: 'url-1',
        },
        {
          title: 'the word title is a match',
          summary: 'summary-2',
          url: 'url-2',
        },
      ])

      return request(app)
        .get('/search/suggest?query=title')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('no matches but still returned by the query')
          expect(res.text).toContain('the word <strong>title</strong> is a match')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.SEARCH_SUGGEST, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })
})
