import config from '../../../config'
import { LaunchpadUser } from '../../../interfaces/hmppsUser'
import { minutes, timeFromNow } from '../../../utils/timeSpans'
import { AuthStrategy } from '../authStrategy'
import { getUpdatedTokens, tokenHasNotExpired, userFromTokens } from './tokens'

const launchpadAuthStrategy: AuthStrategy = {
  name: 'launchpad-auth',

  // Where to redirect to when signing out
  signOutUrl: _req => '/',

  // Determine if user is authenticated, potentially refresh tokens and either block or allow them to continue on
  checkAuthentication: async (req, res, next) => {
    if (req.isAuthenticated()) {
      const { idToken, refreshToken } = req.user as LaunchpadUser

      const fiveMinsFromNow = timeFromNow(minutes(config.apis.launchpadAuth.refreshCheckTimeInMinutes))

      if (tokenHasNotExpired(idToken, fiveMinsFromNow)) {
        return next()
      }

      if (tokenHasNotExpired(refreshToken, fiveMinsFromNow)) {
        try {
          const updatedTokens = await getUpdatedTokens(refreshToken)
          const user = userFromTokens(updatedTokens.id_token, updatedTokens.refresh_token, updatedTokens.access_token)

          req.user = user
          req.session.passport.user = user

          return next()
        } catch {
          return res.redirect('/autherror')
        }
      }
    }

    req.session.returnTo = req.originalUrl
    return res.redirect('/sign-in')
  },
}

export default launchpadAuthStrategy
