import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from './testutils/appSetup'
import AuditService, { Page } from '../services/auditService'
import AuditServiceSource from '../services/auditServiceSource'

jest.mock('../services/auditService')

const prisonerAuditService = new AuditService(null) as jest.Mocked<AuditService>
const staffAuditService = new AuditService(null) as jest.Mocked<AuditService>
const auditServiceSource = new AuditServiceSource({
  prisoner: prisonerAuditService,
  staff: staffAuditService,
})
let app: Express

afterEach(() => {
  jest.resetAllMocks()
})

describe('Staff Routes', () => {
  describe('when we are currently on the prisoner portal', () => {
    afterEach(() => {
      expect(staffAuditService.logPageView).not.toHaveBeenCalled()
    })

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
            expect(prisonerAuditService.logPageView).toHaveBeenCalledWith(Page.STAFF_PORTAL_UNAUTHORIZED, {
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
            expect(prisonerAuditService.logPageView).toHaveBeenCalledWith(Page.STAFF_PORTAL_UNAUTHORIZED, {
              who: user.username,
              correlationId: expect.any(String),
            })
          })
      })
    })
  })

  describe('when we are currently on the staff portal', () => {
    afterEach(() => {
      expect(prisonerAuditService.logPageView).not.toHaveBeenCalled()
    })

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
            expect(staffAuditService.logPageView).toHaveBeenCalledWith(Page.STAFF_CHANGE_PRISON, {
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
