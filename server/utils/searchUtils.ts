import { CmsSearchResult } from '../services/cms/types'

const highlightMatchingText = (value: CmsSearchResult, query: string): CmsSearchResult => {
  if (!value.title.length || !query.length) {
    return value
  }

  const sanitisedQuery = query.replace(/\s+/g, ' ')
  const queryWords = sanitisedQuery.split(' ')

  const { title } = value
  const titleWords = title.split(' ')

  for (let j = 0; j < titleWords.length; j += 1) {
    for (let i = 0; i < queryWords.length; i += 1) {
      const wordSelector = new RegExp(queryWords[i], 'ig')
      if (wordSelector.test(titleWords[j])) {
        titleWords[j] = titleWords[j].replace(wordSelector, match => {
          return `<strong>${match}</strong>`
        })
        break
      }
    }
  }

  const newTitle = titleWords.join(' ')

  return { ...value, title: newTitle }
}

export default highlightMatchingText
