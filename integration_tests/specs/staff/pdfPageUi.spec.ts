import { expect, test } from '@playwright/test'
import { loginWithHmppsAuth, resetStubs } from '../../testUtils'
import HomePage from '../../pages/homePage'
import cmsApi from '../../mockApis/cmsApi'
import config from '../../../server/config'
import pdfTestContent, {
  PDF_HOMEPAGE_COLLECTION_RESPONSE,
  PDF_HOMEPAGE_CONTENT_RESPONSE,
} from '../../fixtures/pdfPageData'

const stubPdfContentPage = async () =>
  Promise.all([
    cmsApi.stubPrimaryNavigation(),
    cmsApi.stubTopics(),
    cmsApi.stubUrgentBanner(),
    cmsApi.stubHomepageContent(200, PDF_HOMEPAGE_CONTENT_RESPONSE),
    cmsApi.stubHomepageCollectionQueries(200, PDF_HOMEPAGE_COLLECTION_RESPONSE),
    cmsApi.stubRecentlyAddedHomepageContent(),
    cmsApi.stubExploreHomepageContent(),
  ])

test.describe('Staff PDF page UI', () => {
  test.use({
    baseURL: 'http://staff.localhost:3007',
  })

  test.beforeEach(async () => {
    await resetStubs()
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test('Homepage updates tile opens PDF content via redirect', async ({ page }) => {
    await stubPdfContentPage()

    await loginWithHmppsAuth(page, { name: 'A TestUser' })

    await HomePage.verifyOnPage(page)
    await page.getByRole('link', { name: 'Change prison' }).click()
    await expect(page.getByRole('heading', { name: 'Change prison', level: 1 })).toBeVisible()
    await page.getByRole('radio', { name: config.establishments[1].displayName }).check()
    await page.getByRole('button', { name: 'Choose prison' }).click()

    await HomePage.verifyOnPage(page)
    const pdfPageLink = page.getByRole('link', { name: new RegExp(pdfTestContent.title, 'i') }).first()

    await expect(pdfPageLink).toBeVisible()
    await expect(pdfPageLink).toHaveAttribute('target', '_blank')
    await expect(pdfPageLink).toHaveClass(/is-pdf/)

    const pdfHref = await pdfPageLink.getAttribute('href')
    expect(pdfHref).toMatch(/^\/assets\/.+\.pdf$/)

    const [pdfViewerPage] = await Promise.all([page.waitForEvent('popup'), pdfPageLink.click()])

    expect(pdfViewerPage).toBeTruthy()
  })
})
