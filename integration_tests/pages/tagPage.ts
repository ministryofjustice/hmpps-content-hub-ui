import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from './abstractPage'

export default class TagPage extends AbstractPage {
  readonly heading: Locator

  readonly activePrimaryNavigationLinks: Locator

  readonly breadcrumbs: Locator

  readonly backNavigationLink: Locator

  readonly forwardNavigationLink: Locator

  private constructor(page: Page) {
    super(page)
    this.heading = page.locator('#main-content h1')
    this.activePrimaryNavigationLinks = page.locator('.moj-primary-navigation__link[aria-current]')
    this.breadcrumbs = page.locator('.hmpps-breadcrumbs')
    this.backNavigationLink = page.locator('[data-page-nav-action="back"]')
    this.forwardNavigationLink = page.locator('[data-page-nav-action="forward"]')
  }

  static async verifyOnPage(page: Page, headingName: string): Promise<TagPage> {
    const tagPage = new TagPage(page)
    await expect(tagPage.heading).toHaveText(headingName)
    return tagPage
  }

  activePrimaryNavigationLink(name: string): Locator {
    return this.activePrimaryNavigationLinks.filter({ hasText: new RegExp(`^${name}$`) })
  }

  async verifyActivePrimaryNavigation(name: string, href: string): Promise<void> {
    const link = this.activePrimaryNavigationLink(name)
    await expect(link).toHaveText(name)
    await expect(link).toHaveAttribute('href', href)
    await expect(link).toHaveAttribute('aria-current', 'page')
  }

  async verifyBreadcrumbLink(name: string, href: string): Promise<void> {
    await expect(this.breadcrumbs.getByRole('link', { name })).toHaveAttribute('href', href)
  }

  async verifyBreadcrumbContains(text: string): Promise<void> {
    await expect(this.breadcrumbs).toContainText(text)
  }

  async clickBackNavigation(): Promise<void> {
    await this.backNavigationLink.click()
  }

  async clickForwardNavigation(): Promise<void> {
    await this.forwardNavigationLink.click()
  }
}
