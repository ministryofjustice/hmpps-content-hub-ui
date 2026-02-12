import { i18n, TFunction } from 'i18next'
import { HmppsUser } from '../../interfaces/hmppsUser'
import { Establishment } from '../launchpad'

export declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    returnTo: string
    establishment?: Establishment
    passport: {
      user?: Express.User
    }
  }
}

export declare global {
  namespace Express {
    interface User {
      username: string
      token: string
      authSource: string
    }

    interface Request {
      verified?: boolean
      id: string
      authStrategy?: AuthStrategy
      logout(done: (err: unknown) => void): void
      t?: TFunction
      i18n?: i18n
      language?: string
    }

    interface Locals {
      user: HmppsUser
      isStaffPortal: boolean
      isPrisonerPortal: boolean
      establishment?: Establishment
    }
  }
}
