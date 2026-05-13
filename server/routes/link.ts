import { Router, Request, Response, NextFunction } from 'express'
import Cookies from 'cookies'
import type { Services } from '../services'
import { Page } from '../services/auditService'

export default function linkRoutes({ auditServiceSource, cmsService }: Services): Router {
  const router = Router()

  router.get('/link/:id', async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const { cspNonce, language, user, establishment } = res.locals

      await auditServiceSource.get(req.portalType).logPageView(Page.LINK, {
        who: user?.username,
        correlationId: req.id,
        subjectId: id,
      })

      const { url, intercept } = await cmsService.getLink(establishment?.name, id, language)
      const cookies = new Cookies(req, res)
      if (!intercept || cookies.get(`externalLink_${url}`) === 'true') {
        res.redirect(url)
        return
      }

      res.render('pages/externalLink', {
        url,
        cspNonce,
      })
    } catch (error) {
      next(error)
    }
  })

  return router
}
