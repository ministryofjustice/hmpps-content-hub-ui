import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'
import * as lazyLoading from './components/lazyLoading'
import initFeedbackWidget from './components/feedbackWidget'

govukFrontend.initAll()
mojFrontend.initAll()
lazyLoading.initAll()
initFeedbackWidget()
;(function setUpPageNavigation() {
  const historyActions = {
    back: () => window.history.go(-1),
    forward: () => window.history.go(1),
  }

  document.querySelectorAll('[data-page-nav-action]').forEach(link => {
    link.addEventListener('click', event => {
      const action = link.getAttribute('data-page-nav-action')
      if (action in historyActions) {
        event.preventDefault()
        historyActions[action]()
      }
    })
  })
})()
