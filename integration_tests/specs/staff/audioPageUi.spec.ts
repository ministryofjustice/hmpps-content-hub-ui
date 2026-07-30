import { expect, test } from '@playwright/test'
import { loginWithHmppsAuth, resetStubs, stubHomePageQueries } from '../../testUtils'
import {
  expectMediaPauseTriggered,
  expectMediaPlayTriggered,
  contentHubMediaPlayer,
} from '../../helpers/mediaPlaybackHelper'
import cmsApi from '../../mockApis/cmsApi'
import {
  AUDIO_TEST_MEDIA_URL,
  AUDIO_TEST_NID,
  AUDIO_TEST_PROGRAMME_CODE,
  AUDIO_TEST_TITLE,
  AUDIO_TEST_UUID,
} from '../../fixtures/audioPageData'

const stubAudioContentPage = async () => {
  await Promise.all([
    stubHomePageQueries(),
    cmsApi.stubContentLookupByNid({
      nid: AUDIO_TEST_NID,
      uuid: AUDIO_TEST_UUID,
      nodeType: 'node--moj_radio_item',
    }),
    cmsApi.stubAudioContentByUuid({
      uuid: AUDIO_TEST_UUID,
      nid: AUDIO_TEST_NID,
      title: AUDIO_TEST_TITLE,
      programmeCode: AUDIO_TEST_PROGRAMME_CODE,
      mediaUrl: AUDIO_TEST_MEDIA_URL,
    }),
    cmsApi.stubAudioSuggestionsByUuid({ uuid: AUDIO_TEST_UUID }),
  ])
}

test.describe('Staff audio page UI', () => {
  test.use({
    baseURL: 'http://staff.localhost:3007',
  })

  test.beforeEach(async () => {
    await resetStubs()
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test('Audio content page loads and triggers play and pause', async ({ page }) => {
    await contentHubMediaPlayer(page)

    await stubAudioContentPage()
    await loginWithHmppsAuth(page, { name: 'A TestUser' })

    await page.goto(`/content/${AUDIO_TEST_NID}`)

    await expect(page).toHaveURL(`/content/${AUDIO_TEST_NID}`)
    await expect(page.locator('#main-content h1')).toHaveText(AUDIO_TEST_TITLE)

    const audioElement = page.locator('#hub-audio')
    await expect(audioElement).toBeVisible()
    await expect(audioElement).toHaveAttribute('data-programme-code', AUDIO_TEST_PROGRAMME_CODE)
    await expect(audioElement.locator('source')).toHaveAttribute('src', AUDIO_TEST_MEDIA_URL)

    const mediaTech = page.locator('.vjs-tech').first()
    await expect(mediaTech).toHaveAttribute('src', new RegExp(`${AUDIO_TEST_MEDIA_URL}$`))

    await mediaTech.evaluate((mediaElement: HTMLElement) => {
      ;(mediaElement as HTMLMediaElement).play()
    })
    await expectMediaPlayTriggered(page)

    await mediaTech.evaluate((mediaElement: HTMLElement) => {
      ;(mediaElement as HTMLMediaElement).pause()
    })
    await expectMediaPauseTriggered(page)
  })
})
