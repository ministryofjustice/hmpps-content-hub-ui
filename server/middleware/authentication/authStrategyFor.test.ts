import { Request } from 'express'
import authStrategyFor from './authStrategyFor'

describe('authStrategyFor', () => {
  describe('when we are on the prisoner portal', () => {
    const req = { host: 'contenthub-ui.com' } as Request

    it('the strategy is prisoner-auth', () => {
      expect(authStrategyFor(req).name).toBe('prisoner-auth')
    })
  })

  describe('when we are on the staff portal', () => {
    const req = { host: 'staff.contenthub-ui.com' } as Request

    it('the strategy is hmpps-auth', () => {
      expect(authStrategyFor(req).name).toBe('hmpps-auth')
    })
  })
})
