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

  test('User with correct details is logged in successfully', async ({ page }) => {
    await loginWithLaunchpadAuth(page, { name: 'A TestUser' })

    await HomePage.verifyOnPage(page)
  })

  test('User with expired token and cannot refresh it is redirected to auth', async ({ page }) => {
    await loginWithLaunchpadAuth(page, { name: 'A TestUser', tokenExpiresInSeconds: 1 })

    await expect(page.getByRole('heading')).toHaveText('Sign in')
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

  test('User with correct details is logged in successfully', async ({ page }) => {
    await loginWithHmppsAuth(page, { name: 'A TestUser' })

    await HomePage.verifyOnPage(page)
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
