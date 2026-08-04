import { expect, type Page } from '@playwright/test'

type MediaCountersWindow = Window & {
  mediaPlaybackCounters?: {
    play: number
    pause: number
  }
}

export const contentHubMediaPlayer = async (page: Page): Promise<void> => {
  await page.addInitScript(() => {
    const mediaWindow = window as MediaCountersWindow
    mediaWindow.mediaPlaybackCounters = { play: 0, pause: 0 }

    HTMLMediaElement.prototype.play = function patchedPlay(this: HTMLMediaElement) {
      mediaWindow.mediaPlaybackCounters!.play += 1
      this.dispatchEvent(new Event('play'))
      return Promise.resolve()
    }

    HTMLMediaElement.prototype.pause = function patchedPause(this: HTMLMediaElement) {
      mediaWindow.mediaPlaybackCounters!.pause += 1
      this.dispatchEvent(new Event('pause'))
    }
  })
}

export const expectMediaPlayTriggered = async (page: Page): Promise<void> => {
  await expect
    .poll(async () => {
      return page.evaluate(() => {
        return (window as MediaCountersWindow).mediaPlaybackCounters?.play || 0
      })
    })
    .toBeGreaterThan(0)
}

export const expectMediaPauseTriggered = async (page: Page): Promise<void> => {
  await expect
    .poll(async () => {
      return page.evaluate(() => {
        return (window as MediaCountersWindow).mediaPlaybackCounters?.pause || 0
      })
    })
    .toBeGreaterThan(0)
}
