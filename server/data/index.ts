/* eslint-disable import/first */
/*
 * Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
 * In particular, applicationinsights automatically collects bunyan logs
 */
import { AuthenticationClient, InMemoryTokenStore, RedisTokenStore } from '@ministryofjustice/hmpps-auth-clients'
import { minutes } from '@ministryofjustice/hmpps-prisoner-auth'
import { initialiseAppInsights, buildAppInsightsClient } from '../utils/azureAppInsights'
import applicationInfoSupplier from '../applicationInfo'

const applicationInfo = applicationInfoSupplier()
initialiseAppInsights()
buildAppInsightsClient(applicationInfo)

import { createRedisClient } from './redisClient'
import config from '../config'
import HmppsAuditClient from './hmppsAuditClient'
import logger from '../../logger'
import JsonApiClient from './jsonApiClient'
import FeedbackClient from './feedbackClient'
import { RedisCache } from '../services/cache/redisCache'
import { InMemoryCache } from '../services/cache/inMemoryCache'

export const dataAccess = () => {
  const hmppsAuthClient = new AuthenticationClient(
    config.apis.hmppsAuth,
    logger,
    config.redis.enabled ? new RedisTokenStore(createRedisClient()) : new InMemoryTokenStore(),
  )

  const jsonApiClient = new JsonApiClient(
    hmppsAuthClient,
    config.redis.enabled ? new RedisCache(createRedisClient(), minutes(5)) : new InMemoryCache(),
  )

  return {
    applicationInfo,
    hmppsAuthClient,
    jsonApiClient,
    hmppsPrisonerAuditClient: new HmppsAuditClient(config.sqs.prisonerAudit),
    hmppsStaffAuditClient: new HmppsAuditClient(config.sqs.staffAudit),
    feedbackClient: new FeedbackClient(),
  }
}

export type DataAccess = ReturnType<typeof dataAccess>

export { AuthenticationClient, HmppsAuditClient, JsonApiClient, FeedbackClient }
