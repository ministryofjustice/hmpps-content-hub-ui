import { Request } from 'express'
import { authStrategyFor } from './setUpAuthentication'

describe('authStrategyFor', () => {
  describe('when we are on the prisoner portal', () => {
    const req = { host: 'contenthub-ui.com' } as Request

    it('the strategy is launchpad-auth', () => {
      expect(authStrategyFor(req)).toBe('launchpad-auth')
    })
  })

  describe('when we are on the staff portal', () => {
    const req = { host: 'staff.contenthub-ui.com' } as Request

    it('the strategy is launchpad-auth', () => {
      expect(authStrategyFor(req)).toBe('hmpps-auth')
    })
  })
})
