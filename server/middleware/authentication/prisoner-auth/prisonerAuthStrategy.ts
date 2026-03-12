import { PrisonerAuth, minutes, LaunchpadUser } from '@ministryofjustice/hmpps-prisoner-auth'
import config from '../../../config'
import { AuthStrategy } from '../authStrategy'

export const prisonerAuth = new PrisonerAuth({
  launchpadAuthUrl: config.apis.prisonerAuth.externalUrl,
  clientId: config.apis.prisonerAuth.apiClientId,
  clientSecret: config.apis.prisonerAuth.apiClientSecret,
  tokenMinimumLifespan: minutes(config.apis.prisonerAuth.refreshCheckTimeInMinutes),
  nonce: process.env.INTEGRATION_TESTS !== 'true',
})

const prisonerAuthStrategy: AuthStrategy = {
  name: 'prisoner-auth',

  // Where to redirect to when signing out
  signOutUrl: _req => '/',

  // Determine if user is authenticated, potentially refresh tokens and either block or allow them to continue on
  checkAuthentication: async (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.session.returnTo = req.originalUrl
      return res.redirect('/sign-in')
    }

    return prisonerAuth
      .validateAndRefreshUser(req.user as LaunchpadUser)
      .then(user => {
        req.user = user
        next()
      })
      .catch(() => res.redirect('/sign-out'))
  },
}

export default prisonerAuthStrategy
