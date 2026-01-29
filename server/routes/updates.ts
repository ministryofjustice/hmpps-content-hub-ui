import { Router, Request, Response, NextFunction } from 'express'
import type { Services } from '../services'
import { Page } from '../services/auditService'

export default function updatesRoutes({ auditService }: Services): Router {
  const router = Router()

  router.get('/updates', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditService.logPageView(Page.UPDATES, {
        who: res.locals.user?.username,
        correlationId: req.id,
      })

      throw new Error('Updates route is functional - pending implementation')
    } catch (error) {
      next(error)
    }
  })

  router.get('/updates/json', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditService.logPageView(Page.UPDATES_JSON, {
        who: res.locals.user?.username,
        correlationId: req.id,
      })

      throw new Error('Updates JSON route is functional - pending implementation')
    } catch (error) {
      next(error)
    }
  })

  return router
}
