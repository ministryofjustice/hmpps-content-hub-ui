import { Cache } from '../cache'

// eslint-disable-next-line import/prefer-default-export
export class InMemoryCache implements Cache {
  private readonly store: Record<string, string> = {}

  async cached<ValueType>(key: string, generateNewValue: () => Promise<ValueType>): Promise<ValueType> {
    const existingValue = this.store[key]
    if (existingValue) {
      return JSON.parse(existingValue) as ValueType
    }

    const newValue = await generateNewValue()
    this.store[key] = JSON.stringify(newValue)
    return newValue
  }
}
