import jwt from 'jsonwebtoken'
import type { Request, Response } from 'express'
import createError from 'http-errors'

import authorisationMiddleware from './authorisationMiddleware'

function createToken(authorities: string[]) {
  const payload = {
    user_name: 'USER1',
    scope: ['read', 'write'],
    auth_source: 'nomis',
    authorities,
    jti: 'a610a10-cca6-41db-985f-e87efb303aaf',
    client_id: 'clientid',
  }

  return jwt.sign(payload, 'secret', { expiresIn: '1h' })
}

describe('authorisationMiddleware', () => {
  const req: Request = { session: { returnTo: '' } } as jest.Mocked<Request>
  const next = jest.fn()

  function createResWithToken({ authorities }: { authorities: string[] }): Response {
    return {
      locals: {
        user: {
          token: createToken(authorities),
        },
      },
      redirect: jest.fn(),
    } as unknown as Response
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should return next when no required roles', () => {
    const res = createResWithToken({ authorities: [] })

    authorisationMiddleware()(req, res, next)

    expect(next).toHaveBeenCalledWith()
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it('should throw a 403 error when user has no authorised roles', () => {
    const res = createResWithToken({ authorities: [] })

    authorisationMiddleware(['SOME_REQUIRED_ROLE'])(req, res, next)

    expect(next).toHaveBeenCalledWith(createError(403, 'Forbidden'))
  })

  it('should return next when user has authorised role', () => {
    const res = createResWithToken({ authorities: ['ROLE_SOME_REQUIRED_ROLE'] })

    authorisationMiddleware(['SOME_REQUIRED_ROLE'])(req, res, next)

    expect(next).toHaveBeenCalledWith()
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it('should return next when user has authorised role and middleware created with ROLE_ prefix', () => {
    const res = createResWithToken({ authorities: ['ROLE_SOME_REQUIRED_ROLE'] })

    authorisationMiddleware(['ROLE_SOME_REQUIRED_ROLE'])(req, res, next)

    expect(next).toHaveBeenCalledWith()
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it('should redirect to /sign-in when no user token is present', () => {
    const res = {
      redirect: jest.fn(),
    } as unknown as Response

    authorisationMiddleware(['ROLE_SOME_REQUIRED_ROLE'])(req, res, next)

    expect(next).not.toHaveBeenCalledWith()
    expect(res.redirect).toHaveBeenCalledWith('/sign-in')
  })
})
