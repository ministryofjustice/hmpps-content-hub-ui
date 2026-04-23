import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from './testutils/appSetup'
import AuditService, { Page } from '../services/auditService'
import AuditServiceSource from '../services/auditServiceSource'
import config from '../config'

jest.mock('../services/auditService')
jest.mock('../services/auditServiceSource')

const auditServiceSource = new AuditServiceSource(null) as jest.Mocked<AuditServiceSource>
const auditService = new AuditService(null) as jest.Mocked<AuditService>
let app: Express

beforeEach(() => {
  auditServiceSource.get.mockReturnValue(auditService)

  app = appWithAllRoutes({
    services: {
      auditServiceSource,
    },
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('NPR Routes', () => {
  describe('GET /npr', () => {
    it('should render an audio player and title with associated thumbnail', () => {
      return request(app)
        .get('/npr')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('NPR Listen Live')
          expect(res.text).toContain('src="/assets/images/default_audio.png"')
          expect(res.text).toContain('poster="/assets/images/radio-player-background.jpg"')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.NPR, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })

    it('should render audio player source from environment variables', () => {
      return request(app)
        .get('/npr')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(`src="${config.nprStream}"`)
        })
    })

    it('should render Home, Forward, and Back navigation buttons', () => {
      return request(app)
        .get('/npr')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Home')
          expect(res.text).toContain('Forward')
          expect(res.text).toContain('Back')
        })
    })
  })
})
