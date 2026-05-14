import { Router, Request, Response, NextFunction } from 'express'
import type { Services } from '../services'
import { Page } from '../services/auditService'
import config from '../config'

export default function helpRoutes({ auditServiceSource }: Services): Router {
  const router = Router()

  router.get('/help', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditServiceSource.get(req.portalType).logPageView(Page.HELP, {
        who: res.locals.user?.username,
        correlationId: req.id,
      })

      res.redirect(config.knownPages.help)
    } catch (error) {
      next(error)
    }
  })

  return router
}
