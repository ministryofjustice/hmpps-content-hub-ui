import videojs from 'video.js'
import type Player from 'video.js/dist/types/player'

interface AnalyticsConfig {
  label: string
  action: string
}

function sendAnalyticsEvent(config: AnalyticsConfig): void {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'audio', {
      event_category: 'Radio',
      event_label: config.label,
      action: config.action,
      userAgent: navigator.userAgent,
    })
  }
}

function once(fn: () => void): () => void {
  let called = false
  return () => {
    if (called) return
    called = true
    fn()
  }
}

export default function initAudioPlayer(): void {
  const audioEl = document.getElementById('hub-audio') as HTMLAudioElement | null
  if (!audioEl) return

  const programmeCode = audioEl.dataset.programmeCode || ''
  const title = audioEl.dataset.title || ''
  const name = `${programmeCode}|${title}`

  const player: Player = videojs('hub-audio')

  const evt0 = once(() => sendAnalyticsEvent({ label: '0%', action: name }))
  const evt25 = once(() => sendAnalyticsEvent({ label: '25%', action: name }))
  const evt50 = once(() => sendAnalyticsEvent({ label: '50%', action: name }))
  const evt75 = once(() => sendAnalyticsEvent({ label: '75%', action: name }))
  const evt90 = once(() => sendAnalyticsEvent({ label: '90%', action: name }))

  player.on('timeupdate', () => {
    const duration = player.duration() || 0
    if (duration === 0) return

    const currentTime = player.currentTime() || 0
    const percentage = Math.round((currentTime / duration) * 100)

    if (currentTime >= 1 && currentTime < 10) {
      evt0()
    } else if (percentage >= 25 && percentage < 50) {
      evt25()
    } else if (percentage >= 50 && percentage < 75) {
      evt50()
    } else if (percentage >= 75 && percentage < 90) {
      evt75()
    } else if (percentage >= 90) {
      evt90()
    }
  })
}
