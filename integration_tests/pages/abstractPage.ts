import { expect, type Locator, type Page } from '@playwright/test'

export default class AbstractPage {
  readonly page: Page

  /** user name that appear in header */
  readonly usersName: Locator

  /** phase banner that appear in header */
  readonly phaseBanner: Locator

  /** link to sign out */
  readonly signoutLink: Locator

  /** link to manage user details */
  readonly manageUserDetails: Locator

  readonly languageLinks: Locator

  protected constructor(page: Page) {
    this.page = page
    this.phaseBanner = page.getByTestId('header-phase-banner')
    this.usersName = page.getByTestId('header-user-name')
    this.signoutLink = page.getByText('Sign out')
    this.manageUserDetails = page.getByTestId('manageDetails')
    this.languageLinks = page.locator('.hmpps-header__language-link')
  }

  languageLink(name: string): Locator {
    return this.languageLinks.filter({ hasText: name })
  }

  async clickLanguage(name: string): Promise<void> {
    await this.languageLink(name).click()
  }

  async verifyActiveLanguage(name: string): Promise<void> {
    const link = this.languageLink(name)
    await expect(link).toHaveText(name)
    await expect(link).toHaveAttribute('aria-current', 'true')
  }

  async verifyHtmlLanguage(code: string): Promise<void> {
    await expect(this.page.locator('html')).toHaveAttribute('lang', code)
  }

  async signOut() {
    await this.signoutLink.first().click()
  }

  async clickManageUserDetails() {
    await this.manageUserDetails.first().click()
  }
}
