const showMore = (showMoreButton, showMoreTiles, buttonText, pageType = '',) => {
  const updateButton = isLastPage => {
    if (isLastPage) {
      showMoreButton.remove()
    }
  }
  const enableShowMore = () => {
    showMoreButton.html(buttonText.enabled)
    showMoreButton.prop('disabled', false)
  }
  const disableShowMore = () => {
    showMoreButton.html(buttonText.disabled)
    showMoreButton.prop('disabled', true)
  }

  let page = 1
  showMoreButton.on('click', () => {
    page += 1
    const nextPage = `${location.pathname}/show-more?page=${page}&pageType=${pageType}`
    disableShowMore()

    $.getJSON(nextPage, response => {
      const { html, isLastPage } = response
      showMoreTiles.append(html)
      enableShowMore()
      updateButton(isLastPage)
    }).fail(() => enableShowMore())
  })
}
