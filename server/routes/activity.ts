import { Router } from 'express'
import type { Services } from '../services'

export default function activityRoutes({ auditServiceSource }: Services): Router {
  const router = Router()

  router.post('/record/activity', async (req, res, next) => {
    try {
      const {
        videoPlayed,
        videoPaused,
        timeAwayFromPage,
        pageLoadedAt,
        timeOnPageInSeconds,
        path,
        contentId,
        journeyId,
        requestId,
      } = req.body

      await auditServiceSource.get(req.portalType).logAuditEvent({
        what: 'page-dwell-time',
        who: res.locals.user?.username,
        correlationId: req.id,
        details: {
          videoPlayed,
          videoPaused,
          timeAwayFromPage,
          pageLoadedAt,
          timeOnPageInSeconds,
          path,
          contentId,
          journeyId,
          requestId,
        },
      })
      return res.sendStatus(200)
    } catch (error) {
      return next(error)
    }
  })

  return router
}
