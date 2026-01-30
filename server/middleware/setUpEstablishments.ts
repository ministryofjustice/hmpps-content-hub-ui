import express, { RequestHandler, Router } from 'express'
import config from '../config'
import { LaunchpadUser } from '../interfaces/hmppsUser'

export const establishmentsMiddleware: RequestHandler = (req, res, next) => {
  // Staff can choose the establishment but by default are assigned the first establishment in the list
  if (res.locals.isStaffPortal) {
    const [firstEstablishment] = config.establishments
    res.locals.establishment = req.session.establishment || firstEstablishment
  }

  // Prisoners are assigned the establishment from login
  if (res.locals.isPrisonerPortal) {
    res.locals.establishment = (res.locals.user as LaunchpadUser).establishment
  }

  next()
}

export default function setupEstablishments(): Router {
  const router = express.Router()

  router.use(establishmentsMiddleware)

  return router
}
