import videojs from 'video.js'
import type Player from 'video.js/dist/types/player'

export default function initVideoPlayer(): void {
  const videoEl = document.getElementById('hub-video') as HTMLVideoElement | null
  if (!videoEl) return

  const player: Player = videojs('hub-video')
  player.ready(() => {})
}
