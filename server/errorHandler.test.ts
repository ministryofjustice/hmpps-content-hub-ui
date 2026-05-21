import request from 'supertest'
import { appWithAllRoutes } from './routes/testutils/appSetup'
import CmsService from './services/cmsService'

const cmsService = new CmsService(null) as jest.Mocked<CmsService>

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET 404', () => {
  it('should render a redirect page when a 404 is encountered', () => {
    return request(appWithAllRoutes({}))
      .get('/unknown')
      .expect(404)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('error.pageNotFound')
        expect(res.text).toContain('error.goHome')
        expect(res.text).not.toContain('Something went wrong. The error has been logged. Please try again')
      })
  })
})

describe('GET 500', () => {
  const MOCK_ERROR_TEXT = 'this is a mock error'
  beforeEach(() => {
    cmsService.getLink = jest.fn().mockRejectedValue(new Error(MOCK_ERROR_TEXT))
  })

  it('should render content with stack in dev mode when an unhandled exception is encountered', () => {
    const app = appWithAllRoutes({
      production: false,
      services: {
        cmsService,
      },
    })

    return request(app)
      .get('/link/1234')
      .expect(500)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain(MOCK_ERROR_TEXT)
        expect(res.text).toContain(`Error: ${MOCK_ERROR_TEXT}`)
      })
  })

  it('should render content without stack in production mode when an unhandled exception is encountered', () => {
    const app = appWithAllRoutes({
      production: true,
      services: {
        cmsService,
      },
    })

    return request(app)
      .get('/link/1234')
      .expect(500)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).not.toContain(MOCK_ERROR_TEXT)
        expect(res.text).toContain('Something went wrong. The error has been logged. Please try again')
      })
  })
})
