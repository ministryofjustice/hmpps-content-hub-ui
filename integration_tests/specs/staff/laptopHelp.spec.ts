import { expect, test } from '@playwright/test'
import { loginWithHmppsAuth, resetStubs, stubHomePageQueries } from '../../testUtils'
import {
  APP_ICON_LINKS,
  GENERAL_GUIDE_LINKS,
  LAPTOP_HELP_INTRO,
  LAPTOP_HELP_NID,
  LAPTOP_HELP_TITLE,
  SPECIFIC_APP_LINKS,
} from '../../fixtures/laptopHelpPageData'
import { stubLaptopHelpPage } from '../../helpers/laptopHelpHelper'
import LaptopHelpPage from '../../pages/laptopHelpPage'

test.describe('Staff laptop help page', () => {
  test.use({
    baseURL: 'http://staff.localhost:3007',
  })

  test.beforeEach(async () => {
    await resetStubs()
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test('Laptop help page renders the guide content', async ({ page }) => {
    await Promise.all([stubHomePageQueries(), stubLaptopHelpPage()])

    await loginWithHmppsAuth(page, { name: 'A TestUser' })

    await page.goto(`/content/${LAPTOP_HELP_NID}`)

    const laptopHelpPage = await LaptopHelpPage.verifyOnPage(page, LAPTOP_HELP_TITLE)

    await expect(page).toHaveURL(`/content/${LAPTOP_HELP_NID}`)
    await laptopHelpPage.verifyIntroText(LAPTOP_HELP_INTRO)

    await Promise.all(GENERAL_GUIDE_LINKS.map(link => laptopHelpPage.verifyGuideLink(link.name, link.href)))
    await Promise.all(SPECIFIC_APP_LINKS.map(link => laptopHelpPage.verifySpecificAppLink(link.name, link.href)))
    await Promise.all(APP_ICON_LINKS.map(icon => laptopHelpPage.verifyAppIcon(icon.name, icon.src, icon.href)))
  })
})
