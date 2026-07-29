import { TimeSpan } from '@ministryofjustice/hmpps-prisoner-auth'

export interface Cache {
  cached<ValueType>(key: string, generateNewValue: () => Promise<ValueType>, ttlOverride?: TimeSpan): Promise<ValueType>
}
