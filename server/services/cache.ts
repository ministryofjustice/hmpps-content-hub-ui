export interface Cache {
  cached<ValueType>(key: string, generateNewValue: () => Promise<ValueType>): Promise<ValueType>
}
