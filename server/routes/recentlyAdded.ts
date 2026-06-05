import { Router, Request, Response, NextFunction } from 'express'
import type { Services } from '../services'
import { Page } from '../services/auditService'

export default function recentlyAddedRoutes({ auditServiceSource, cmsService }: Services): Router {
  const router = Router()

  router.get('/recently-added', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { cspNonce, user, establishment, language } = res.locals
      await auditServiceSource.get(req.portalType).logPageView(Page.RECENTLY_ADDED, {
        who: user?.username,
        correlationId: req.id,
      })

      const { data, isLastPage } = await cmsService.getRecentlyAddedContent(establishment.name, language, undefined, 40)

      res.render('pages/recently-added', { cspNonce, content: data, isLastPage })
    } catch (error) {
      next(error)
    }
  })

  router.get('/recently-added/show-more', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, establishment, language } = res.locals
      await auditServiceSource.get(req.portalType).logPageView(Page.RECENTLY_ADDED_JSON, {
        who: user?.username,
        correlationId: req.id,
      })

      const { page } = req.query
      const { data, isLastPage } = await cmsService.getRecentlyAddedContent(
        establishment.name,
        language,
        Number(page),
        40,
      )

      res.render('partials/category/category-grid', { gridItems: data }, (_, html) => {
        res.json({ html, isLastPage })
      })
    } catch (error) {
      next(error)
    }
  })

  return router
}
