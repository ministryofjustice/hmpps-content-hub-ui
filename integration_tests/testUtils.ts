import { Page } from '@playwright/test'
import tokenVerification from './mockApis/tokenVerification'
import hmppsAuth, { type UserToken } from './mockApis/hmppsAuth'
import componentApi from './mockApis/componentApi'
import { resetStubs } from './mockApis/wiremock'
import launchpadAuth from './mockApis/launchpadAuth'

export { resetStubs }

const DEFAULT_ROLES = ['ROLE_SOME_REQUIRED_ROLE']

export const attemptHmppsAuthLogin = async (page: Page) => {
  await page.goto('/')
  page.locator('h1', { hasText: 'Sign in' })
  const url = await hmppsAuth.getSignInUrl()
  await page.goto(url)
}

export const loginWithHmppsAuth = async (
  page: Page,
  { name, roles = DEFAULT_ROLES, active = true, authSource = 'nomis' }: UserToken & { active?: boolean } = {},
) => {
  await Promise.all([
    hmppsAuth.favicon(),
    hmppsAuth.stubSignInPage(),
    hmppsAuth.token({ name, roles, authSource }),
    tokenVerification.stubVerifyToken(active),
    componentApi.stubComponents(),
  ])
  await attemptHmppsAuthLogin(page)
}

export const attemptLaunchpadAuthLogin = async (page: Page) => {
  await page.goto('/')
  page.locator('h1', { hasText: 'Sign in' })
  const url = await launchpadAuth.getSignInUrl()
  await page.goto(url)
}

export const loginWithLaunchpadAuth = async (
  page: Page,
  {
    name = 'A TestUser',
    establishmentCode = 'BNI',
    active = true,
    roles = DEFAULT_ROLES,
  }: { active?: boolean; roles?: string[]; name?: string; establishmentCode?: string } = {},
) => {
  await Promise.all([
    launchpadAuth.favicon(),
    launchpadAuth.stubSignInPage(),
    launchpadAuth.token({ name, establishmentCode }),
    hmppsAuth.token({ name, roles, authSource: 'nomis' }),
    tokenVerification.stubVerifyToken(active),
  ])
  await attemptLaunchpadAuthLogin(page)
}
