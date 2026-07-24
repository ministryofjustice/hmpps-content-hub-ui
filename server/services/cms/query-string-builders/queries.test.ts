import buildExternalLinkQueryString from './externalLinkBuilder'
import buildPrimaryNavigationQueryString from './primaryNavigationBuilder'
import buildSearchQueryString from './searchBuilder'
import buildTopicsQueryString from './topicsBuilder'
import buildUrgentBannerQueryString from './urgentBannersBuilder'

describe('cms query string builders', () => {
  it('builds the topics query string', () => {
    const params = new URLSearchParams(buildTopicsQueryString())

    expect(params.get('fields[taxonomy_term--topics]')).toBe('drupal_internal__tid,name')
    expect(params.get('filter[vid.meta.drupal_internal__target_id]')).toBe('topics')
    expect(params.get('sort')).toBe('name')
    expect(params.get('page[limit]')).toBe('100')
  })

  it('builds the primary navigation query string', () => {
    const params = new URLSearchParams(buildPrimaryNavigationQueryString())

    expect(params.get('fields[menu_link_content--menu_link_content]')).toBe('id,title,url')
  })

  it('builds the urgent banner query string', () => {
    const params = new URLSearchParams(buildUrgentBannerQueryString())

    expect(params.get('fields[node--urgent_banner]')).toContain('unpublish_on')
    expect(params.get('fields[node--page]')).toBe('path')
    expect(params.get('include')).toBe('field_more_info_page')
  })

  it('builds the external link query string', () => {
    const params = new URLSearchParams(buildExternalLinkQueryString())

    expect(params.get('fields[node--link]')).toEqual('field_show_interstitial_page,field_url')
  })

  it('builds search query strings', () => {
    const TEST_SEARCH_TERM = 'test-search'
    const TEST_PAGE_LIMIT = 10
    const params = new URLSearchParams(buildSearchQueryString(TEST_SEARCH_TERM, TEST_PAGE_LIMIT))

    expect(params.get('filter[fulltext]')).toEqual(TEST_SEARCH_TERM)
    expect(params.get('page[limit]')).toEqual(`${TEST_PAGE_LIMIT}`)
  })
})
