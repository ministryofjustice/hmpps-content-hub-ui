import { RequestHandler } from 'express'
import type CmsService from '../services/cmsService'
import config from '../config'
import logger from '../../logger'

export default function setUpPrimaryNavigation(cmsService: CmsService): RequestHandler {
  return async (req, res, next) => {
    const establishmentName = res.locals.establishment?.name || config.establishments[0].name
    const language = res.locals.language || 'en'

    try {
      const primaryNavigation = await cmsService.getPrimaryNavigation(establishmentName, language)
      res.locals.primaryNavigation = primaryNavigation
      res.locals.originalUrl = req.originalUrl.match(/games/)
        ? primaryNavigation.find(({ text = '' }) => text.toLowerCase().includes('inspire and entertain'))?.href
        : req.originalUrl
    } catch (error) {
      logger.warn('Failed to load CMS primary navigation', error)
      res.locals.primaryNavigation = []
    }

    next()
  }
}
