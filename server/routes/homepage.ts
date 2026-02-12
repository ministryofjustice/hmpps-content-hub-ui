import { Router, Request, Response, NextFunction } from 'express'
import type { Services } from '../services'
import { Page } from '../services/auditService'

export default function homepageRoutes({ auditService }: Services): Router {
  const router = Router()

  router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditService.logPageView(Page.HOMEPAGE, {
        who: res.locals.user?.username,
        correlationId: req.id,
      })
      res.render('pages/index')
    } catch (error) {
      next(error)
    }
  })

  return router
}
