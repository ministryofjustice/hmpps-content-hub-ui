import { Request, RequestHandler } from 'express'

export type AuthStrategyKind = 'launchpad-auth' | 'hmpps-auth'

export type AuthStrategy = {
  name: AuthStrategyKind
  signOutUrl: (req: Request) => string
  checkAuthentication: RequestHandler
}
