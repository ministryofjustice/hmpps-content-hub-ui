import { Router, Request, Response, NextFunction } from 'express'
import type { Services } from '../services'
import { Page } from '../services/auditService'

export default function contentRoutes({ auditService }: Services): Router {
  const router = Router()

  router.get('/content/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditService.logPageView(Page.CONTENT, {
        who: res.locals.user?.username,
        correlationId: req.id,
        subjectId: req.params.id,
      })

      throw new Error('Content route is functional - pending implementation')
    } catch (error) {
      next(error)
    }
  })

  return router
}
