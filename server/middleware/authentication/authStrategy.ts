import { Request } from 'express'
import { AuthenticatedRequest, VerificationClient } from '@ministryofjustice/hmpps-auth-clients'
import config from '../../config'
import logger from '../../../logger'
import { isRequestForStaffPortal } from '../setUpPortals'

export const authStrategyFor: (req: Request) => AuthStrategy = req =>
  isRequestForStaffPortal(req) ? hmppsAuthStrategy(req) : launchpadAuthStrategy(req)

export interface AuthStrategy {
  name: 'launchpad-auth' | 'hmpps-auth'
  signOutUrl: () => string
  tokenVerification: () => Promise<boolean>
  tokenRefresh: () => Promise<void>
}

const launchpadAuthStrategy: (req: Request) => AuthStrategy = _req => {
  return {
    name: 'launchpad-auth',
    signOutUrl: () => '/',
    tokenVerification: () => Promise.resolve(true),
    tokenRefresh: async () => {},
  }
}

const hmppsAuthStrategy: (req: Request) => AuthStrategy = req => {
  return {
    name: 'hmpps-auth',
    signOutUrl: () => {
      const { externalUrl, authClientId } = config.apis.hmppsAuth
      return `${externalUrl}/sign-out?client_id=${authClientId}&redirect_uri=${req.protocol}://${req.host}`
    },
    tokenVerification: async () =>
      new VerificationClient(config.apis.tokenVerification, logger).verifyToken(req as unknown as AuthenticatedRequest),
    tokenRefresh: async () => {},
  }
}
