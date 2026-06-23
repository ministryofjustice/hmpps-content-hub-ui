import { expect, test } from '@playwright/test'
import { loginWithHmppsAuth, resetStubs, stubHomePageQueries } from '../../testUtils'
import HomePage from '../../pages/homePage'
import SearchPage from '../../pages/searchPage'
import cmsApi from '../../mockApis/cmsApi'

test.use({ baseURL: 'http://staff.localhost:3007' })

test.describe('Search', () => {
  test.beforeEach(async () => {
    await resetStubs()
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test('shows search results from the header search box', async ({ page }) => {
    await stubHomePageQueries()
    await cmsApi.stubSearchContent([
      {
        title: 'Parole support and release planning',
        summary: 'Information about preparing for parole hearings.',
        url: '/content/401',
      },
    ])

    await loginWithHmppsAuth(page, { name: 'A TestUser' })

    const homePage = await HomePage.verifyOnPage(page)
    await Promise.all([
      page.waitForURL(/\/search\?query=parole$/),
      homePage.searchBox.fill('parole').then(() => homePage.searchBox.press('Enter')),
    ])

    const searchPage = await SearchPage.verifyOnPage(page)
    await searchPage.verifyShowingResults('parole')
    await expect(searchPage.results).toHaveCount(1)
    await expect(searchPage.results.first()).toContainText('Parole support and release planning')
    await expect(searchPage.results.first()).toHaveAttribute('href', '/content/401')
  })

  test('shows the no-results message when nothing matches', async ({ page }) => {
    await stubHomePageQueries()
    await cmsApi.stubSearchContent([])

    await loginWithHmppsAuth(page, { name: 'A TestUser' })

    const homePage = await HomePage.verifyOnPage(page)
    await Promise.all([
      page.waitForURL(/\/search\?query=zzzz$/),
      homePage.searchBox.fill('zzzz').then(() => homePage.searchBox.press('Enter')),
    ])

    const searchPage = await SearchPage.verifyOnPage(page)
    await searchPage.verifyNoResults('zzzz')
    await expect(searchPage.results).toHaveCount(0)
  })

  test('renders typeahead suggestions as the user types', async ({ page }) => {
    await stubHomePageQueries()
    await cmsApi.stubSearchContent([
      {
        title: 'Parole support and release planning',
        summary: 'Information about preparing for parole hearings.',
        url: '/content/401',
      },
    ])

    await loginWithHmppsAuth(page, { name: 'A TestUser' })

    const homePage = await HomePage.verifyOnPage(page)
    await Promise.all([
      page.waitForResponse(
        response => response.url().includes('/search/suggest?query=parole') && response.request().method() === 'GET',
      ),
      homePage.searchBox.fill('parole'),
    ])

    const searchPage = SearchPage.from(page)
    await searchPage.verifyTypeaheadSuggestion('Parole support and release planning')
    await expect(searchPage.typeaheadSuggestions.first()).toHaveAttribute('href', '/content/401')
  })

  test('keeps the typeahead closed when the suggestion request fails', async ({ page }) => {
    await stubHomePageQueries()

    await loginWithHmppsAuth(page, { name: 'A TestUser' })

    const homePage = await HomePage.verifyOnPage(page)
    await page.route('**/search/suggest?query=parole', route =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: '{}',
      }),
    )

    await Promise.all([
      page.waitForResponse(
        response => response.url().includes('/search/suggest?query=parole') && response.status() === 500,
      ),
      homePage.searchBox.fill('parole'),
    ])

    const searchPage = SearchPage.from(page)
    await expect(searchPage.typeaheadContainer).toBeHidden()
    await expect(searchPage.typeaheadSuggestions).toHaveCount(0)
  })
})
