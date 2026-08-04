import { RedisClient } from '@ministryofjustice/hmpps-auth-clients/src/main/types/RedisClient'
import { TimeSpan } from '@ministryofjustice/hmpps-prisoner-auth'
import { Cache } from '../cache'

class RedisCache implements Cache {
  private readonly redisClient: RedisClient

  private readonly cacheTtl: TimeSpan

  constructor(redisClient: RedisClient, cacheTtl: TimeSpan) {
    this.redisClient = redisClient
    this.cacheTtl = cacheTtl
  }

  async cached<ValueType>(
    key: string,
    generateNewValue: () => Promise<ValueType>,
    ttlOverride?: TimeSpan,
  ): Promise<ValueType> {
    await this.ensureRedisConnected()

    const existingValue = await this.redisClient.get(key)
    if (typeof existingValue === 'string') {
      return JSON.parse(existingValue) as ValueType
    }

    const newValue = await generateNewValue()
    await this.redisClient.set(key, JSON.stringify(newValue), {
      expiration: {
        type: 'EX',
        value: ttlOverride ? ttlOverride.seconds : this.cacheTtl.seconds,
      },
    })
    return newValue
  }

  private async ensureRedisConnected() {
    if (!this.redisClient.isOpen) {
      await this.redisClient.connect()
    }
  }
}

export default RedisCache
