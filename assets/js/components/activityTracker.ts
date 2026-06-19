// eslint-disable-next-line import/prefer-default-export
export const initActivityTracker = () => {
  // Start of a user journey on this tab
  if (!sessionStorage.getItem('journeyId')) sessionStorage.setItem('journeyId', crypto.randomUUID())

  const videoPlaying = new Activity()
  const videoPaused = new Activity()
  const timeOnPage = new Activity()
  const timeAwayFromPage = new Activity()
  const activites = [videoPlaying, videoPaused, timeOnPage, timeAwayFromPage]

  const pageLoadedAt = new Date()
  timeOnPage.start()

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      timeAwayFromPage.stop()
    } else {
      timeAwayFromPage.start()
    }
  })

  document.addEventListener('VideoPlayback', e => {
    const state = (e as CustomEvent).detail

    if (state === 'video-play') {
      videoPlaying.start()
      videoPaused.stop()
    } else if (state === 'video-pause') {
      videoPlaying.stop()
      videoPaused.start()
    }
  })

  navigation.addEventListener('navigate', async () => {
    activites.map(activity => activity.stop())

    const csrf = document.querySelector('meta[name=csrf]')?.getAttribute('content')
    const contentId = document.querySelector('meta[name=contentId]')?.getAttribute('content')
    const requestId = document.querySelector('meta[name=requestId]')?.getAttribute('content')
    const journeyId = sessionStorage.getItem('journeyId')

    await fetch('/record/activity', {
      method: 'POST',
      body: JSON.stringify({
        videoPlayed: {
          timesPressedPlay: videoPlaying.occurrences,
          totalPlayTimeInSeconds: videoPlaying.elapsedSeconds,
        },
        videoPaused: {
          timesPressedPause: videoPaused.occurrences,
          totalPausedTimeInSeconds: videoPaused.elapsedSeconds,
        },
        timeAwayFromPage: {
          timesSwitchedAwayFromPage: timeAwayFromPage.occurrences,
          totalTimeAwayFromPageInSeconds: timeAwayFromPage.elapsedSeconds,
        },
        pageLoadedAt,
        timeOnPageInSeconds: timeOnPage.elapsedSeconds,
        path: window.location.pathname,
        contentId,
        journeyId,
        requestId,
      }),
      headers: {
        'content-type': 'application/json',
        'x-csrf-token': csrf,
      },
    })
  })
}

class Activity {
  startTime: Date

  elapsedSeconds: number = 0

  occurrences: number = 0

  start() {
    this.startTime = new Date()
    this.occurrences += 1
  }

  stop() {
    if (this.startTime) {
      this.elapsedSeconds += (new Date().getTime() - this.startTime.getTime()) / 1000
      this.startTime = null
    }
  }
}
