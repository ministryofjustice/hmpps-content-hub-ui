import { expect, test } from '@playwright/test'
import { loginWithHmppsAuth, resetStubs, stubHomePageQueries } from '../../testUtils'
import HomePage from '../../pages/homePage'
import BasicPage from '../../pages/basicPage'
import cmsApi from '../../mockApis/cmsApi'
import { BASIC_PAGE_DESCRIPTION, UPDATE_BASIC_PAGES } from '../../fixtures/basicPageData'

const stubBasicContentPage = async () => {
  await Promise.all(
    UPDATE_BASIC_PAGES.flatMap(item => [
      cmsApi.stubContentLookupByNid({ nid: item.nid, uuid: item.uuid }),
      cmsApi.stubPageContentByUuid({
        uuid: item.uuid,
        nid: item.nid,
        title: item.title,
        description: BASIC_PAGE_DESCRIPTION,
      }),
    ]),
  )
}

test.describe('Staff basic page UI', () => {
  test.use({
    baseURL: 'http://staff.localhost:3007',
  })

  test.beforeEach(async () => {
    await resetStubs()
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test('Homepage updates tile opens a basic page with content', async ({ page }) => {
    await Promise.all([stubHomePageQueries(), stubBasicContentPage()])

    await loginWithHmppsAuth(page, { name: 'A TestUser' })

    const homePage = await HomePage.verifyOnPage(page)

    const basicPageLink = homePage.updatesItems.first()
    await expect(basicPageLink).toBeVisible()

    const basicPageHref = await basicPageLink.getAttribute('href')
    const basicPageTitle = await basicPageLink.getAttribute('data-featured-title')

    expect(basicPageHref).toMatch(/^\/content\/\d+$/)
    expect(basicPageTitle).toBeTruthy()

    await basicPageLink.click()

    await expect(page).toHaveURL(basicPageHref!)
    const basicPage = await BasicPage.verifyOnPage(page, basicPageTitle!)

    await basicPage.verifyMainContentText('Large introductory text for this basic page.')
    await basicPage.verifyMainContentText('Standard paragraph content for the page body.')
    await basicPage.verifyMainContentText('Small supporting text under section heading.')
    await basicPage.verifyHeading('Section heading level 2', 2)
    await basicPage.verifyHeading('Section heading level 3', 3)
    await basicPage.verifyMainContentText('First point of content')
    await basicPage.verifyMainContentText('Second point of content')
  })
})
