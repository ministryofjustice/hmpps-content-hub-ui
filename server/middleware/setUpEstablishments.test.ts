import { Request, Response } from 'express'
import { establishmentsMiddleware } from './setUpEstablishments'

describe('establishmentsMiddleware', () => {
  describe('when we are on the prisoners portal', () => {
    const req = {} as Request
    const res = { locals: { isPrisonerPortal: true, user: { establishment: { code: 'LEI' } } } } as Response
    const next = jest.fn()

    it('sets the establishment to the one given at authentication', () => {
      establishmentsMiddleware(req, res, next)
      expect(res.locals.establishment.code).toBe('LEI')
    })
  })

  describe('when we are on the staff portal', () => {
    describe('when the staff member has selected a prison already', () => {
      const req = { session: { establishment: { code: 'WHI' } } } as Request
      const res = { locals: { isStaffPortal: true } } as Response
      const next = jest.fn()

      it('sets the establishment to the one chosen by the user', () => {
        establishmentsMiddleware(req, res, next)
        expect(res.locals.establishment.code).toBe('WHI')
      })
    })

    describe('when the staff member has not yet selected a prison', () => {
      const req = { session: {} } as Request
      const res = { locals: { isStaffPortal: true } } as Response
      const next = jest.fn()

      it('sets the establishment to the first one in the config list', () => {
        establishmentsMiddleware(req, res, next)
        expect(res.locals.establishment.code).toBe('BNI')
      })
    })
  })
})
