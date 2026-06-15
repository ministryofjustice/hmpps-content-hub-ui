const setupTypeahead = (searchInput, typeaheadContainer) => {
  const clearTypeahead = () => {
    console.log('typeahead cleared')
    typeaheadContainer.hide();
    typeaheadContainer.empty();
  }

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
      typeaheadContainer.attr('tabindex', '-1');
      typeaheadContainer.trigger('focus');
    })
    }, 300)
  })

    typeaheadContainer.on('focusout', () => {
    console.log('focusout')
    if (!$(document.activeElement).closest(typeaheadContainer).length) {
      console.log('bye bye')
        clearTypeahead();
        clearTimeout(timeoutId)
    }
  })
}
