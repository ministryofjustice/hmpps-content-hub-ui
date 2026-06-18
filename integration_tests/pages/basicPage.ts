import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from './abstractPage'

export default class BasicPage extends AbstractPage {
  readonly mainContent: Locator

  readonly pageHeading: Locator

  private constructor(page: Page) {
    super(page)
    this.mainContent = page.locator('#main-content')
    this.pageHeading = page.locator('#main-content h1')
  }

  static async verifyOnPage(page: Page): Promise<BasicPage> {
    const basicPage = new BasicPage(page)
    await expect(basicPage.pageHeading).toBeVisible()
    return basicPage
  }

  async verifyHeading(name: string, level: 1 | 2 | 3): Promise<void> {
    await expect(this.page.getByRole('heading', { name, level })).toBeVisible()
  }

  async verifyMainContentText(text: string): Promise<void> {
    await expect(this.mainContent).toContainText(text)
  }
}
