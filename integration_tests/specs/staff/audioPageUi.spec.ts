import { expect, test } from '@playwright/test'
import { loginWithHmppsAuth, resetStubs, stubHomePageQueries } from '../../testUtils'
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
    await page.addInitScript(() => {
      const mediaWindow = window as Window & {
        playCallCount?: number
        pauseCallCount?: number
        originalMediaPlay?: () => Promise<void>
        originalMediaPause?: () => void
      }
      mediaWindow.playCallCount = 0
      mediaWindow.pauseCallCount = 0

      const originalPlay = HTMLMediaElement.prototype.play
      const originalPause = HTMLMediaElement.prototype.pause
      HTMLMediaElement.prototype.play = function patchedPlay(this: HTMLMediaElement) {
        mediaWindow.playCallCount = (mediaWindow.playCallCount || 0) + 1
        this.dispatchEvent(new Event('play'))
        return Promise.resolve()
      }
      HTMLMediaElement.prototype.pause = function patchedPause(this: HTMLMediaElement) {
        mediaWindow.pauseCallCount = (mediaWindow.pauseCallCount || 0) + 1
        this.dispatchEvent(new Event('pause'))
      }

      // Preserve reference in case future tests need to restore it.
      ;(window as Window & { originalMediaPlay?: typeof originalPlay }).originalMediaPlay = originalPlay
      ;(window as Window & { originalMediaPause?: typeof originalPause }).originalMediaPause = originalPause
    })

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

    await expect
      .poll(async () => {
        return page.evaluate(() => {
          return (window as Window & { playCallCount?: number }).playCallCount || 0
        })
      })
      .toBeGreaterThan(0)

    await mediaTech.evaluate((mediaElement: HTMLElement) => {
      ;(mediaElement as HTMLMediaElement).pause()
    })

    await expect
      .poll(async () => {
        return page.evaluate(() => {
          return (window as Window & { pauseCallCount?: number }).pauseCallCount || 0
        })
      })
      .toBeGreaterThan(0)
  })
})
