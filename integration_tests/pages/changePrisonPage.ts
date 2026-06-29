import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from './abstractPage'

export default class ChangePrisonPage extends AbstractPage {
  readonly heading: Locator

  readonly choosePrisonButton: Locator

  private constructor(page: Page) {
    super(page)
    this.heading = page.getByRole('heading', { name: 'Change prison', level: 1 })
    this.choosePrisonButton = page.getByRole('button', { name: 'Choose prison' })
  }

  static async verifyOnPage(page: Page): Promise<ChangePrisonPage> {
    const changePrisonPage = new ChangePrisonPage(page)
    await expect(changePrisonPage.heading).toBeVisible()
    return changePrisonPage
  }

  prisonOption(displayName: string): Locator {
    return this.page.getByRole('radio', { name: displayName })
  }

  async choosePrison(displayName: string): Promise<void> {
    await this.prisonOption(displayName).check()
    await this.choosePrisonButton.click()
  }
}
