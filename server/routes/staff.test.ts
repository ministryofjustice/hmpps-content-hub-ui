import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from './testutils/appSetup'
import AuditService, { Page } from '../services/auditService'
import AuditServiceSource from '../services/auditServiceSource'

jest.mock('../services/auditService')
jest.mock('../services/auditServiceSource')

const auditServiceSource = new AuditServiceSource(null) as jest.Mocked<AuditServiceSource>
const auditService = new AuditService(null) as jest.Mocked<AuditService>
let app: Express

beforeEach(() => auditServiceSource.get.mockReturnValue(auditService))

afterEach(() => {
  jest.resetAllMocks()
})

describe('Staff Routes', () => {
  describe('when we are currently on the prisoner portal', () => {
    beforeEach(() => {
      app = appWithAllRoutes({
        services: {
          auditServiceSource,
        },
        isStaffPortal: false,
      })
    })

    describe('GET /staff/prisons', () => {
      it('redirects to the 404 page', () => {
        return request(app)
          .get('/staff/prisons')
          .redirects(1)
          .expect(res => {
            expect(res.status).toEqual(404)
            expect(auditService.logPageView).toHaveBeenCalledWith(Page.STAFF_PORTAL_UNAUTHORIZED, {
              who: user.username,
              correlationId: expect.any(String),
            })
          })
      })
    })

    describe('POST /staff/prisons', () => {
      it('redirects to the 404 page', () => {
        return request(app)
          .post('/staff/prisons')
          .redirects(1)
          .expect(res => {
            expect(res.status).toEqual(404)
            expect(auditService.logPageView).toHaveBeenCalledWith(Page.STAFF_PORTAL_UNAUTHORIZED, {
              who: user.username,
              correlationId: expect.any(String),
            })
          })
      })
    })
  })

  describe('when we are currently on the staff portal', () => {
    beforeEach(() => {
      app = appWithAllRoutes({
        services: {
          auditServiceSource,
        },
        isStaffPortal: true,
      })
    })

    describe('GET /staff/prisons', () => {
      it('does not redirect to the 404 page', () => {
        return request(app)
          .get('/staff/prisons')
          .redirects(0)
          .expect(res => {
            expect(res.status).toEqual(200)
            expect(auditService.logPageView).toHaveBeenCalledWith(Page.STAFF_CHANGE_PRISON, {
              who: user.username,
              correlationId: expect.any(String),
            })
          })
      })
    })

    describe('POST /staff/prisons', () => {
      it('does not redirect to 404', () => {
        return request(app)
          .post('/staff/prisons')
          .send({ establishment: 'WYI' })
          .redirects(1)
          .expect(res => {
            expect(res.status).not.toBe(404)
          })
      })
    })
  })
})
