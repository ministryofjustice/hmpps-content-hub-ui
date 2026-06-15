import { CmsSearchResult } from '../services/cms/types'
import highlightMatchingText from './searchUtils'

describe('searchUtils', () => {
  it('Highlights title text that matches query text in bold in a case insensitive manner', () => {
    const testSearchResult: CmsSearchResult = {
      title: 'This title contains matching words',
      url: '/content/123',
      summary: 'summary-1',
    }

    const matchingQuery = 'this Word'

    const result = highlightMatchingText(testSearchResult, matchingQuery)
    expect(result.url).toBe('/content/123')
    expect(result.summary).toBe('summary-1')
    expect(result.title).toBe('<strong>This</strong> title contains matching <strong>word</strong>s')
  })

  it('Does not highlight title text fails to match query', () => {
    const testSearchResult: CmsSearchResult = {
      title: 'This title contains no matching words',
      url: '/content/123',
      summary: 'summary-1',
    }

    const noMatchQuery = 'test'

    const result = highlightMatchingText(testSearchResult, noMatchQuery)
    expect(result.url).toBe('/content/123')
    expect(result.summary).toBe('summary-1')
    expect(result.title).toBe('This title contains no matching words')
  })

  it('safely handles empty queries and empty titles', () => {
    const testSearchResult: CmsSearchResult = {
      title: '',
      url: '/content/123',
      summary: 'summary-1',
    }

    const noMatchQuery = ''

    const result = highlightMatchingText(testSearchResult, noMatchQuery)
    expect(result.url).toBe('/content/123')
    expect(result.summary).toBe('summary-1')
    expect(result.title).toBe('')
  })
})
