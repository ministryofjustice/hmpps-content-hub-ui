import { Request, Response } from 'express'
import { portalsMiddleware } from './setUpPortals'

describe('setupPortals middleware', () => {
  describe('when the user is on the staff portal (subdomain is staff.)', () => {
    const host = 'staff.prisoner-content-hub.prison.justice.gov.uk'
    const req = { host, originalUrl: `https://${host}` } as Request
    const res = { locals: {} } as Response
    const next = jest.fn()

    it('sets isPrisonerPortal to false', () => {
      portalsMiddleware(req, res, next)
      expect(res.locals.isPrisonerPortal).toBe(false)
    })

    it('sets isStaffPortal to true', () => {
      portalsMiddleware(req, res, next)
      expect(res.locals.isStaffPortal).toBe(true)
    })
  })

  describe('when the user is on the prisoner portal (subdomain is not staff.)', () => {
    const host = 'prisoner-content-hub.prison.justice.gov.uk'
    const req = { host, originalUrl: `https://${host}` } as Request
    const res = { locals: {} } as Response
    const next = jest.fn()

    it('sets isPrisonerPortal to true', () => {
      portalsMiddleware(req, res, next)
      expect(res.locals.isPrisonerPortal).toBe(true)
    })

    it('sets isStaffPortal to false', () => {
      portalsMiddleware(req, res, next)
      expect(res.locals.isStaffPortal).toBe(false)
    })
  })
})
