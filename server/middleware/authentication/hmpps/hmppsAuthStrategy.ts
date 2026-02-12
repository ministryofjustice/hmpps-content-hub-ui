import { AuthenticatedRequest, VerificationClient } from '@ministryofjustice/hmpps-auth-clients'
import config from '../../../config'
import { AuthStrategy } from '../authStrategy'
import logger from '../../../../logger'

const hmppsAuthStrategy: AuthStrategy = {
  name: 'hmpps-auth',

  // Where to redirect to when signing out
  signOutUrl: req => {
    const { externalUrl, authClientId } = config.apis.hmppsAuth
    return `${externalUrl}/sign-out?client_id=${authClientId}&redirect_uri=${req.protocol}://${req.host}`
  },

  // Determine if user is authenticated either block or allow them to continue on
  checkAuthentication: async (req, res, next) => {
    const tokenVerificationClient = new VerificationClient(config.apis.tokenVerification, logger)

    if (req.isAuthenticated() && (await tokenVerificationClient.verifyToken(req as AuthenticatedRequest))) {
      return next()
    }

    req.session.returnTo = req.originalUrl
    return res.redirect('/sign-in')
  },
}

export default hmppsAuthStrategy
