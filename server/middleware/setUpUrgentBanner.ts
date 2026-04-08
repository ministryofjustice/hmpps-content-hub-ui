import { RequestHandler } from 'express'
import type CmsService from '../services/cmsService'
import config from '../config'
import logger from '../../logger'

export default function setUpUrgentBanner(cmsService: CmsService): RequestHandler {
  return async (req, res, next) => {
    const establishmentName = res.locals.establishment?.name || config.establishments[0].name
    const language = res.locals.language || 'en'

    try {
      res.locals.urgentBanners = await cmsService.getUrgentBanners(establishmentName, language)
    } catch (error) {
      logger.warn('Failed to load urgent banners', error)
      res.locals.urgentBanners = []
    }

    next()
  }
}
