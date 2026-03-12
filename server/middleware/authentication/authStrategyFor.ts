import { Request } from 'express'
import { isRequestForStaffPortal } from '../setUpPortals'
import { AuthStrategy } from './authStrategy'
import prisonerAuthStrategy from './prisoner-auth/prisonerAuthStrategy'
import hmppsAuthStrategy from './hmpps-auth/hmppsAuthStrategy'

const authStrategyFor: (req: Request) => AuthStrategy = req =>
  isRequestForStaffPortal(req) ? hmppsAuthStrategy : prisonerAuthStrategy

export default authStrategyFor
