import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from './abstractPage'

export default class BasicPage extends AbstractPage {
  readonly mainContent: Locator

  private constructor(page: Page) {
    super(page)
    this.mainContent = page.locator('#main-content')
  }

  static async verifyOnPage(page: Page, title: string): Promise<BasicPage> {
    const basicPage = new BasicPage(page)
    await expect(basicPage.page.getByRole('heading', { name: title, level: 1 })).toBeVisible()
    return basicPage
  }

  async verifyHeading(name: string, level: 1 | 2 | 3): Promise<void> {
    await expect(this.page.getByRole('heading', { name, level })).toBeVisible()
  }

  async verifyMainContentText(text: string): Promise<void> {
    await expect(this.mainContent).toContainText(text)
  }
}
