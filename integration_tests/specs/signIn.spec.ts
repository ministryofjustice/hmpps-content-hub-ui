import { expect, test } from '@playwright/test'
import exampleApi from '../mockApis/exampleApi'

import { loginWithHmppsAuth, loginWithLaunchpadAuth, resetStubs } from '../testUtils'
import HomePage from '../pages/homePage'
import launchpadAuth from '../mockApis/launchpadAuth'
import hmppsAuth from '../mockApis/hmppsAuth'

test.describe('SignIn (Prisoners login)', () => {
  test.use({
    baseURL: 'http://localhost:3007',
  })

  test.beforeEach(async () => {
    await exampleApi.stubExampleTime()
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test('Unauthenticated user directed to auth', async ({ page }) => {
    await launchpadAuth.stubSignInPage()
    await page.goto('/')

    await expect(page.getByRole('heading')).toHaveText('Sign in')
  })

  test('Unauthenticated user navigating to sign in page directed to auth', async ({ page }) => {
    await launchpadAuth.stubSignInPage()
    await page.goto('/sign-in')

    await expect(page.getByRole('heading')).toHaveText('Sign in')
  })

  test('Token verification failure does not affect user login (launchpad auth tokens should not be verified)', async ({
    page,
  }) => {
    await loginWithLaunchpadAuth(page, { active: false })

    await HomePage.verifyOnPage(page)
    await expect(page.getByRole('heading')).not.toHaveText('Sign in')
  })

  test('User with correct details is logged in successfully', async ({ page }) => {
    await loginWithLaunchpadAuth(page, { name: 'A TestUser' })

    const homePage = await HomePage.verifyOnPage(page)

    // TODO: this will have to change if we remove the name from the header
    await expect(homePage.usersName).toHaveText('A. Testuser')
  })
})

test.describe('SignIn (Staff login)', () => {
  test.use({
    baseURL: 'http://staff.localhost:3007',
  })

  test.beforeEach(async () => {
    await exampleApi.stubExampleTime()
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test('Unauthenticated user directed to auth', async ({ page }) => {
    await hmppsAuth.stubSignInPage()
    await page.goto('/')

    await expect(page.getByRole('heading')).toHaveText('Sign in')
  })

  test('Unauthenticated user navigating to sign in page directed to auth', async ({ page }) => {
    await hmppsAuth.stubSignInPage()
    await page.goto('/sign-in')

    await expect(page.getByRole('heading')).toHaveText('Sign in')
  })

  test('Phase banner visible in header', async ({ page }) => {
    await loginWithHmppsAuth(page)

    const homePage = await HomePage.verifyOnPage(page)

    await expect(homePage.phaseBanner).toHaveText('dev')
  })

  test('User with correct details is logged in successfully', async ({ page }) => {
    await loginWithHmppsAuth(page, { name: 'A TestUser' })

    const homePage = await HomePage.verifyOnPage(page)

    // TODO: this will have to change if we remove the name from the header
    await expect(homePage.usersName).toHaveText('A. Testuser')
  })

  test('Token verification failure takes user to sign in page', async ({ page }) => {
    await loginWithHmppsAuth(page, { active: false })

    await expect(page.getByRole('heading')).toHaveText('Sign in')
  })

  test('Token verification failure clears user session', async ({ page }) => {
    await loginWithHmppsAuth(page, { name: 'A TestUser', active: false })

    await expect(page.getByRole('heading')).toHaveText('Sign in')

    await loginWithHmppsAuth(page, { name: 'Some OtherTestUser', active: true })

    await HomePage.verifyOnPage(page)
  })
})
