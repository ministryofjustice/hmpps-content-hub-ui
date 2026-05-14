import {
  buildAudioContentQueryString,
  buildCategoryContentQueryString,
  buildCategoryMenuQueryString,
  buildCategoryPageQueryString,
  buildContentLookupQueryString,
  buildExternalLinkQueryString,
  buildNextEpisodesQueryString,
  buildPageContentQueryString,
  buildPrimaryNavigationQueryString,
  buildSeriesHeaderQueryString,
  buildSeriesItemsQueryString,
  buildSuggestionsQueryString,
  buildTagLookupQueryString,
  buildTopicHeaderQueryString,
  buildTopicItemsQueryString,
  buildTopicPageQueryString,
  buildTopicTermByTidQueryString,
  buildTopicsQueryString,
  buildUrgentBannerQueryString,
  buildVideoContentQueryString,
} from './queries'

describe('cms queries', () => {
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

  it('builds the tag lookup query string', () => {
    const params = new URLSearchParams(buildTagLookupQueryString('99'))

    expect(params.get('filter[drupal_internal__tid]')).toBe('99')
    expect(params.get('page[limit]')).toBe('1')
    expect(params.get('fields[taxonomy_term--series]')).toContain('drupal_internal__tid')
  })

  it('builds the category page query string', () => {
    const params = new URLSearchParams(buildCategoryPageQueryString())

    expect(params.get('fields[node--page]')).toContain('drupal_internal__nid')
    expect(params.get('include')).toContain('field_featured_tiles.field_moj_thumbnail_image')
    expect(params.get('fields[file--file]')).toBe('image_style_uri,uri,url')
  })

  it('builds the category menu query string', () => {
    const params = new URLSearchParams(buildCategoryMenuQueryString())

    expect(params.get('fields[taxonomy_term--series]')).toBe('drupal_internal__tid,name,path,field_moj_thumbnail_image')
    expect(params.get('fields[taxonomy_term--moj_categories]')).toBe(
      'drupal_internal__tid,name,path,field_moj_thumbnail_image',
    )
    expect(params.get('include')).toBe('field_moj_thumbnail_image')
    expect(params.get('fields[file--file]')).toBe('image_style_uri,uri,url')
  })

  it('builds the series header query string', () => {
    const params = new URLSearchParams(buildSeriesHeaderQueryString())

    expect(params.get('fields[taxonomy_term--series]')).toContain('breadcrumbs')
    expect(params.get('include')).toBe('field_moj_thumbnail_image')
    expect(params.get('fields[file--file]')).toBe('image_style_uri,uri,url')
  })

  it('builds the topic header query string', () => {
    const params = new URLSearchParams(buildTopicHeaderQueryString())

    expect(params.get('fields[taxonomy_term--topics]')).toContain('breadcrumbs')
    expect(params.get('include')).toBe('field_moj_thumbnail_image')
    expect(params.get('fields[file--file]')).toBe('image_style_uri,uri,url')
  })

  it('builds the series items query string with pagination', () => {
    const params = new URLSearchParams(buildSeriesItemsQueryString('series-1', 2))

    expect(params.get('filter[field_moj_series.id]')).toBe('series-1')
    expect(params.get('page[limit]')).toBe('40')
    expect(params.get('page[offset]')).toBe('40')
    expect(params.get('include')).toContain('field_moj_series.field_moj_thumbnail_image')
    expect(params.get('sort')).toBe('series_sort_value,created')
  })

  it('builds the topic items query', () => {
    const params = new URLSearchParams(buildTopicItemsQueryString('topic-1', 0))

    expect(params.get('filter[field_topics.id]')).toBe('topic-1')
    expect(params.get('page[limit]')).toBe('40')
    expect(params.get('page[offset]')).toBe('0')
    expect(params.get('include')).toContain('field_topics.field_moj_thumbnail_image')
    expect(params.get('sort')).toBe('created')
  })

  it('builds the topic page query string with sorting', () => {
    const params = new URLSearchParams(buildTopicPageQueryString('topic-1', 3))

    expect(params.get('filter[field_topics.id]')).toBe('topic-1')
    expect(params.get('sort')).toBe('-created')
    expect(params.get('page[limit]')).toBe('40')
    expect(params.get('page[offset]')).toBe('80')
  })

  it('builds the page content query string', () => {
    const params = new URLSearchParams(buildPageContentQueryString())

    expect(params.get('fields[node--page]')).toContain('field_main_body_content')
    expect(params.get('fields[taxonomy_term--topics]')).toBe('drupal_internal__tid,name')
    expect(params.get('fields[taxonomy_term--moj_categories]')).toContain('drupal_internal__tid,name')
    expect(params.get('include')).toBe('field_topics,field_moj_top_level_categories')
  })

  it('builds the video content query string', () => {
    const params = new URLSearchParams(buildVideoContentQueryString())

    expect(params.get('fields[node--moj_video_item]')).toContain('field_video')
    expect(params.get('fields[taxonomy_term--series]')).toBe('drupal_internal__tid,name,path')
    expect(params.get('fields[taxonomy_term--topics]')).toBe('drupal_internal__tid,name')
    expect(params.get('fields[taxonomy_term--moj_categories]')).toContain('drupal_internal__tid,name')
    expect(params.get('include')).toContain('field_video')
  })

  it('builds the audio content query string', () => {
    const params = new URLSearchParams(buildAudioContentQueryString())

    expect(params.get('fields[node--moj_radio_item]')).toContain('field_moj_audio')
    expect(params.get('fields[taxonomy_term--series]')).toBe('drupal_internal__tid,name,path')
    expect(params.get('fields[taxonomy_term--topics]')).toBe('drupal_internal__tid,name')
    expect(params.get('fields[taxonomy_term--moj_categories]')).toContain('drupal_internal__tid,name')
    expect(params.get('include')).toContain('field_moj_audio')
  })

  it('builds the content lookup query string', () => {
    const params = new URLSearchParams(buildContentLookupQueryString('content-1'))

    expect(params.get('filter[drupal_internal__nid]')).toBe('content-1')
    expect(params.get('page[limit]')).toBe('1')
  })

  it('builds the topic term lookup query string', () => {
    const params = new URLSearchParams(buildTopicTermByTidQueryString('42'))

    expect(params.get('filter[drupal_internal__tid]')).toBe('42')
    expect(params.get('filter[vid.meta.drupal_internal__target_id]')).toBe('topics')
  })

  it('builds the next episodes query string', () => {
    const params = new URLSearchParams(buildNextEpisodesQueryString(42, 1, 'created-value'))

    expect(params.get('fields[node--page]')).toContain('field_moj_episode')
    expect(params.get('include')).toBe('field_moj_thumbnail_image')
    expect(params.get('filter[field_moj_series.meta.drupal_internal__tid]')).toBe('42')
    expect(params.get('filter[series_sort_value][condition][value]')).toBe('1')
    expect(params.get('filter[created][condition][value]')).toBe('created-value')
    expect(params.get('sort')).toBe('series_sort_value,created')
  })

  it('builds the suggestions query string', () => {
    const params = new URLSearchParams(buildSuggestionsQueryString(10))

    expect(params.get('fields[node--page]')).toContain('field_display_url')
    expect(params.get('include')).toBe('field_moj_thumbnail_image')
    expect(params.get('page[limit]')).toBe('10')
  })

  it('builds the category content query string', () => {
    const params = new URLSearchParams(buildCategoryContentQueryString('category-1', 3, 10))

    expect(params.get('filter[field_moj_top_level_categories.id]')).toBe('category-1')
    expect(params.get('fields[node--page]')).toContain('field_summary')
    expect(params.get('include')).toBe('field_moj_thumbnail_image')
    expect(params.get('sort')).toBe('-created')
    expect(params.get('page[limit]')).toBe('10')
    expect(params.get('page[offset]')).toBe('20')
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
})
