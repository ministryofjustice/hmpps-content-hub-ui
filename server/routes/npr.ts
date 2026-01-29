import { Router, Request, Response, NextFunction } from 'express'
import type { Services } from '../services'
import { Page } from '../services/auditService'

export default function nprRoutes({ auditService }: Services): Router {
  const router = Router()

  router.get('/npr', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditService.logPageView(Page.NPR, {
        who: res.locals.user?.username,
        correlationId: req.id,
      })

      throw new Error('NPR route is functional - pending implementation')
    } catch (error) {
      next(error)
    }
  })

  return router
}
