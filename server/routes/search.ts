import { Router, Request, Response, NextFunction } from 'express'
import type { Services } from '../services'
import { Page } from '../services/auditService'
import highlightMatchingText from '../utils/searchUtils'

export default function searchRoutes({ auditServiceSource, cmsService }: Services): Router {
  const router = Router()

  router.get('/search', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, establishment, language } = res.locals

      await auditServiceSource.get(req.portalType).logPageView(Page.SEARCH, {
        who: user?.username,
        correlationId: req.id,
      })

      const query = req.query.query as string
      const results = await cmsService.getSearchContent(establishment.name, query, 15)

      res.render('pages/search', {
        results,
        query,
        language,
      })
    } catch (error) {
      next(error)
    }
  })

  router.get('/search/suggest', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, establishment } = res.locals

      await auditServiceSource.get(req.portalType).logPageView(Page.SEARCH_SUGGEST, {
        who: user?.username,
        correlationId: req.id,
      })

      const query = req.query.query as string
      const results = await cmsService.getSearchContent(establishment.name, query, 5)
      const boldSearchTerms = results.map(result => highlightMatchingText(result, query))

      res.render('partials/search/typeahead', { results: boldSearchTerms }, (_, html) => {
        res.json({ html })
      })
    } catch (error) {
      next(error)
    }
  })

  return router
}
