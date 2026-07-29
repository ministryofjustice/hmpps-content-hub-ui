import { expect, test, type Page } from '@playwright/test'
import { loginWithHmppsAuth, resetStubs, stubHomePageQueries, stubTopicPage } from '../../testUtils'
import cmsApi from '../../mockApis/cmsApi'
import BasicPage from '../../pages/basicPage'
import FeedbackWidget from '../../pages/feedbackWidget'
import TagPage from '../../pages/tagPage'

const FEEDBACK_PAGE_NID = 4857
const FEEDBACK_PAGE_UUID = 'feedback-page-uuid-4857'
const FEEDBACK_PAGE_TITLE = 'Privacy'
const FEEDBACK_PAGE_DESCRIPTION = '<p>Feedback test content page.</p>'

const LAPTOP_HELP_TOPIC = {
  id: 'topic-1503',
  attributes: {
    drupal_internal__tid: 1503,
    name: 'Laptop help',
  },
}

const LIKE_REASONS = [
  'I enjoyed this',
  'This was beneficial to me',
  'This was interesting',
  'It was easy for me to understand',
]

const DISLIKE_REASONS = [
  "I didn't enjoy this",
  "This wasn't relevant to me",
  "This wasn't interesting",
  'It was hard for me to understand',
]

const stubFeedbackContentPage = () =>
  Promise.all([
    cmsApi.stubContentLookupByNid({ nid: FEEDBACK_PAGE_NID, uuid: FEEDBACK_PAGE_UUID }),
    cmsApi.stubPageContentByUuid({
      uuid: FEEDBACK_PAGE_UUID,
      nid: FEEDBACK_PAGE_NID,
      title: FEEDBACK_PAGE_TITLE,
      description: FEEDBACK_PAGE_DESCRIPTION,
    }),
  ])

const stubLaptopHelpPage = async () => {
  await Promise.all(stubTopicPage(LAPTOP_HELP_TOPIC))
}

const openFeedbackPage = async (page: Page) => {
  await stubHomePageQueries()
  await stubFeedbackContentPage()
  await loginWithHmppsAuth(page, { name: 'A TestUser' })
  await page.goto(`/content/${FEEDBACK_PAGE_NID}`)
  await BasicPage.verifyOnPage(page)
  return FeedbackWidget.verifyOnPage(page)
}

const stubFeedbackSubmission = async (page: Page) => {
  const requests: Array<Record<string, unknown>> = []

  await page.route('**/feedback/*', async route => {
    requests.push(JSON.parse(route.request().postData() || '{}') as Record<string, unknown>)
    await route.fulfill({ status: 200, body: '' })
  })

  return requests
}

test.describe('Staff feedback widget', () => {
  test.use({
    baseURL: 'http://staff.localhost:3007',
  })

  test.beforeEach(async () => {
    await resetStubs()
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  LIKE_REASONS.forEach(reason => {
    test(`Like feedback submits successfully for: ${reason}`, async ({ page }) => {
      const requests = await stubFeedbackSubmission(page)

      const feedbackWidget = await openFeedbackPage(page)

      await feedbackWidget.chooseSentiment('LIKE')
      await feedbackWidget.verifySentimentState('LIKE', 'I like this')

      await feedbackWidget.submitReason(reason)
      await feedbackWidget.verifyConfirmation()

      expect(requests).toHaveLength(2)
      expect(requests[0]).toMatchObject({
        title: FEEDBACK_PAGE_TITLE,
        url: `/content/${FEEDBACK_PAGE_NID}`,
        sentiment: 'LIKE',
      })
      expect(requests[1]).toMatchObject({
        title: FEEDBACK_PAGE_TITLE,
        url: `/content/${FEEDBACK_PAGE_NID}`,
        sentiment: 'LIKE',
        comment: reason,
      })
    })
  })

  DISLIKE_REASONS.forEach(reason => {
    test(`Dislike feedback submits successfully for: ${reason}`, async ({ page }) => {
      const requests = await stubFeedbackSubmission(page)

      const feedbackWidget = await openFeedbackPage(page)

      await feedbackWidget.chooseSentiment('DISLIKE')
      await feedbackWidget.verifySentimentState('DISLIKE', /I don(?:'|&#39;)t like this/)

      await feedbackWidget.submitReason(reason)
      await feedbackWidget.verifyConfirmation()

      expect(requests).toHaveLength(2)
      expect(requests[0]).toMatchObject({
        title: FEEDBACK_PAGE_TITLE,
        url: `/content/${FEEDBACK_PAGE_NID}`,
        sentiment: 'DISLIKE',
      })
      expect(requests[1]).toMatchObject({
        title: FEEDBACK_PAGE_TITLE,
        url: `/content/${FEEDBACK_PAGE_NID}`,
        sentiment: 'DISLIKE',
        comment: reason,
      })
    })
  })

  test('Feedback confirmation link opens the laptop help page', async ({ page }) => {
    const feedbackWidget = await openFeedbackPage(page)
    await stubLaptopHelpPage()

    await feedbackWidget.chooseSentiment('LIKE')
    await feedbackWidget.submitReason(LIKE_REASONS[0])
    await feedbackWidget.verifyConfirmation()
    await expect(feedbackWidget.confirmationLink).toHaveAttribute('href', '/help')

    await feedbackWidget.confirmationLink.click()

    await expect(page).toHaveURL('/tags/1503')
    await TagPage.verifyOnPage(page, LAPTOP_HELP_TOPIC.attributes.name)
  })
})
