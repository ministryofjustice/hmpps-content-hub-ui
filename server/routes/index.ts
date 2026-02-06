import { Router } from 'express'

import type { Services } from '../services'
import homepageRoutes from './homepage'
import topicsRoutes from './topics'
import contentRoutes from './content'
import searchRoutes from './search'
import recentlyAddedRoutes from './recentlyAdded'
import updatesRoutes from './updates'
import nprRoutes from './npr'
import linkRoutes from './link'
import gamesRoutes from './games'
import feedbackRoutes from './feedback'
import helpRoutes from './help'
import notFoundRoutes from './notFound'
import staffRoutes from './staff'

export default function routes(services: Services): Router {
  const router = Router()

  router.use(homepageRoutes(services))
  router.use(topicsRoutes(services))
  router.use(contentRoutes(services))
  router.use(searchRoutes(services))
  router.use(recentlyAddedRoutes(services))
  router.use(updatesRoutes(services))
  router.use(nprRoutes(services))
  router.use(linkRoutes(services))
  router.use(gamesRoutes(services))
  router.use(feedbackRoutes(services))
  router.use(helpRoutes(services))
  router.use(staffRoutes(services))
  router.use(notFoundRoutes(services))

  return router
}
