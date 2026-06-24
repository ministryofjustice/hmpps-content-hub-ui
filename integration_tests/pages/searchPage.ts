import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from './abstractPage'

export default class SearchPage extends AbstractPage {
  readonly heading: Locator

  readonly searchResultsHeading: Locator

  readonly results: Locator

  readonly typeaheadContainer: Locator

  readonly typeaheadSuggestions: Locator

  constructor(page: Page) {
    super(page)
    this.heading = page.getByRole('heading', { name: /Search|Chwilio/, level: 1 })
    this.searchResultsHeading = page.locator('.hmpps-search-results h3')
    this.results = page.locator('.hmpps-search-results .govuk-link--no-underline')
    this.typeaheadContainer = page.locator('#typeahead-container')
    this.typeaheadSuggestions = page.locator('#typeahead-container .hmpps-typeahead__suggestion')
  }

  static async verifyOnPage(page: Page): Promise<SearchPage> {
    const searchPage = new SearchPage(page)
    await expect(searchPage.heading).toBeVisible()
    return searchPage
  }

  static from(page: Page): SearchPage {
    return new SearchPage(page)
  }

  async verifyShowingResults(query: string): Promise<void> {
    await expect(this.searchResultsHeading).toHaveText(new RegExp(`Showing results for \\"${query}\\"`))
  }

  async verifyNoResults(query: string): Promise<void> {
    await expect(this.searchResultsHeading).toHaveText(new RegExp(`No results found for \\"${query}\\"`))
  }

  async verifyTypeaheadSuggestion(text: string): Promise<void> {
    await expect(this.typeaheadContainer).toBeVisible()
    await expect(this.typeaheadSuggestions).toContainText(text)
  }
}
