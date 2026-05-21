import { Router, Request, Response, NextFunction } from 'express'
import type { Services } from '../services'
import { Page } from '../services/auditService'

export default function updatesRoutes({ auditServiceSource, cmsService }: Services): Router {
  const router = Router()

  router.get('/updates', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { cspNonce, user, establishment, language } = res.locals
      await auditServiceSource.get(req.portalType).logPageView(Page.UPDATES, {
        who: user?.username,
        correlationId: req.id,
      })

      const { updatesContent, isLastPage } = await cmsService.getUpdatesContent(
        establishment.name,
        language,
        undefined,
        40,
      )

      res.render('pages/updates', { cspNonce, content: updatesContent, isLastPage })
    } catch (error) {
      next(error)
    }
  })

  router.get('/updates/show-more', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, establishment, language } = res.locals
      await auditServiceSource.get(req.portalType).logPageView(Page.UPDATES_JSON, {
        who: user?.username,
        correlationId: req.id,
      })

      const { page } = req.query
      const { updatesContent, isLastPage } = await cmsService.getUpdatesContent(
        establishment.name,
        language,
        Number(page),
        40,
      )

      res.render('partials/category/category-grid', { gridItems: updatesContent }, (_, html) => {
        res.json({ html, isLastPage })
      })
    } catch (error) {
      next(error)
    }
  })

  return router
}
