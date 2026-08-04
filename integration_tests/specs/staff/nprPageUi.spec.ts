import { expect, test } from '@playwright/test'
import { loginWithHmppsAuth, resetStubs, stubHomePageQueries } from '../../testUtils'
import {
  expectMediaPauseTriggered,
  expectMediaPlayTriggered,
  contentHubMediaPlayer,
} from '../../helpers/mediaPlaybackHelper'
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
    await contentHubMediaPlayer(page)

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
    await expectMediaPlayTriggered(page)

    await mediaTech.evaluate((mediaElement: HTMLElement) => {
      ;(mediaElement as HTMLMediaElement).pause()
    })
    await expectMediaPauseTriggered(page)
  })
})
