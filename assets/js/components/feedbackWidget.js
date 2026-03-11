export default function initFeedbackWidget() {
  const widget = document.getElementById('feedback-widget')
  if (!widget) return

  const i18n = window.feedbackWidgetI18n || {}

  const pageH1 = document.querySelector('h1')

  const feedbackData = {
    title: widget.dataset.title || (pageH1 ? pageH1.textContent.trim() : ''),
    url: window.location.pathname,
    contentType: widget.dataset.contentType || '',
    series: widget.dataset.series || '',
    categories: widget.dataset.categories || '',
    topics: widget.dataset.topics || '',
    feedbackId: widget.dataset.feedbackId || '',
    sentiment: '',
    comment: '',
  }

  const uiSection = widget.querySelector('.feedback-widget__ui')
  const confirmationSection = widget.querySelector('.feedback-widget__confirmation')
  const contactSection = widget.querySelector('.feedback-widget__contact')
  const sentimentTextEl = widget.querySelector('.feedback-widget__sentiment-text')
  const form = widget.querySelector('[data-feedback-form]')
  const sentimentButtons = widget.querySelectorAll('[data-feedback-sentiment]')
  const likeOptions = widget.querySelector('.feedback-widget__options--like')
  const dislikeOptions = widget.querySelector('.feedback-widget__options--dislike')

  function sendFeedback(data) {
    const { feedbackId, ...body } = data
    const headers = { 'Content-Type': 'application/json' }
    const csrfToken = window.feedbackWidgetCsrfToken
    if (csrfToken) {
      headers['x-csrf-token'] = csrfToken
    }
    fetch(`/feedback/${feedbackId}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...body, _csrf: csrfToken || '' }),
      keepalive: true,
    }).catch(() => {})
  }

  function showFeedbackForm(sentiment) {
    if (!form) return
    form.classList.remove('govuk-u-hidden')

    if (contactSection) {
      contactSection.classList.remove('govuk-u-hidden')
    }

    if (likeOptions && dislikeOptions) {
      likeOptions.classList.toggle('govuk-u-hidden', sentiment !== 'LIKE')
      dislikeOptions.classList.toggle('govuk-u-hidden', sentiment !== 'DISLIKE')
    }

    const checked = form.querySelector('input[name="feedback-reason"]:checked')
    if (checked) checked.checked = false
  }

  function showConfirmation() {
    if (uiSection) uiSection.classList.add('govuk-u-hidden')
    if (contactSection) contactSection.classList.add('govuk-u-hidden')
    if (confirmationSection) confirmationSection.classList.remove('govuk-u-hidden')
  }

  function disableControls() {
    sentimentButtons.forEach(el => {
      el.setAttribute('disabled', 'true')
    })
    if (form) {
      form.querySelectorAll('button').forEach(el => {
        el.setAttribute('disabled', 'true')
      })
    }
  }

  function updateSentimentText(sentiment) {
    if (!sentimentTextEl) return
    const contentTypeKey = feedbackData.contentType
    const typeText = i18n[contentTypeKey] || ''
    const sentimentText = sentiment === 'LIKE' ? i18n.iLikeThis : i18n.iDontLikeThis
    sentimentTextEl.textContent = `${sentimentText || ''} ${typeText}`.trim()
    sentimentTextEl.classList.add('govuk-!-font-weight-bold')
  }

  function updateSentimentIcons(sentiment) {
    sentimentButtons.forEach(btn => {
      btn.classList.toggle('feedback-widget__thumb--selected', btn.dataset.feedbackSentiment === sentiment)
    })
  }

  sentimentButtons.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault()
      const sentiment = btn.dataset.feedbackSentiment
      feedbackData.sentiment = sentiment

      updateSentimentText(sentiment)
      updateSentimentIcons(sentiment)
      showFeedbackForm(sentiment)

      sendFeedback(feedbackData)
    })
  })

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault()

      const selected = form.querySelector('input[name="feedback-reason"]:checked')
      if (selected) {
        feedbackData.comment = selected.value
      }

      sendFeedback(feedbackData)
      disableControls()

      setTimeout(showConfirmation, 1500)
    })
  }
}
