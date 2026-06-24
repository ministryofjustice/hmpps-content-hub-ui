import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from './abstractPage'

export default class HomePage extends AbstractPage {
  readonly header: Locator

  readonly updatesHeading: Locator

  readonly featuredHeading: Locator

  readonly recentlyAddedHeading: Locator

  readonly exploreHeading: Locator

  readonly browseAllTopicsButton: Locator

  readonly searchBox: Locator

  readonly updatesItems: Locator

  readonly keyInfoItems: Locator

  readonly featuredCards: Locator

  readonly recentlyAddedCards: Locator

  readonly exploreCards: Locator

  readonly primaryNavigationLinks: Locator

  private constructor(page: Page) {
    super(page)
    this.header = page.getByRole('button', { name: 'Browse all topics' })
    this.browseAllTopicsButton = page.getByRole('button', { name: 'Browse all topics' })
    this.updatesHeading = page.getByRole('heading', { name: 'Updates', level: 2 })
    this.featuredHeading = page.getByRole('heading', { name: 'Featured', level: 2 })
    this.recentlyAddedHeading = page.getByRole('heading', { name: 'Recently added', level: 2 })
    this.exploreHeading = page.getByRole('heading', { name: /Explore the Hub/i, level: 2 })
    this.searchBox = page.locator('#search-input')
    this.updatesItems = page.locator('.hmpps-update-items-link')
    this.keyInfoItems = page.locator('.hmpps-key-info-item')
    this.featuredCards = page.locator('#featuredContent .hmpps-category-card')
    this.recentlyAddedCards = page.locator('#recentlyAdded .hmpps-category-card')
    this.exploreCards = page.locator('#exploreContent .hmpps-category-card')
    this.primaryNavigationLinks = page.locator('.moj-primary-navigation__item a')
  }

  static async verifyOnPage(page: Page): Promise<HomePage> {
    const homePage = new HomePage(page)
    await expect(homePage.header).toBeVisible()
    return homePage
  }

  async verifyPrimaryNavigationLabels(labels: string[]): Promise<void> {
    const firstLabel = labels[0]
    if (firstLabel && (await this.page.getByRole('link', { name: firstLabel }).count()) > 0) {
      await Promise.all(
        labels.map(label =>
          expect(
            this.page.locator('.moj-primary-navigation__item a', { hasText: new RegExp(`^${label}$`) }),
          ).toBeVisible(),
        ),
      )
      return
    }

    await expect(this.primaryNavigationLinks).toHaveCount(2)
  }

  async verifyMainSectionsVisible(): Promise<void> {
    await expect(this.browseAllTopicsButton).toBeVisible()
    await expect(this.updatesHeading).toBeVisible()
    await expect(this.featuredHeading).toBeVisible()
    await expect(this.recentlyAddedHeading).toBeVisible()
    await expect(this.exploreHeading).toBeVisible()
    await expect(this.searchBox).toBeVisible()
  }

  async verifyHomepageCardCounts(): Promise<void> {
    await expect(this.featuredCards.first()).toBeVisible()
    await expect(this.recentlyAddedCards.first()).toBeVisible()
    await expect(this.exploreCards.first()).toBeVisible()
    await expect(this.updatesItems.first()).toBeVisible()
  }
}
