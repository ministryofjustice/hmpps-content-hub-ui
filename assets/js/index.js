import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'

govukFrontend.initAll()
mojFrontend.initAll()
;(function setUpPageNavigation() {
  const historyActions = {
    back: () => window.history.go(-1),
    forward: () => window.history.go(1),
  }

  document.body.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return

    const link = event.target.closest('[data-page-nav-action]')
    if (!link) return

    const action = link.getAttribute('data-page-nav-action')
    if (!action || !(action in historyActions)) return

    event.preventDefault()
    historyActions[action]()
  })
})()
