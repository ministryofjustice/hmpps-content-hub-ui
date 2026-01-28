import { Router, Request, Response, NextFunction } from 'express'
import type { Services } from '../services'
import { Page } from '../services/auditService'

export default function searchRoutes({ auditService }: Services): Router {
  const router = Router()

  router.get('/search', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditService.logPageView(Page.SEARCH, {
        who: res.locals.user?.username,
        correlationId: req.id,
      })

      throw new Error('Search route is functional - pending implementation')
    } catch (error) {
      next(error)
    }
  })

  router.get('/search/suggest', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditService.logPageView(Page.SEARCH_SUGGEST, {
        who: res.locals.user?.username,
        correlationId: req.id,
      })

      throw new Error('Search suggest route is functional - pending implementation')
    } catch (error) {
      next(error)
    }
  })

  return router
}
