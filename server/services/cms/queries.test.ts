import {
  buildCategoryPageQueryString,
  buildExploreContentQueryString,
  buildHomePageContentQueryString,
  buildRecentlyAddedHomepageContentQueryString,
  buildExternalLinkQueryString,
  buildSeriesItemsQueryString,
  buildTagLookupQueryString,
  buildTopicPageQueryString,
  buildTopicTermByTidQueryString,
  buildTopicsQueryString,
  buildUpdatesContentQueryString,
} from './queries'

describe('cms queries', () => {
  it('builds the topics query string', () => {
    const params = new URLSearchParams(buildTopicsQueryString())

    expect(params.get('fields[taxonomy_term--topics]')).toBe('drupal_internal__tid,name')
    expect(params.get('filter[vid.meta.drupal_internal__target_id]')).toBe('topics')
    expect(params.get('sort')).toBe('name')
    expect(params.get('page[limit]')).toBe('100')
  })

  it('builds the tag lookup query string', () => {
    const params = new URLSearchParams(buildTagLookupQueryString('99'))

    expect(params.get('filter[drupal_internal__tid]')).toBe('99')
    expect(params.get('page[limit]')).toBe('1')
    expect(params.get('fields[taxonomy_term--series]')).toContain('drupal_internal__tid')
  })

  it('builds the series items query string with pagination', () => {
    const params = new URLSearchParams(buildSeriesItemsQueryString('series-1', 2))

    expect(params.get('filter[field_moj_series.id]')).toBe('series-1')
    expect(params.get('page[limit]')).toBe('40')
    expect(params.get('page[offset]')).toBe('40')
    expect(params.get('include')).toContain('field_moj_series.field_moj_thumbnail_image')
  })

  it('builds the topic page query string with sorting', () => {
    const params = new URLSearchParams(buildTopicPageQueryString('topic-1', 3))

    expect(params.get('filter[field_topics.id]')).toBe('topic-1')
    expect(params.get('sort')).toBe('-created')
    expect(params.get('page[offset]')).toBe('80')
  })

  it('builds the topic term lookup query string', () => {
    const params = new URLSearchParams(buildTopicTermByTidQueryString('42'))

    expect(params.get('filter[drupal_internal__tid]')).toBe('42')
    expect(params.get('filter[vid.meta.drupal_internal__target_id]')).toBe('topics')
  })

  it('builds the category page query string with includes', () => {
    const params = new URLSearchParams(buildCategoryPageQueryString())

    expect(params.get('fields[node--page]')).toContain('drupal_internal__nid')
    expect(params.get('include')).toContain('field_featured_tiles.field_moj_thumbnail_image')
    expect(params.get('fields[file--file]')).toBe('image_style_uri,uri,url')
  })

  it('builds the external link query string', () => {
    const params = new URLSearchParams(buildExternalLinkQueryString())

    expect(params.get('fields[node--link]')).toEqual('field_show_interstitial_page,field_url')
  })
})

describe('cms home page queries', () => {
  const TEST_PAGE_LIMIT = 10
  const TEST_PAGE_OFFSET = 5
  it('builds the Home Page Content query', () => {
    const params = new URLSearchParams(buildHomePageContentQueryString(TEST_PAGE_LIMIT))

    expect(params.get('fields[node--field_featured_tiles]')).toContain('drupal_internal__nid')
    expect(params.get('fields[node--field_key_info_tiles]')).toContain('drupal_internal__nid')
    expect(params.get('include')).toContain('field_moj_thumbnail_image')
    expect(params.get('fields[file--file]')).toBe('drupal_internal__fid,id,image_style_uri')
    expect(params.get('page[limit]')).toBe(`${TEST_PAGE_LIMIT}`)
  })

  it('builds the Recently Added Home Page Content query', () => {
    const params = new URLSearchParams(buildRecentlyAddedHomepageContentQueryString(TEST_PAGE_OFFSET, TEST_PAGE_LIMIT))

    expect(params.get('fields[node--page]')).toContain('drupal_internal__nid')
    expect(params.get('fields[node--moj_video_item]')).toContain('drupal_internal__nid')
    expect(params.get('fields[node--moj_radio_item]')).toContain('drupal_internal__nid')
    expect(params.get('fields[node--moj_pdf_item]')).toContain('drupal_internal__nid')
    expect(params.get('include')).toContain('field_moj_thumbnail_image')
    expect(params.get('fields[file--file]')).toBe('drupal_internal__fid,id,image_style_uri')
    expect(params.get('page[offset]')).toBe(`${(TEST_PAGE_OFFSET - 1) * TEST_PAGE_LIMIT}`)
    expect(params.get('page[limit]')).toBe(`${TEST_PAGE_LIMIT}`)
    expect(params.get('sort')).toBe('-published_at,created')
  })

  it('builds the Explore Content query', () => {
    const params = new URLSearchParams(buildExploreContentQueryString(TEST_PAGE_LIMIT))

    expect(params.get('fields[node--page]')).toContain('drupal_internal__nid')
    expect(params.get('fields[node--moj_video_item]')).toContain('drupal_internal__nid')
    expect(params.get('fields[node--moj_radio_item]')).toContain('drupal_internal__nid')
    expect(params.get('fields[node--moj_pdf_item]')).toContain('drupal_internal__nid')
    expect(params.get('include')).toContain('field_moj_thumbnail_image')
    expect(params.get('page[limit]')).toBe(`${TEST_PAGE_LIMIT}`)
  })

  it('builds the Updates Content query', () => {
    const params = new URLSearchParams(buildUpdatesContentQueryString(TEST_PAGE_OFFSET, TEST_PAGE_LIMIT))

    expect(params.get('fields[node--page]')).toContain('drupal_internal__nid')
    expect(params.get('fields[node--moj_video_item]')).toContain('drupal_internal__nid')
    expect(params.get('fields[node--moj_radio_item]')).toContain('drupal_internal__nid')
    expect(params.get('fields[node--moj_pdf_item]')).toContain('drupal_internal__nid')
    expect(params.get('include')).toContain('field_moj_thumbnail_image')
    expect(params.get('fields[file--file]')).toBe('drupal_internal__fid,id,image_style_uri')
    expect(params.get('page[offset]')).toBe(`${(TEST_PAGE_OFFSET - 1) * TEST_PAGE_LIMIT}`)
    expect(params.get('page[limit]')).toBe(`${TEST_PAGE_LIMIT}`)
    expect(params.get('sort')).toBe('-published_at,created')

    expect(params.get('filter[parent_or_group][group][conjunction]')).toBe('OR')
    expect(params.get('filter[field_moj_top_level_categories.field_is_homepage_updates][condition][value]')).toBe('1')
    expect(params.get('filter[field_moj_series.field_is_homepage_updates][condition][path]')).toBe(
      'field_moj_series.field_is_homepage_updates',
    )
  })
})
