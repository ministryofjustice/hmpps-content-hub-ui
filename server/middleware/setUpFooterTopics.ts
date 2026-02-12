import { RequestHandler } from 'express'
import type CmsService from '../services/cmsService'
import config from '../config'
import logger from '../../logger'

export default function setUpFooterTopics(cmsService: CmsService): RequestHandler {
  return async (req, res, next) => {
    const establishmentName = res.locals.establishment?.name || config.establishments[0].name
    const language = res.locals.language || 'en'

    try {
      res.locals.topics = await cmsService.getTopics(establishmentName, language)
    } catch (error) {
      logger.warn('Failed to load CMS topics for footer', error)
      res.locals.topics = []
    }

    next()
  }
}
