import { Router, Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import type { Services } from '../services'
import { Page } from '../services/auditService'

export default function notFoundRoutes({ auditService }: Services): Router {
  const router = Router()

  router.use(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditService.logPageView(Page.NOT_FOUND, {
        who: res.locals.user?.username,
        correlationId: req.id,
        details: { path: req.path },
      })

      next(createError(404, 'Not Found'))
    } catch (error) {
      next(error)
    }
  })

  return router
}
