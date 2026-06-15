const setupTypeahead = (searchInput, typeaheadContainer) => {
  const clearTypeahead = () => {
    typeaheadContainer.hide();
    typeaheadContainer.empty();
  }

  typeaheadContainer.on('focusout', () => {
    if (!$(document.activeElement).closest(typeaheadContainer).length) {
        clearTypeahead();
    }
  })


  let timeoutId;
  searchInput.on('input', () => {
    clearTypeahead();
    const query = searchInput.val()
    const suggest = `${location.origin}/search/suggest?query=${query}`
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
    $.getJSON(suggest, response => {
      const { html } = response
      typeaheadContainer.append(html)
      typeaheadContainer.show()
    })
    }, 300)
  })
}
