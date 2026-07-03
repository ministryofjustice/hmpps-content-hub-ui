import { LaunchpadUser } from '@ministryofjustice/hmpps-prisoner-auth'
import express, { RequestHandler, Router } from 'express'
import config from '../config'

type PrisonerEstablishmentUser = {
  idToken: {
    establishment: {
      agency_id: string
    }
  }
}

export const establishmentsMiddleware: RequestHandler = (req, res, next) => {
  // Staff can choose the establishment but by default are assigned the first establishment in the list
  if (res.locals.isStaffPortal) {
    const [firstEstablishment] = config.establishments
    res.locals.establishment = req.session.establishment || firstEstablishment
  }

  // Prisoners are assigned the establishment from login
  if (res.locals.isPrisonerPortal) {
    const prisonerUser = res.locals.user as LaunchpadUser & PrisonerEstablishmentUser
    res.locals.establishment = config.establishments.find(
      ({ code }) => code === prisonerUser.idToken.establishment.agency_id,
    )
  }

  next()
}

export default function setupEstablishments(): Router {
  const router = express.Router()

  router.use(establishmentsMiddleware)

  return router
}
