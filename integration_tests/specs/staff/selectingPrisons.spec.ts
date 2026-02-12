import { expect, test } from '@playwright/test'
import { loginWithHmppsAuth, resetStubs } from '../../testUtils'
import HomePage from '../../pages/homePage'

test.describe('Staff member selects a prison to view content for', () => {
  test.use({
    baseURL: 'http://staff.localhost:3007',
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test('Selecting a prison displays it on the homepage', async ({ page }) => {
    await loginWithHmppsAuth(page, { name: 'Test User' })
    await HomePage.verifyOnPage(page)
    await page.getByText('Change prison').click()
    await page.getByText('HMP Cookham Wood').click()
    await page.getByText('Choose prison').click()
    await HomePage.verifyOnPage(page)
    expect(await page.content()).toContain('HMP Cookham Wood')
  })
})
