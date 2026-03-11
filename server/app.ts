import express from 'express'

import errorHandler from './errorHandler'
import authorisationMiddleware from './middleware/authorisationMiddleware'
import { appInsightsMiddleware } from './utils/azureAppInsights'
import nunjucksSetup from './utils/nunjucksSetup'

import setUpAuthentication from './middleware/setUpAuthentication'
import setUpCsrf from './middleware/setUpCsrf'
import setUpCurrentUser from './middleware/setUpCurrentUser'
import setUpHealthChecks from './middleware/setUpHealthChecks'
import setUpI18n from './middleware/setUpI18n'
import setUpWebRequestParsing from './middleware/setupRequestParsing'
import setUpStaticResources from './middleware/setUpStaticResources'
import setUpWebSecurity from './middleware/setUpWebSecurity'
import setUpWebSession from './middleware/setUpWebSession'
import setUpContentHubHeader from './middleware/setUpContentHubHeader'
import setUpFeedback from './middleware/setUpFeedback'
import setUpFooterTopics from './middleware/setUpFooterTopics'
import setUpPrimaryNavigation from './middleware/setUpPrimaryNavigation'
import setupEstablishments from './middleware/setUpEstablishments'
import setupPortals from './middleware/setUpPortals'

import routes from './routes'
import type { Services } from './services'

export default function createApp(services: Services): express.Application {
  const app = express()

  app.set('json spaces', 2)
  app.set('trust proxy', true)
  app.set('port', process.env.PORT || 3000)

  app.use(appInsightsMiddleware())
  app.use(setUpHealthChecks(services.applicationInfo))
  app.use(setUpWebSecurity())
  app.use(setUpWebSession())

  app.use(setUpWebRequestParsing())
  app.use(setUpStaticResources())

  const njkEnv = nunjucksSetup(app)

  app.use(setUpI18n())
  // Nunjucks macros imported via {% from %} have isolated scope and lose access
  // to res.locals (including the i18next `t` function). Setting `t` as a Nunjucks
  // global per-request makes it available to the `| t` filter inside macros.
  app.use((req, _res, next) => {
    njkEnv.addGlobal('t', req.t)
    next()
  })

  app.use(setupPortals())
  app.use(setUpAuthentication())
  app.use(authorisationMiddleware())
  app.use(setUpCsrf())
  app.use(setUpCurrentUser())
  app.use(setUpContentHubHeader())
  app.use(setUpFeedback())
  app.use(setupEstablishments())
  app.use(setUpPrimaryNavigation(services.cmsService))
  app.use(setUpFooterTopics(services.cmsService))

  app.use(routes(services))

  app.use(errorHandler(process.env.NODE_ENV === 'production'))

  return app
}
