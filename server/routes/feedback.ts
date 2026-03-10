import { Router, Request, Response, NextFunction } from 'express'
import type { Services } from '../services'
import { Page } from '../services/auditService'
import type { FeedbackPayload, FeedbackContentType, FeedbackSentiment, FeedbackRecord } from '../@types/feedbackTypes'
import logger from '../../logger'

const VALID_CONTENT_TYPES: FeedbackContentType[] = ['article', 'video', 'audio', 'game', 'series', 'topic', 'category']
const VALID_SENTIMENTS: FeedbackSentiment[] = ['LIKE', 'DISLIKE']

function isUUID(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
}

function validateFeedbackPayload(body: unknown): FeedbackPayload | null {
  if (typeof body !== 'object' || body === null) return null

  const { title, url, contentType, sentiment, series, categories, topics, comment } = body as Record<string, unknown>

  if (typeof title !== 'string') return null
  if (typeof url !== 'string') return null
  if (!VALID_CONTENT_TYPES.includes(contentType as FeedbackContentType)) return null
  if (!VALID_SENTIMENTS.includes(sentiment as FeedbackSentiment)) return null

  if (series !== undefined && typeof series !== 'string') return null
  if (categories !== undefined && typeof categories !== 'string') return null
  if (topics !== undefined && typeof topics !== 'string') return null
  if (comment !== undefined && typeof comment !== 'string') return null

  return {
    title,
    url,
    contentType,
    sentiment,
    ...(series !== undefined && { series }),
    ...(categories !== undefined && { categories }),
    ...(topics !== undefined && { topics }),
    ...(comment !== undefined && { comment }),
  } as FeedbackPayload
}

export default function feedbackRoutes({ auditServiceSource, feedbackService }: Services): Router {
  const router = Router()

  router.post('/feedback/:feedbackId', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const feedbackId = String(req.params.feedbackId)

      if (!isUUID(feedbackId)) {
        res.status(400).send()
        return
      }

      const payload = validateFeedbackPayload(req.body)
      if (!payload) {
        res.status(400).send()
        return
      }

      await auditServiceSource.get(req.portalType).logPageView(Page.FEEDBACK, {
        who: res.locals.user?.username,
        correlationId: req.id,
        subjectId: feedbackId,
      })

      const record: FeedbackRecord = {
        ...payload,
        feedbackId,
        date: new Date().toISOString(),
        establishment: res.locals.establishment?.displayName?.toUpperCase() as string | undefined,
        sessionId: String(req.sessionID),
      }

      logger.info('Feedback from user %s: %s', res.locals.user?.username ?? 'anon', feedbackId)

      void feedbackService.sendFeedback(record)

      res.status(200).send()
    } catch (error) {
      next(error)
    }
  })

  return router
}
