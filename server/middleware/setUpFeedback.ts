import { randomUUID } from 'crypto'
import express, { Router } from 'express'

export default function setUpFeedback(): Router {
  const router = express.Router()

  router.use((req, res, next) => {
    res.locals.feedbackId = randomUUID()
    next()
  })

  return router
}
