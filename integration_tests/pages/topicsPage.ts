import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from './abstractPage'

export default class TopicsPage extends AbstractPage {
  readonly heading: Locator

  private constructor(page: Page) {
    super(page)
    this.heading = page.getByRole('heading', { name: 'Browse all topics', level: 1 })
  }

  static async verifyOnPage(page: Page): Promise<TopicsPage> {
    const topicsPage = new TopicsPage(page)
    await expect(topicsPage.heading).toBeVisible()
    return topicsPage
  }
}
