import { Router, Request, Response, NextFunction } from 'express'
import type { Services } from '../services'
import { Page } from '../services/auditService'

export default function homepageRoutes({ cmsService, auditServiceSource }: Services): Router {
  const router = Router()

  router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { language, user, establishment } = res.locals

      await auditServiceSource.get(req.portalType).logPageView(Page.HOMEPAGE, {
        who: user?.username,
        correlationId: req.id,
      })

      const {
        featuredContent,
        keyInfo,
        largeUpdateTile: largeUpdateTileSpecified,
      } = await cmsService.getHomepageContent(establishment.name, language)
      const recentlyAddedHomepageContent = await cmsService.getRecentlyAddedHomepageContent(
        establishment.name,
        language,
      )
      const exploreContent = await cmsService.getExploreContent(establishment.name, language)
      const { largeUpdateTileDefault, updatesContent, isLastPage } = await cmsService.getUpdatesContent(
        establishment.name,
        language,
      )

      const useLargeUpdateTile = Boolean(largeUpdateTileSpecified?.contentUrl)

      const largeUpdateTile = useLargeUpdateTile ? largeUpdateTileSpecified : largeUpdateTileDefault

      const updatesContentWithDuplicatesRemoved = updatesContent.filter(item => item.id !== largeUpdateTile.id)

      const tempRecentlyAdded = { data: [...recentlyAddedHomepageContent] }
      const updatesContentHideViewAll =
        isLastPage && (updatesContentWithDuplicatesRemoved.length < 5 || !useLargeUpdateTile)

      res.render('pages/index', {
        recentlyAddedHomepageContent: tempRecentlyAdded,
        featuredContent,
        exploreContent,
        updatesContent: updatesContentWithDuplicatesRemoved.splice(0, 4),
        largeUpdateTile,
        keyInfo,
        updatesContentHideViewAll,
      })
    } catch (error) {
      next(error)
    }
  })

  return router
}
