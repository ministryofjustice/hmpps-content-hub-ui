import { Router, Request, Response, NextFunction } from 'express'
import helmet from 'helmet'
import type { Services } from '../services'
import { Page } from '../services/auditService'
import config from '../config'
import { DEFAULT_CSP_DIRECTIVES } from '../middleware/setUpWebSecurity'

const CONTENT_ROUTE_CSP = helmet.contentSecurityPolicy({
  directives: {
    ...DEFAULT_CSP_DIRECTIVES,
    styleSrc: ["'self'", "'unsafe-inline'"],
  },
})

export default function contentRoutes({ auditServiceSource, cmsService }: Services): Router {
  const router = Router()

  router.get('/content/:id', CONTENT_ROUTE_CSP, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const { establishment, feedbackId, language, user } = res.locals

      await auditServiceSource.get(req.portalType).logPageView(Page.CONTENT, {
        who: user?.username,
        correlationId: req.id,
        subjectId: id?.toString(),
      })

      const establishmentName = establishment?.name || config.establishments[0].name

      const data = await cmsService.getContent(establishmentName, parseInt(id?.toString(), 10), language || 'en')

      if (!data) {
        return next()
      }

      if (data.contentType === 'pdf') {
        return res.redirect(data.url)
      }

      const templateByContentType: Record<string, string> = {
        radio: 'pages/content/audio',
        video: 'pages/content/video',
        page: 'pages/content/page',
      }

      const template = templateByContentType[data.contentType]
      if (!template) return next()

      const topics = data.topics?.filter(topic => topic?.name) || []

      return res.render(template, {
        pageTitle: data.title,
        data: { ...data, topics },
        feedbackId,
        feedbackTitle: data.title,
        feedbackContentType: data.contentType,
        excludeFeedback: data.excludeFeedback,
        contentId: data.id,
      })
    } catch (error) {
      return next(error)
    }
  })

  return router
}
