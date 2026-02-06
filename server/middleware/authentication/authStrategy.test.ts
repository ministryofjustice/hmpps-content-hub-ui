import { Request } from 'express'
import { authStrategyFor } from './authStrategy'

describe('authStrategyFor', () => {
  describe('when we are on the prisoner portal', () => {
    const req = { host: 'contenthub-ui.com' } as Request

    it('the strategy is launchpad-auth', () => {
      expect(authStrategyFor(req).name).toBe('launchpad-auth')
    })
  })

  describe('when we are on the staff portal', () => {
    const req = { host: 'staff.contenthub-ui.com' } as Request

    it('the strategy is hmpps-auth', () => {
      expect(authStrategyFor(req).name).toBe('hmpps-auth')
    })
  })
})
