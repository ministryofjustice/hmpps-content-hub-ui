import { expect, test } from '@playwright/test'
import { loginWithHmppsAuth, resetStubs, stubHomePageQueries } from '../../testUtils'
import HomePage from '../../pages/homePage'
import config from '../../../server/config'

test.describe('Staff member selects a prison to view content for', () => {
  test.use({
    baseURL: 'http://staff.localhost:3007',
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test('Selecting each prison displays it on the homepage', async ({ page }) => {
    await stubHomePageQueries()

    await loginWithHmppsAuth(page, { name: 'Test User' })
    await HomePage.verifyOnPage(page)

    await config.establishments.reduce(async (chain, { displayName }) => {
      await chain

      await page.getByRole('link', { name: 'Change prison' }).click()
      await expect(page.getByRole('heading', { name: 'Change prison', level: 1 })).toBeVisible()
      await page.getByRole('radio', { name: displayName }).check()
      await page.getByRole('button', { name: 'Choose prison' }).click()

      await HomePage.verifyOnPage(page)
      await expect(page.getByLabel('Organisation switcher')).toContainText(displayName)
      await expect(page).toHaveURL('/')
    }, Promise.resolve())
  })
})
