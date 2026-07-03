import { expect, test, type Page } from '@playwright/test'
import { loginWithHmppsAuth, resetStubs, stubHomePageQueries } from '../../testUtils'
import WelshTranslationsPage from '../../pages/welshTranslationsPage'

const stubFeedbackSubmission = async (page: Page) => {
  const requests: Array<Record<string, unknown>> = []

  await page.route('**/feedback/*', async route => {
    requests.push(JSON.parse(route.request().postData() || '{}') as Record<string, unknown>)
    await route.fulfill({ status: 200, body: '' })
  })

  return requests
}

test.describe('Staff Welsh translations', () => {
  test.use({
    baseURL: 'http://staff.localhost:3007',
  })

  test.beforeEach(async () => {
    await resetStubs()
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test('Homepage can switch to Welsh translations for Welsh-enabled prisons', async ({ page }) => {
    await stubHomePageQueries()
    await loginWithHmppsAuth(page, { name: 'A TestUser' })

    const homePage = await WelshTranslationsPage.chooseWelshEnabledPrison(page)

    await homePage.clickLanguage('Cymraeg')

    await expect(page).toHaveURL(/\?lng=cy$/)
    await homePage.verifyActiveLanguage('Cymraeg')
    await homePage.verifyLocalizedMainSectionsVisible({
      browseAllTopics: 'Pori pob pwnc',
      updates: 'Diweddariadau',
      featured: 'Dan sylw',
      recentlyAdded: 'Ychwanegwyd yn ddiweddar',
      explore: 'Archwilio’r Hwb',
    })
  })

  test('Feedback like outcome is translated in Welsh', async ({ page }) => {
    const requests = await stubFeedbackSubmission(page)
    const feedbackWidget = await WelshTranslationsPage.openWelshFeedbackPage(page)

    await feedbackWidget.verifyHeading(WelshTranslationsPage.feedbackHeading)
    await feedbackWidget.verifySubmitButtonLabel('Anfon')

    await feedbackWidget.chooseSentiment('LIKE')
    await feedbackWidget.verifySentimentState('LIKE', WelshTranslationsPage.likeSentiment)
    await feedbackWidget.submitReason(WelshTranslationsPage.likeReason)
    await feedbackWidget.verifyConfirmation(
      WelshTranslationsPage.confirmationHeading,
      WelshTranslationsPage.confirmationLink,
    )

    expect(requests).toHaveLength(2)
    expect(requests[0]).toMatchObject({
      title: WelshTranslationsPage.feedbackPageTitle,
      url: `/content/${WelshTranslationsPage.feedbackPageNid}`,
      sentiment: 'LIKE',
    })
    expect(requests[1]).toMatchObject({
      title: WelshTranslationsPage.feedbackPageTitle,
      url: `/content/${WelshTranslationsPage.feedbackPageNid}`,
      sentiment: 'LIKE',
      comment: WelshTranslationsPage.likeReason,
    })
  })

  test('Feedback dislike outcome is translated in Welsh', async ({ page }) => {
    const requests = await stubFeedbackSubmission(page)
    const feedbackWidget = await WelshTranslationsPage.openWelshFeedbackPage(page)

    await feedbackWidget.verifyHeading(WelshTranslationsPage.feedbackHeading)
    await feedbackWidget.verifySubmitButtonLabel('Anfon')

    await feedbackWidget.chooseSentiment('DISLIKE')
    await feedbackWidget.verifySentimentState('DISLIKE', WelshTranslationsPage.dislikeSentiment)
    await feedbackWidget.submitReason(WelshTranslationsPage.dislikeReason)
    await feedbackWidget.verifyConfirmation(
      WelshTranslationsPage.confirmationHeading,
      WelshTranslationsPage.confirmationLink,
    )

    expect(requests).toHaveLength(2)
    expect(requests[0]).toMatchObject({
      title: WelshTranslationsPage.feedbackPageTitle,
      url: `/content/${WelshTranslationsPage.feedbackPageNid}`,
      sentiment: 'DISLIKE',
    })
    expect(requests[1]).toMatchObject({
      title: WelshTranslationsPage.feedbackPageTitle,
      url: `/content/${WelshTranslationsPage.feedbackPageNid}`,
      sentiment: 'DISLIKE',
      comment: WelshTranslationsPage.dislikeReason,
    })
  })
})
