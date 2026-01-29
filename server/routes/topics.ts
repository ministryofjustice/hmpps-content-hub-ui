import { Router, Request, Response, NextFunction } from 'express'
import type { Services } from '../services'
import { Page } from '../services/auditService'

export default function topicsRoutes({ auditService }: Services): Router {
  const router = Router()

  router.get('/topics', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditService.logPageView(Page.TOPICS, {
        who: res.locals.user?.username,
        correlationId: req.id,
      })

      throw new Error('Topics route is functional - pending implementation')
    } catch (error) {
      next(error)
    }
  })

  router.get('/tags/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditService.logPageView(Page.TAG, {
        who: res.locals.user?.username,
        correlationId: req.id,
        subjectId: req.params.id,
      })

      throw new Error('Tag route is functional - pending implementation')
    } catch (error) {
      next(error)
    }
  })

  router.get('/tags/:id/json', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditService.logPageView(Page.TAG_JSON, {
        who: res.locals.user?.username,
        correlationId: req.id,
        subjectId: req.params.id,
      })

      throw new Error('Tag JSON route is functional - pending implementation')
    } catch (error) {
      next(error)
    }
  })

  return router
}
