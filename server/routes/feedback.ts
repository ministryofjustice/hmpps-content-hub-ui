import { Router, Request, Response, NextFunction } from 'express'
import type { Services } from '../services'
import { Page } from '../services/auditService'

export default function feedbackRoutes({ auditServiceSource }: Services): Router {
  const router = Router()

  router.post('/feedback/:feedbackId', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditServiceSource.get(req.portalType).logPageView(Page.FEEDBACK, {
        who: res.locals.user?.username,
        correlationId: req.id,
        subjectId: req.params.feedbackId?.toString(),
      })

      throw new Error('Feedback route is functional - pending implementation')
    } catch (error) {
      next(error)
    }
  })

  return router
}
