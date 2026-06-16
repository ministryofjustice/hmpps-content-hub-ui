import { AuthenticationClient, InMemoryTokenStore, RedisTokenStore } from '@ministryofjustice/hmpps-auth-clients'
import { minutes } from '@ministryofjustice/hmpps-prisoner-auth'
import applicationInfoSupplier from '../applicationInfo'

import { createRedisClient } from './redisClient'
import config from '../config'
import HmppsAuditClient from './hmppsAuditClient'
import logger from '../../logger'
import JsonApiClient from './jsonApiClient'
import FeedbackClient from './feedbackClient'
import { RedisCache } from '../services/cache/redisCache'
import { InMemoryCache } from '../services/cache/inMemoryCache'

const applicationInfo = applicationInfoSupplier()

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
