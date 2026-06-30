import videojs from 'video.js'
import type Player from 'video.js/dist/types/player'

export default function initVideoPlayer(): void {
  const videoEl = document.getElementById('hub-video') as HTMLVideoElement | null
  if (!videoEl) return

  const player: Player = videojs('hub-video')
  player.ready(() => {})
  player.on('play', () => document.dispatchEvent(videoPlaybackEvent('video-play')))
  player.on('pause', () => document.dispatchEvent(videoPlaybackEvent('video-pause')))
  player.on('ended', () => document.dispatchEvent(videoPlaybackEvent('video-end')))
}

type VideoPlaybackState = 'video-play' | 'video-pause' | 'video-end'
const videoPlaybackEvent = (state: VideoPlaybackState) => {
  return new CustomEvent('VideoPlayback', { detail: { state } })
}
