import { Router, Request, Response, NextFunction } from 'express'
import type { Services } from '../services'
import { Page } from '../services/auditService'
import config from '../config'

export default function nprRoutes({ auditServiceSource }: Services): Router {
  const router = Router()

  router.get('/npr', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { topics, user } = res.locals

      await auditServiceSource.get(req.portalType).logPageView(Page.NPR, {
        who: user?.username,
        correlationId: req.id,
      })

      res.render('pages/npr', {
        title: req.t('pages:npr.title'),
        media: config.nprStream,
        topics,
      })
    } catch (error) {
      next(error)
    }
  })

  return router
}
