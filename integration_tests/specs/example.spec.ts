import { expect, test } from '@playwright/test'
import exampleApi from '../mockApis/exampleApi'

import { loginWithLaunchpadAuth, resetStubs } from '../testUtils'
import ExamplePage from '../pages/examplePage'

test.describe('Example', () => {
  test.beforeEach(async () => {
    await resetStubs()
  })

  test('Time from exampleApi is visible on page', async ({ page }) => {
    await exampleApi.stubExampleTime()
    await loginWithLaunchpadAuth(page)

    const examplePage = await ExamplePage.verifyOnPage(page)

    expect(examplePage.timestamp).toHaveText('The time is currently 2025-01-01T12:00:00Z')
  })

  test('ExampleApi failure shows error page', async ({ page }) => {
    await exampleApi.stubExampleTime(500)
    await loginWithLaunchpadAuth(page)

    await expect(page.locator('h1', { hasText: 'Internal Server Error' })).toBeVisible()
  })
})
