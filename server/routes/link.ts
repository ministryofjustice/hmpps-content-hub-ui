import { Router, Request, Response, NextFunction } from 'express'
import type { Services } from '../services'
import { Page } from '../services/auditService'

export default function linkRoutes({ auditServiceSource }: Services): Router {
  const router = Router()

  router.get('/link/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditServiceSource.get(req.portalType).logPageView(Page.LINK, {
        who: res.locals.user?.username,
        correlationId: req.id,
        subjectId: req.params.id?.toString(),
      })

      throw new Error('Link route is functional - pending implementation')
    } catch (error) {
      next(error)
    }
  })

  return router
}
