import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'
import * as lazyLoading from './components/lazyLoading'
import initFeedbackWidget from './components/feedbackWidget'
import initAudioPlayer from './components/audioPlayer'
import initVideoPlayer from './components/videoPlayer'

govukFrontend.initAll()
mojFrontend.initAll()
lazyLoading.initAll()
initFeedbackWidget()
initAudioPlayer()
initVideoPlayer()
;(function setUpPageNavigation() {
  const historyActions = {
    back: () => window.history.go(-1),
    forward: () => window.history.go(1),
  }

  document.querySelectorAll('[data-page-nav-action]').forEach(link => {
    link.addEventListener('click', event => {
      const action = link.getAttribute('data-page-nav-action') as string | null
      if (action && action in historyActions) {
        event.preventDefault()
        historyActions[action as keyof typeof historyActions]()
      }
    })
  })
})()
