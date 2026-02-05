import { RequestHandler } from 'express'
import { getFrontendComponents } from '@ministryofjustice/hmpps-connect-dps-components'
import config from '../config'
import logger from '../../logger'

export default function setUpDpsComponents(): RequestHandler {
  return getFrontendComponents({
    logger,
    componentApiConfig: config.apis.componentApi,
    dpsUrl: config.serviceUrls.digitalPrison,
    requestOptions: { includeSharedData: true },
  })
}
