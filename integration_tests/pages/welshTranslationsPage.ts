import { type Page } from '@playwright/test'
import BasicPage from './basicPage'
import ChangePrisonPage from './changePrisonPage'
import FeedbackWidget from './feedbackWidget'
import HomePage from './homePage'
import cmsApi from '../mockApis/cmsApi'
import config from '../../server/config'
import { loginWithHmppsAuth, stubHomePageQueries } from '../testUtils'

const FEEDBACK_PAGE_NID = 4857
const FEEDBACK_PAGE_UUID = 'feedback-page-uuid-4857'
const FEEDBACK_PAGE_TITLE = 'Privacy'
const FEEDBACK_PAGE_DESCRIPTION = '<p>Feedback test content page.</p>'
const WELSH_PRISON_NAME =
  config.establishments.find(establishment => establishment.code === 'BWI')?.displayName ?? 'HMP Berwyn'

const WELSH_LIKE_REASON = 'Mi wnes i fwynhau hwn'
const WELSH_DISLIKE_REASON = 'Wnes i ddim mwynhau hwn'
const WELSH_FEEDBACK_HEADING = 'Rhowch adborth i ni'
const WELSH_LIKE_SENTIMENT = 'Rwy’n hoffi’r'
const WELSH_DISLIKE_SENTIMENT = 'Dydw i ddim yn hoffi’r'
const WELSH_CONFIRMATION_HEADING = 'Diolch am eich adborth'
const WELSH_CONFIRMATION_LINK = 'Beth fydd yn digwydd i’ch ymateb?'

export default class WelshTranslationsPage {
  static readonly feedbackPageNid = FEEDBACK_PAGE_NID

  static readonly feedbackPageUuid = FEEDBACK_PAGE_UUID

  static readonly feedbackPageTitle = FEEDBACK_PAGE_TITLE

  static readonly feedbackPageDescription = FEEDBACK_PAGE_DESCRIPTION

  static readonly welshPrisonName = WELSH_PRISON_NAME

  static readonly likeReason = WELSH_LIKE_REASON

  static readonly dislikeReason = WELSH_DISLIKE_REASON

  static readonly feedbackHeading = WELSH_FEEDBACK_HEADING

  static readonly likeSentiment = WELSH_LIKE_SENTIMENT

  static readonly dislikeSentiment = WELSH_DISLIKE_SENTIMENT

  static readonly confirmationHeading = WELSH_CONFIRMATION_HEADING

  static readonly confirmationLink = WELSH_CONFIRMATION_LINK

  private static async stubFeedbackContentPage(): Promise<void> {
    await Promise.all([
      cmsApi.stubContentLookupByNid({ nid: FEEDBACK_PAGE_NID, uuid: FEEDBACK_PAGE_UUID }),
      cmsApi.stubPageContentByUuid({
        uuid: FEEDBACK_PAGE_UUID,
        nid: FEEDBACK_PAGE_NID,
        title: FEEDBACK_PAGE_TITLE,
        description: FEEDBACK_PAGE_DESCRIPTION,
      }),
    ])
  }

  static async chooseWelshEnabledPrison(page: Page): Promise<HomePage> {
    const homePage = await HomePage.verifyOnPage(page)
    await homePage.changePrisonLink.click()

    const changePrisonPage = await ChangePrisonPage.verifyOnPage(page)
    await changePrisonPage.choosePrison(WELSH_PRISON_NAME)

    return HomePage.verifyOnPage(page)
  }

  static async openWelshFeedbackPage(page: Page): Promise<FeedbackWidget> {
    await stubHomePageQueries()
    await WelshTranslationsPage.stubFeedbackContentPage()
    await loginWithHmppsAuth(page, { name: 'A TestUser' })
    await WelshTranslationsPage.chooseWelshEnabledPrison(page)
    await page.goto(`/content/${FEEDBACK_PAGE_NID}?lng=cy`)
    await BasicPage.verifyOnPage(page)
    return FeedbackWidget.verifyOnPage(page)
  }
}
