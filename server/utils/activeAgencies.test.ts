import config from '../config'
import getActiveAgencies from './activeAgencies'

jest.mock('../config', () => ({
  establishments: [
    { code: 'BFI', name: 'bedford', displayName: 'HMP Bedford', youth: false, languages: ['en'], active: true },
    { code: 'BWI', name: 'berwyn', displayName: 'HMP Berwyn', youth: false, languages: ['en', 'cy'], active: false },
    { code: 'BLI', name: 'bristol', displayName: 'HMP Bristol', youth: false, languages: ['en'], active: true },
  ],
}))

describe('getActiveAgencies', () => {
  it('gets agency codes for agencies which have a value of active:true in config.ts', () => {
    expect(getActiveAgencies(config.establishments)).toEqual(['BFI', 'BLI'])
  })

  it('returns an empty array if no establishments are active', () => {
    expect(getActiveAgencies([{ code: 'ABC', active: false }])).toEqual([])
  })

  it('returns an empty array if no establishments provided', () => {
    expect(getActiveAgencies([])).toEqual([])
  })
})
