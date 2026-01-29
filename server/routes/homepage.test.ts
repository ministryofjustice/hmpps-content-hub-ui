import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from './testutils/appSetup'
import AuditService, { Page } from '../services/auditService'
import ExampleService from '../services/exampleService'
import i18next from '../i18n'

jest.mock('../services/auditService')
jest.mock('../services/exampleService')

const auditService = new AuditService(null) as jest.Mocked<AuditService>
const exampleService = new ExampleService(null) as jest.Mocked<ExampleService>

let app: Express

beforeAll(async () => {
  await i18next.isInitialized
})

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
      exampleService,
    },
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /', () => {
  it('should render the homepage with current time', () => {
    const mockTime = '2025-01-01T12:00:00Z'
    auditService.logPageView.mockResolvedValue(null)
    exampleService.getCurrentTime.mockResolvedValue(mockTime)

    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('This site is under construction...')
        expect(res.text).toContain(mockTime)
        expect(auditService.logPageView).toHaveBeenCalledWith(Page.HOMEPAGE, {
          who: user.username,
          correlationId: expect.any(String),
        })
        expect(exampleService.getCurrentTime).toHaveBeenCalled()
      })
  })

  it('example service errors are handled', () => {
    auditService.logPageView.mockResolvedValue(null)
    exampleService.getCurrentTime.mockRejectedValue(new Error('Example service error!'))

    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(500)
      .expect(res => {
        expect(res.text).toContain('Example service error!')
      })
  })
})
