import { expect, type Locator, type Page } from '@playwright/test'

export type FeedbackSentiment = 'LIKE' | 'DISLIKE'

export default class FeedbackWidget {
  readonly root: Locator

  readonly likeButton: Locator

  readonly dislikeButton: Locator

  readonly form: Locator

  readonly contactSection: Locator

  readonly confirmationSection: Locator

  readonly confirmationHeading: Locator

  readonly sentimentText: Locator

  readonly submitButton: Locator

  private constructor(page: Page) {
    this.root = page.locator('#feedback-widget')
    this.likeButton = this.root.locator('[aria-label="like"]')
    this.dislikeButton = this.root.locator('[aria-label="dislike"]')
    this.form = this.root.locator('[data-feedback-form]')
    this.contactSection = this.root.locator('.feedback-widget__contact')
    this.confirmationSection = this.root.locator('.feedback-widget__confirmation')
    this.confirmationHeading = this.confirmationSection.getByRole('heading', {
      name: 'Thanks for your feedback',
      level: 3,
    })
    this.sentimentText = this.root.locator('.feedback-widget__sentiment-text')
    this.submitButton = this.root.getByRole('button', { name: 'Send' })
  }

  static async verifyOnPage(page: Page): Promise<FeedbackWidget> {
    const feedbackWidget = new FeedbackWidget(page)
    await expect(feedbackWidget.root).toBeVisible()
    return feedbackWidget
  }

  private optionsFor(sentiment: Lowercase<'LIKE' | 'DISLIKE'>): Locator {
    return this.root.locator(`.feedback-widget__options--${sentiment}`)
  }

  reasonOption(text: string): Locator {
    return this.form.locator(`input[name="feedback-reason"][value="${text}"]`)
  }

  async chooseSentiment(sentiment: FeedbackSentiment): Promise<void> {
    if (sentiment === 'LIKE') {
      await this.likeButton.click()
      return
    }

    await this.dislikeButton.click()
  }

  async verifySentimentState(sentiment: FeedbackSentiment, expectedText: string | RegExp): Promise<void> {
    await expect(this.form).toBeVisible()
    await expect(this.contactSection).toBeVisible()
    await expect(this.sentimentText).toContainText(expectedText)

    if (sentiment === 'LIKE') {
      await expect(this.optionsFor('like')).toBeVisible()
      await expect(this.optionsFor('dislike')).toBeHidden()
      return
    }

    await expect(this.optionsFor('like')).toBeHidden()
    await expect(this.optionsFor('dislike')).toBeVisible()
  }

  async submitReason(text: string): Promise<void> {
    await this.reasonOption(text).check()
    await this.submitButton.click()
  }

  async verifyConfirmation(): Promise<void> {
    await expect(this.confirmationSection).toBeVisible()
    await expect(this.confirmationHeading).toBeVisible()
    await expect(this.confirmationHeading).toHaveText('Thanks for your feedback')
    await expect(this.confirmationSection.getByRole('link', { name: 'What happens to your feedback?' })).toBeVisible()
  }
}
