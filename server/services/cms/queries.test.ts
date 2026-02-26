import {
  buildCategoryPageQueryString,
  buildSeriesItemsQueryString,
  buildTagLookupQueryString,
  buildTopicPageQueryString,
  buildTopicTermByTidQueryString,
  buildTopicsQueryString,
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
})
