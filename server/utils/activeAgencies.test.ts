import config from '../config'
import getActiveAgencies from './activeAgencies'

jest.mock('../config', () => ({
  establishments: [
    { code: 'BFI', name: 'bedford', displayName: 'HMP Bedford', youth: false, languages: ['en'], active: ['TEST'] },
    { code: 'BWI', name: 'berwyn', displayName: 'HMP Berwyn', youth: false, languages: ['en', 'cy'], active: [] },
    {
      code: 'BLI',
      name: 'bristol',
      displayName: 'HMP Bristol',
      youth: false,
      languages: ['en'],
      active: ['TEST', 'DEVELOPMENT'],
    },
  ],
}))

describe('getActiveAgencies', () => {
  describe('when the environment is TEST', () => {
    beforeAll(() => {
      process.env.ENVIRONMENT_NAME = 'TEST'
    })

    it('gets agency codes BFI and BLI as they are active in TEST', () => {
      expect(getActiveAgencies(config.establishments)).toEqual(['BFI', 'BLI'])
    })
  })

  describe('when the environment is DEVELOPMENT', () => {
    beforeAll(() => {
      process.env.ENVIRONMENT_NAME = 'DEVELOPMENT'
    })

    it('gets agency codes BLI as it is the only agency active in TEST', () => {
      expect(getActiveAgencies(config.establishments)).toEqual(['BLI'])
    })
  })

  describe('when the environment is something else entirely', () => {
    beforeAll(() => {
      process.env.ENVIRONMENT_NAME = 'PROD'
    })

    it('gets no agency codes as nothings is defined as active in PROD', () => {
      expect(getActiveAgencies(config.establishments)).toEqual([])
    })
  })

  it('returns an empty array if no establishments are active', () => {
    expect(getActiveAgencies([{ code: 'ABC', active: [] }])).toEqual([])
  })

  it('returns an empty array if no establishments provided', () => {
    expect(getActiveAgencies([])).toEqual([])
  })
})
