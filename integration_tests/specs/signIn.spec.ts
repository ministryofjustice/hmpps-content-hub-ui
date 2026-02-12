import { expect, test } from '@playwright/test'
import { loginWithHmppsAuth, loginWithLaunchpadAuth, resetStubs } from '../testUtils'
import HomePage from '../pages/homePage'
import launchpadAuth from '../mockApis/launchpadAuth'
import hmppsAuth from '../mockApis/hmppsAuth'

test.describe('SignIn (Prisoners login)', () => {
  test.use({
    baseURL: 'http://localhost:3007',
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test('Unauthenticated user directed to auth', async ({ page }) => {
    await launchpadAuth.stubSignInPage()
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Sign in', level: 1 })).toBeVisible()
  })

  test('Unauthenticated user navigating to sign in page directed to auth', async ({ page }) => {
    await launchpadAuth.stubSignInPage()
    await page.goto('/sign-in')

    await expect(page.getByRole('heading', { name: 'Sign in', level: 1 })).toBeVisible()
  })

  test('Token verification failure does not affect user login (launchpad auth tokens should not be verified)', async ({
    page,
  }) => {
    await loginWithLaunchpadAuth(page, { active: false })

    await HomePage.verifyOnPage(page)

    await expect(page.getByRole('heading', { name: 'Sign in', level: 1 })).not.toBeVisible()
  })

  test('User with correct details is logged in successfully', async ({ page }) => {
    await loginWithLaunchpadAuth(page, { name: 'A TestUser' })

    await HomePage.verifyOnPage(page)
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
    await loginWithHmppsAuth(page, { name: 'A TestUser' })

    await HomePage.verifyOnPage(page)
  })

  test('Token verification failure takes user to sign in page', async ({ page }) => {
    await loginWithHmppsAuth(page, { active: false })

    await expect(page.getByRole('heading', { name: 'Sign in', level: 1 })).toBeVisible()
  })

  test('Token verification failure clears user session', async ({ page }) => {
    await loginWithHmppsAuth(page, { name: 'A TestUser', active: false })

    await expect(page.getByRole('heading', { name: 'Sign in', level: 1 })).toBeVisible()

    await loginWithHmppsAuth(page, { name: 'Some OtherTestUser', active: true })

    await HomePage.verifyOnPage(page)
  })
})
