import { Router, Request, Response, NextFunction } from 'express'
import type { Services } from '../services'
import { Page } from '../services/auditService'
import config from '../config'

export default function contentRoutes({ auditServiceSource, cmsService }: Services): Router {
  const router = Router()

  router.get('/content/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params

      await auditServiceSource.get(req.portalType).logPageView(Page.CONTENT, {
        who: res.locals.user?.username,
        correlationId: req.id,
        subjectId: id?.toString(),
      })

      const establishmentName = res.locals.establishment?.name || config.establishments[0].name
      const language = res.locals.language || 'en'

      const data = await cmsService.getContent(establishmentName, parseInt(id?.toString(), 10), language)

      if (!data) {
        return next()
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
        feedbackId: data.excludeFeedback ? undefined : data.id,
        feedbackTitle: data.title,
        feedbackContentType: data.contentType,
        excludeFeedback: data.excludeFeedback,
      })
    } catch (error) {
      return next(error)
    }
  })

  return router
}
