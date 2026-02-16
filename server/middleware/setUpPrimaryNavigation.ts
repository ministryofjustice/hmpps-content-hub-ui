import { RequestHandler } from 'express'
import type CmsService from '../services/cmsService'
import config from '../config'
import logger from '../../logger'

export default function setUpPrimaryNavigation(cmsService: CmsService): RequestHandler {
  return async (req, res, next) => {
    const establishmentName = res.locals.establishment?.name || config.establishments[0].name
    const language = res.locals.language || 'en'

    try {
      res.locals.primaryNavigation = await cmsService.getPrimaryNavigation(establishmentName, language)
    } catch (error) {
      logger.warn('Failed to load CMS primary navigation', error)
      res.locals.primaryNavigation = []
    }

    next()
  }
}
