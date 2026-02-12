import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { minutes, seconds, timeAgo, timeFromNow } from '../../../utils/timeSpans'
import { LaunchpadUser } from '../../../interfaces/hmppsUser'
import launchpadAuthStrategy from './launchpadAuthStrategy'

// Allow the mocking of getUpdatedTokens
const mockGetUpdatedTokens = jest.fn()
jest.mock('./tokens', () => {
  const actualTokens = jest.requireActual('./tokens')
  return {
    ...actualTokens,
    getUpdatedTokens: () => mockGetUpdatedTokens(),
  }
})

type RequestSetup = {
  idToken?: 'hasExpired' | 'hasNotExpired'
  refreshToken?: 'hasExpired' | 'hasNotExpired'
  user?: 'isLoggedIn' | 'isNotLoggedIn'
}

describe('launchpadAuthStrategy.checkAuthentication middleware', () => {
  const aJWT = (obj: object) => jwt.sign(obj, 'secret')

  const aRequestWhere = (setup: RequestSetup): Request => {
    const tenSecondsAgo = timeAgo(seconds(10)).seconds
    const tenMinutesFromNow = timeFromNow(minutes(10)).seconds

    return {
      isAuthenticated: jest.fn(() => setup.user === 'isLoggedIn'),
      session: { passport: { user: {} } },
      originalUrl: '/example/path',
      user: {
        idToken: aJWT({ exp: setup.idToken === 'hasExpired' ? tenSecondsAgo : tenMinutesFromNow }),
        refreshToken: aJWT({ exp: setup.refreshToken === 'hasExpired' ? tenSecondsAgo : tenMinutesFromNow }),
      },
    } as unknown as Request
  }

  describe('when the user is logged in', () => {
    describe('and the idToken has expired', () => {
      describe('and the refresh token has expired', () => {
        it('redirects the user back to sign in', async () => {
          const req = aRequestWhere({ user: 'isLoggedIn', idToken: 'hasExpired', refreshToken: 'hasExpired' })
          const res = { redirect: jest.fn() } as unknown as Response
          const next = jest.fn()

          await launchpadAuthStrategy.checkAuthentication(req, res, next)

          expect(next).not.toHaveBeenCalled()
          expect(res.redirect).toHaveBeenCalledWith('/sign-in')
          expect(req.session.returnTo).toEqual('/example/path')
        })
      })

      describe('and the refresh token has not expired', () => {
        it('updates the user with the new tokens', async () => {
          const req = aRequestWhere({ user: 'isLoggedIn', idToken: 'hasExpired', refreshToken: 'hasNotExpired' })
          const res = { redirect: jest.fn() } as unknown as Response
          const next = jest.fn()

          const newTokens = {
            id_token: aJWT({ name: 'My Name', establishment: { agency_id: 'WYI' } }),
            refresh_token: aJWT({ anyOld: 'data' }),
            access_token: aJWT({ anyOld: 'data2' }),
          }
          mockGetUpdatedTokens.mockImplementation(() => newTokens)

          await launchpadAuthStrategy.checkAuthentication(req, res, next)

          expect(next).toHaveBeenCalled()
          const launchpadUser = req.user as LaunchpadUser
          expect(launchpadUser.idToken).toEqual(newTokens.id_token)
          expect(launchpadUser.refreshToken).toEqual(newTokens.refresh_token)
          expect(launchpadUser.accessToken).toEqual(newTokens.access_token)
          expect(launchpadUser.displayName).toEqual('My Name')
          expect(launchpadUser.establishment.code).toEqual('WYI')
          expect(launchpadUser.establishment.displayName).toEqual('HMYOI Wetherby')
          expect(req.user).toEqual(req.session.passport.user)
        })

        describe('and there is an issue getting new tokens', () => {
          it('redirects the user to /autherror', async () => {
            const req = aRequestWhere({ user: 'isLoggedIn', idToken: 'hasExpired', refreshToken: 'hasNotExpired' })
            const res = { redirect: jest.fn() } as unknown as Response
            const next = jest.fn()

            mockGetUpdatedTokens.mockImplementation(() => {
              throw Error('Fail!')
            })
            await launchpadAuthStrategy.checkAuthentication(req, res, next)

            expect(next).not.toHaveBeenCalled()
            expect(res.redirect).toHaveBeenCalledWith('/autherror')
          })
        })
      })
    })

    describe('and the idToken has not expired', () => {
      it('lets the user continue', async () => {
        const req = aRequestWhere({ user: 'isLoggedIn', idToken: 'hasNotExpired' })
        const res = { redirect: jest.fn() } as unknown as Response
        const next = jest.fn()

        await launchpadAuthStrategy.checkAuthentication(req, res, next)

        expect(next).toHaveBeenCalled()
      })
    })
  })

  describe('when the user is not logged in', () => {
    it('redirects the user back to sign in', async () => {
      const req = aRequestWhere({ user: 'isNotLoggedIn' })
      const res = { redirect: jest.fn() } as unknown as Response
      const next = jest.fn()

      await launchpadAuthStrategy.checkAuthentication(req, res, next)

      expect(next).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith('/sign-in')
      expect(req.session.returnTo).toEqual('/example/path')
    })
  })
})
