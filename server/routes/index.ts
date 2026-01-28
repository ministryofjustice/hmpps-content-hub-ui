import { Router } from 'express'

import type { Services } from '../services'
import homepageRoutes from './homepage'
import topicsRoutes from './topics'
import contentRoutes from './content'
import searchRoutes from './search'

export default function routes(services: Services): Router {
  const router = Router()

  router.use(homepageRoutes(services))
  router.use(topicsRoutes(services))
  router.use(contentRoutes(services))
  router.use(searchRoutes(services))

  return router
}
