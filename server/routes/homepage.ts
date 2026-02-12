import { Router, Request, Response, NextFunction } from 'express'
import type { Services } from '../services'
import { Page } from '../services/auditService'
import type { CmsTopicItem } from '../services/cmsService'
import config from '../config'
import logger from '../../logger'

export default function homepageRoutes({ auditService, cmsService }: Services): Router {
  const router = Router()

  router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditService.logPageView(Page.HOMEPAGE, {
        who: res.locals.user?.username,
        correlationId: req.id,
      })
      const establishmentName = res.locals.establishment?.name || config.establishments[0].name
      const language = res.locals.language || 'en'
      let topics: CmsTopicItem[] = []

      try {
        topics = await cmsService.getTopics(establishmentName, language)
      } catch (error) {
        logger.warn('Failed to load CMS topics for footer', error)
      }

      res.render('pages/index', { topics })
    } catch (error) {
      next(error)
    }
  })

  return router
}
