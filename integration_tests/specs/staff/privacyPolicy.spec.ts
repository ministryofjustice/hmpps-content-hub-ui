import { expect, test } from '@playwright/test'
import { loginWithHmppsAuth, resetStubs, stubHomePageQueries } from '../../testUtils'
import HomePage from '../../pages/homePage'
import cmsApi from '../../mockApis/cmsApi'

const PRIVACY_NID = 4856
const PRIVACY_UUID = 'privacy-page-uuid-4856'
const PRIVACY_TITLE = 'Privacy'

const stubPrivacyPage = () =>
  Promise.all([
    cmsApi.stubContentLookupByNid({ nid: PRIVACY_NID, uuid: PRIVACY_UUID }),
    cmsApi.stubPageContentByUuid({ uuid: PRIVACY_UUID, nid: PRIVACY_NID, title: PRIVACY_TITLE }),
  ])

test.describe('Staff privacy policy', () => {
  test.use({
    baseURL: 'http://staff.localhost:3007',
  })

  test.beforeEach(async () => {
    await resetStubs()
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test('Footer privacy policy link is visible and points to privacy content', async ({ page }) => {
    await stubHomePageQueries()

    await loginWithHmppsAuth(page, { name: 'A TestUser' })

    await HomePage.verifyOnPage(page)

    const privacyLink = page.getByRole('contentinfo').getByRole('link', { name: 'Privacy' })
    await expect(privacyLink).toBeVisible()
    await expect(privacyLink).toHaveAttribute('href', '/content/4856')
  })

  test('Footer privacy policy link opens the privacy page', async ({ page }) => {
    await Promise.all([stubHomePageQueries(), stubPrivacyPage()])

    await loginWithHmppsAuth(page, { name: 'A TestUser' })

    await HomePage.verifyOnPage(page)

    await page.getByRole('contentinfo').getByRole('link', { name: 'Privacy' }).click()

    await expect(page).toHaveURL(/\/content\/4856/)
    await expect(page.getByRole('heading', { level: 1, name: PRIVACY_TITLE })).toBeVisible()
  })
})
