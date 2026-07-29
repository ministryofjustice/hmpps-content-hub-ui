import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from './abstractPage'

export default class LaptopHelpPage extends AbstractPage {
  readonly pageHeading: Locator

  readonly mainContent: Locator

  private constructor(page: Page) {
    super(page)
    this.pageHeading = page.locator('#main-content h1')
    this.mainContent = page.locator('#main-content')
  }

  static async verifyOnPage(page: Page, heading: string): Promise<LaptopHelpPage> {
    const laptopHelpPage = new LaptopHelpPage(page)
    await expect(laptopHelpPage.pageHeading).toHaveText(heading, { timeout: 15000 })
    return laptopHelpPage
  }

  async verifyIntroText(text: string): Promise<void> {
    await expect(this.mainContent).toContainText(text)
  }

  async verifyGuideLink(name: string, href: string): Promise<void> {
    await expect(this.page.getByRole('link', { name })).toHaveAttribute('href', href)
  }

  async verifySpecificAppLink(name: string, href: string): Promise<void> {
    await expect(this.page.getByRole('link', { name, exact: true }).first()).toHaveAttribute('href', href)
  }

  async verifyAppIcon(name: string, src: string, href: string): Promise<void> {
    const image = this.page.getByRole('img', { name })
    await expect(image).toHaveAttribute('src', src)
    await expect(image.locator('xpath=ancestor::a[1]')).toHaveAttribute('href', href)
  }
}
