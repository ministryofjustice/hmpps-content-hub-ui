import express, { Express } from 'express'
import { NotFound } from 'http-errors'
import i18next from 'i18next'
import { randomUUID } from 'crypto'
import routes from '../index'
import nunjucksSetup from '../../utils/nunjucksSetup'
import errorHandler from '../../errorHandler'
import type { Services } from '../../services'
import { HmppsUser } from '../../interfaces/hmppsUser'
import setUpWebSession from '../../middleware/setUpWebSession'
import setUpI18n from '../../middleware/setUpI18n'
import setUpFooterTopics from '../../middleware/setUpFooterTopics'
import setUpPrimaryNavigation from '../../middleware/setUpPrimaryNavigation'

export const user: HmppsUser = {
  name: 'FIRST LAST',
  userId: 'id',
  token: 'token',
  username: 'user1',
  displayName: 'First Last',
  authSource: 'nomis',
  staffId: 1234,
  userRoles: [],
}

export const flashProvider = jest.fn()

function appSetup(
  services: Services,
  production: boolean,
  userSupplier: () => HmppsUser,
  isStaffPortal: boolean,
): Express {
  const app = express()
  const mergedServices: Services = {
    ...defaultServices(),
    ...services,
  }

  app.set('view engine', 'njk')

  nunjucksSetup(app)
  app.use(setUpWebSession())
  app.use(setUpI18n())
  app.use((req, res, next) => {
    req.user = userSupplier() as Express.User
    req.flash = flashProvider
    res.locals = {
      ...res.locals,
      user: { ...req.user } as HmppsUser,
      isPrisonerPortal: !isStaffPortal,
      isStaffPortal,
    }
    req.portalType = isStaffPortal ? 'staff' : 'prisoner'
    next()
  })
  app.use((req, res, next) => {
    req.id = randomUUID()
    next()
  })
  app.use(setUpPrimaryNavigation(mergedServices.cmsService))
  app.use(setUpFooterTopics(mergedServices.cmsService))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(routes(mergedServices))
  app.use((req, res, next) => i18next.on('initialized', next))
  app.use((req, res, next) => next(new NotFound()))
  app.use(errorHandler(production))

  return app
}

export function appWithAllRoutes({
  production = false,
  services = {},
  userSupplier = () => user,
  isStaffPortal = false,
}: {
  production?: boolean
  services?: Partial<MockedServices>
  userSupplier?: () => HmppsUser
  isStaffPortal?: boolean
}): Express {
  return appSetup(services as Services, production, userSupplier, isStaffPortal)
}

// Provide a base working set of services to be overridden, merged with or just left
export const defaultServices = (): Partial<MockedServices> => {
  return {
    auditServiceSource: {
      get: jest.fn().mockReturnValue({
        logAuditEvent: jest.fn(),
        logPageView: jest.fn(),
      }),
    },
    cmsService: {
      getTopics: jest.fn().mockResolvedValue([]),
      getPrimaryNavigation: jest.fn().mockResolvedValue([]),
      getTag: jest.fn().mockResolvedValue(null),
    },
  }
}

// Partial, as the type system enforces we also mock private fields
// which we don't want to couple in tests
export type MockedServices = {
  [T in keyof Services]: Partial<Services[T]>
}
