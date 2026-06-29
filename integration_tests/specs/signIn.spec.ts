import { expect, test } from '@playwright/test'
import { loginWithHmppsAuth, resetStubs, stubHomePageQueries } from '../testUtils'
import HomePage from '../pages/homePage'
import prisonerAuth from '../mockApis/prisonerAuth'
import hmppsAuth from '../mockApis/hmppsAuth'
import tokenVerification from '../mockApis/tokenVerification'

test.describe('SignIn (Prisoners login)', () => {
  test.use({
    baseURL: 'http://localhost:3007',
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test('Unauthenticated user directed to auth', async ({ page }) => {
    await prisonerAuth.stubSignInPage()
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Sign in', level: 1 })).toBeVisible()
  })

  test('Unauthenticated user navigating to sign in page directed to auth', async ({ page }) => {
    await prisonerAuth.stubSignInPage()
    await page.goto('/sign-in')

    await expect(page.getByRole('heading', { name: 'Sign in', level: 1 })).toBeVisible()
  })

  test('User with correct details is logged in successfully', async ({ page }) => {
    await Promise.all([
      prisonerAuth.favicon(),
      prisonerAuth.stubSignInPage(),
      prisonerAuth.token({ name: 'A TestUser', establishmentCode: 'BNI', expiresInSeconds: 9999 }),
      hmppsAuth.token({ name: 'A TestUser', roles: ['ROLE_PRISON'], authSource: 'nomis' }),
      tokenVerification.stubVerifyToken(true),
    ])

    await page.goto('/')

    const callbackUrl = await prisonerAuth.getSignInUrl()
    const response = await page.request.get(callbackUrl, { maxRedirects: 0 })

    expect(response.status()).toBe(302)
    expect(response.headers().location).toBe('/')
  })
})

test.describe('SignIn (Staff login)', () => {
  test.use({
    baseURL: 'http://staff.localhost:3007',
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test('Unauthenticated user directed to auth', async ({ page }) => {
    await hmppsAuth.stubSignInPage()
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Sign in', level: 1 })).toBeVisible()
  })

  test('Unauthenticated user navigating to sign in page directed to auth', async ({ page }) => {
    await hmppsAuth.stubSignInPage()
    await page.goto('/sign-in')

    await expect(page.getByRole('heading', { name: 'Sign in', level: 1 })).toBeVisible()
  })

  test('User with correct details is logged in successfully', async ({ page }) => {
    await stubHomePageQueries()
    await loginWithHmppsAuth(page, { name: 'A TestUser' })

    await HomePage.verifyOnPage(page)
  })

  test('Token verification failure takes user to sign in page', async ({ page }) => {
    await loginWithHmppsAuth(page, { active: false })

    await expect(page.getByRole('heading', { name: 'Sign in', level: 1 })).toBeVisible()
  })

  test.skip('Token verification failure clears user session', async ({ page }) => {
    await loginWithHmppsAuth(page, { name: 'A TestUser', active: false })

    await expect(page.getByRole('heading', { name: 'Sign in', level: 1 })).toBeVisible()

    await loginWithHmppsAuth(page, { name: 'Some OtherTestUser', active: true })

    await HomePage.verifyOnPage(page)
  })
})
