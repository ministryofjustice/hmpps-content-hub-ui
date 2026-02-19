import { Router, Request, Response, NextFunction } from 'express'
import type { Services } from '../services'
import { Page } from '../services/auditService'

export default function recentlyAddedRoutes({ auditServiceSource }: Services): Router {
  const router = Router()

  router.get('/recently-added', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditServiceSource.get(req.portalType).logPageView(Page.RECENTLY_ADDED, {
        who: res.locals.user?.username,
        correlationId: req.id,
      })

      throw new Error('Recently added route is functional - pending implementation')
    } catch (error) {
      next(error)
    }
  })

  router.get('/recently-added/json', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditServiceSource.get(req.portalType).logPageView(Page.RECENTLY_ADDED_JSON, {
        who: res.locals.user?.username,
        correlationId: req.id,
      })

      throw new Error('Recently added JSON route is functional - pending implementation')
    } catch (error) {
      next(error)
    }
  })

  return router
}
