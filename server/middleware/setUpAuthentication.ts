import passport from 'passport'
import flash from 'connect-flash'
import { Router, Request } from 'express'
import { Strategy } from 'passport-oauth2'
import OpenIDConnectStrategy, { Profile, VerifyCallback } from 'passport-openidconnect'
import { VerificationClient, AuthenticatedRequest } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import { HmppsUser } from '../interfaces/hmppsUser'
import generateOauthClientToken from '../utils/clientCredentials'
import logger from '../../logger'
import { isRequestForStaffPortal } from './setUpPortals'
import launchpadUserFrom from './authentication/launchpad/launchpadUser'

passport.serializeUser((user, done) => {
  // Not used but required for Passport
  done(null, user)
})

passport.deserializeUser((user, done) => {
  // Not used but required for Passport
  done(null, user as Express.User)
})

passport.use(
  'hmpps-auth',
  new Strategy(
    {
      authorizationURL: `${config.apis.hmppsAuth.externalUrl}/oauth/authorize`,
      tokenURL: `${config.apis.hmppsAuth.url}/oauth/token`,
      clientID: config.apis.hmppsAuth.authClientId,
      clientSecret: config.apis.hmppsAuth.authClientSecret,
      callbackURL: `/sign-in/callback`,
      state: true,
      customHeaders: { Authorization: generateOauthClientToken() },
    },
    (token, refreshToken, params, profile, done) => {
      return done(null, { token, username: params.user_name, authSource: params.auth_source })
    },
  ),
)

passport.use(
  'launchpad-auth',
  new OpenIDConnectStrategy(
    {
      issuer: config.apis.launchpadAuth.externalUrl,
      authorizationURL: `${config.apis.launchpadAuth.externalUrl}/v1/oauth2/authorize`,
      tokenURL: `${config.apis.launchpadAuth.url}/v1/oauth2/token`,
      userInfoURL: null,
      skipUserProfile: true,
      clientID: config.apis.launchpadAuth.apiClientId,
      clientSecret: config.apis.launchpadAuth.apiClientSecret,
      callbackURL: `/sign-in/callback`,
      scope: config.apis.launchpadAuth.scopes.map(scope => scope.type),
      nonce: process.env.INTEGRATION_TESTS === 'true' ? undefined : 'true',
      customHeaders: {
        Authorization: generateOauthClientToken(
          config.apis.launchpadAuth.apiClientId,
          config.apis.launchpadAuth.apiClientSecret,
        ),
      },
    },
    async function verify(
      issuer: string,
      profile: Profile,
      context: object,
      idToken: string,
      accessToken: string,
      refreshToken: string,
      done: VerifyCallback,
    ) {
      const user = launchpadUserFrom(idToken, refreshToken, accessToken)
      return done(null, user as Express.User)
    },
  ),
)

export default function setupAuthentication() {
  const router = Router()
  const tokenVerificationClient = new VerificationClient(config.apis.tokenVerification, logger)

  router.use(passport.initialize())
  router.use(passport.session())
  router.use(flash())

  router.get('/autherror', (req, res) => {
    res.status(401)
    return res.render('autherror')
  })

  router.get('/sign-in', (req, res, next) => passport.authenticate(authStrategyFor(req))(req, res, next))

  router.get('/sign-in/callback', (req, res, next) =>
    passport.authenticate(authStrategyFor(req), {
      successReturnToOrRedirect: req.session.returnTo || '/',
      failureRedirect: '/autherror',
    })(req, res, next),
  )

  router.use('/sign-out', (req, res, next) => {
    const authSignOutUrl = signOutUrlFor(req)

    if (req.user) {
      req.logout(err => {
        if (err) return next(err)
        return req.session.destroy(() => res.redirect(authSignOutUrl))
      })
    } else res.redirect(authSignOutUrl)
  })

  router.use(async (req, res, next) => {
    if (req.isAuthenticated() && (await tokenVerificationClient.verifyToken(req as unknown as AuthenticatedRequest))) {
      return next()
    }
    req.session.returnTo = req.originalUrl
    return res.redirect('/sign-in')
  })

  router.use((req, res, next) => {
    res.locals.user = req.user as HmppsUser
    next()
  })

  return router
}

export const authStrategyFor: (req: Request) => 'hmpps-auth' | 'launchpad-auth' = req =>
  isRequestForStaffPortal(req) ? 'hmpps-auth' : 'launchpad-auth'

const signOutUrlFor: (req: Request) => string = req => {
  if (authStrategyFor(req) === 'hmpps-auth') {
    const { externalUrl, authClientId } = config.apis.hmppsAuth
    return `${externalUrl}/sign-out?client_id=${authClientId}&redirect_uri=${req.protocol}://${req.host}`
  }

  return '/'
}
