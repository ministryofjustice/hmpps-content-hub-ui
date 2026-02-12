import { Request } from 'express'
import launchpadAuthStrategy from './launchpad/launchpadAuthStrategy'
import hmppsAuthStrategy from './hmpps/hmppsAuthStrategy'
import { isRequestForStaffPortal } from '../setUpPortals'
import { AuthStrategy } from './authStrategy'

const authStrategyFor: (req: Request) => AuthStrategy = req =>
  isRequestForStaffPortal(req) ? hmppsAuthStrategy : launchpadAuthStrategy

export default authStrategyFor
