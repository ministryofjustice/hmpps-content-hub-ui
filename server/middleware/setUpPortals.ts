import express, { Router, Request, RequestHandler } from 'express'

export const isRequestForStaffPortal = (req: Request) => req.host.startsWith('staff.')

export const portalsMiddleware: RequestHandler = (req, res, next) => {
  const isStaffPortal = isRequestForStaffPortal(req)

  res.locals.isStaffPortal = isStaffPortal
  res.locals.isPrisonerPortal = !isStaffPortal

  next()
}

export default function setupPortals(): Router {
  const router = express.Router()

  router.use(portalsMiddleware)

  return router
}
