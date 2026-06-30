import { Router } from 'express'
import type { Services } from '../services'
import { isRequestForStaffPortal } from '../middleware/setUpPortals'

export type RecordActivityBody = {
  videoPlayed: { timesPressedPlay: number; totalPlayTimeInSeconds: number }
  videoPaused: { timesPressedPause: number; totalPausedTimeInSeconds: number }
  timeAwayFromPage: { timesSwitchedAwayFromPage: number; totalTimeAwayFromPageInSeconds: number }
  pageLoadedAt: Date
  timeOnPageInSeconds: number
  path: string
  contentId: string | undefined
  tagId: string | undefined
  journeyId: string
  requestId: string
}

export default function activityRoutes({ auditServiceSource }: Services): Router {
  const router = Router()

  router.post('/record/activity', async (req, res, next) => {
    if (isRequestForStaffPortal(req)) return res.sendStatus(200)

    const {
      videoPlayed,
      videoPaused,
      timeAwayFromPage,
      pageLoadedAt,
      timeOnPageInSeconds,
      path,
      contentId,
      tagId,
      journeyId,
      requestId,
    } = req.body as RecordActivityBody

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
        tagId,
        journeyId,
        requestId,
      },
    })

    return res.sendStatus(200)
  })

  return router
}
