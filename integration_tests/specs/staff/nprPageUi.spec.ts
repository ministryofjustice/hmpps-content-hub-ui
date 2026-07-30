import { expect, test } from '@playwright/test'
import { loginWithHmppsAuth, resetStubs, stubHomePageQueries } from '../../testUtils'
import config from '../../../server/config'

test.describe('Staff NPR page UI', () => {
  test.use({
    baseURL: 'http://staff.localhost:3007',
  })

  test.beforeEach(async () => {
    await resetStubs()
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test('NPR page renders stream and supports play and pause controls', async ({ page }) => {
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
      ;(window as Window & { originalMediaPlay?: typeof originalPlay }).originalMediaPlay = originalPlay
      ;(window as Window & { originalMediaPause?: typeof originalPause }).originalMediaPause = originalPause
    })

    await stubHomePageQueries()
    await loginWithHmppsAuth(page, { name: 'A TestUser' })

    await page.goto('/npr')

    await expect(page).toHaveURL('/npr')
    await expect(page.getByRole('heading', { name: 'NPR Listen Live', level: 1 }).first()).toBeVisible()

    const audioElement = page.locator('#hub-audio')
    await expect(audioElement).toBeVisible()
    await expect(audioElement.locator('source')).toHaveAttribute('src', config.nprStream)

    const mediaTech = page.locator('.vjs-tech').first()
    await expect(mediaTech).toHaveAttribute('src', new RegExp(`${config.nprStream}$`))

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
