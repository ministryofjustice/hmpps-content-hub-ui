// eslint-disable-next-line import/prefer-default-export
export function initPageNavigation() {
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
}
