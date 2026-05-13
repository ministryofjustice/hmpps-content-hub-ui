import {
  AUDIO_CONTENT_FIELDS,
  AUDIO_CONTENT_INCLUDE,
  CATEGORY_CONTENT_FIELDS,
  CATEGORY_CONTENT_INCLUDE,
  CATEGORY_MENU_FIELDS,
  CATEGORY_PAGE_FIELDS,
  CATEGORY_PAGE_INCLUDE,
  CATEGORY_TILE_FIELDS,
  EPISODE_TILE_INCLUDE,
  EPISODE_TILE_NODE_FIELDS,
  FILE_FIELDS,
  PAGE_CONTENT_FIELDS,
  PAGE_CONTENT_INCLUDE,
  PAGE_SIZE,
  SERIES_HEADER_FIELDS,
  SERIES_ITEMS_INCLUDE,
  SERIES_ITEMS_TILE_FIELDS,
  SERIES_MENU_FIELDS,
  SUGGESTION_TILE_FIELDS,
  SUGGESTION_TILE_INCLUDE,
  TAG_LOOKUP_FIELDS,
  URGENT_BANNER_FIELDS,
  URGENT_BANNER_INCLUDE,
  TOPIC_HEADER_FIELDS,
  TOPIC_ITEMS_INCLUDE,
  TOPIC_ITEMS_TILE_FIELDS,
  TOPIC_PAGE_NODE_FIELDS,
  TOPIC_TERM_LOOKUP_FIELDS,
  TOPICS_TERM_FIELDS,
  VIDEO_CONTENT_FIELDS,
  VIDEO_CONTENT_INCLUDE,
  HOMEPAGE_CONTENT_TILE,
  HOMEPAGE_CONTENT_INCLUDE,
  HOMEPAGE_FILE_FIELDS,
  CONTENT_TILE_INCLUDE,
} from './constants'

const buildPageParams = (page: number, pageSize: number = PAGE_SIZE) => ({
  'page[offset]': `${Math.max(page - 1, 0) * pageSize}`,
  'page[limit]': `${pageSize}`,
})

export const buildTopicsQueryString = () =>
  new URLSearchParams({
    'fields[taxonomy_term--topics]': TOPICS_TERM_FIELDS,
    'filter[vid.meta.drupal_internal__target_id]': 'topics',
    sort: 'name',
    'page[limit]': '100',
  }).toString()

export const buildPrimaryNavigationQueryString = () =>
  new URLSearchParams({
    'fields[menu_link_content--menu_link_content]': 'id,title,url',
  }).toString()

export const buildTagLookupQueryString = (tagId: string) =>
  new URLSearchParams({
    'fields[taxonomy_term--topics]': TAG_LOOKUP_FIELDS,
    'fields[taxonomy_term--series]': TAG_LOOKUP_FIELDS,
    'fields[taxonomy_term--moj_categories]': TAG_LOOKUP_FIELDS,
    'filter[drupal_internal__tid]': tagId,
    'page[limit]': '1',
  }).toString()

export const buildCategoryPageQueryString = () =>
  new URLSearchParams({
    'fields[node--page]': CATEGORY_TILE_FIELDS,
    'fields[node--moj_video_item]': CATEGORY_TILE_FIELDS,
    'fields[node--moj_radio_item]': CATEGORY_TILE_FIELDS,
    'fields[node--moj_pdf_item]': CATEGORY_TILE_FIELDS,
    'fields[taxonomy_term--series]': SERIES_MENU_FIELDS,
    'fields[taxonomy_term--moj_categories]': CATEGORY_PAGE_FIELDS,
    include: CATEGORY_PAGE_INCLUDE,
    'fields[file--file]': FILE_FIELDS,
  }).toString()

export const buildCategoryMenuQueryString = () =>
  new URLSearchParams({
    'fields[taxonomy_term--series]': SERIES_MENU_FIELDS,
    'fields[taxonomy_term--moj_categories]': CATEGORY_MENU_FIELDS,
    'page[limit]': '100',
    include: 'field_moj_thumbnail_image',
    'fields[file--file]': FILE_FIELDS,
  }).toString()

export const buildSeriesHeaderQueryString = () =>
  new URLSearchParams({
    'fields[taxonomy_term--series]': SERIES_HEADER_FIELDS,
    include: 'field_moj_thumbnail_image',
    'fields[file--file]': FILE_FIELDS,
  }).toString()

export const buildTopicHeaderQueryString = () =>
  new URLSearchParams({
    'fields[taxonomy_term--topics]': TOPIC_HEADER_FIELDS,
    include: 'field_moj_thumbnail_image',
    'fields[file--file]': FILE_FIELDS,
  }).toString()

export const buildSeriesItemsQueryString = (seriesUuid: string, page: number) =>
  new URLSearchParams({
    'filter[field_moj_series.id]': seriesUuid,
    'fields[node--page]': SERIES_ITEMS_TILE_FIELDS,
    'fields[node--moj_video_item]': SERIES_ITEMS_TILE_FIELDS,
    'fields[node--moj_radio_item]': SERIES_ITEMS_TILE_FIELDS,
    'fields[node--moj_pdf_item]': SERIES_ITEMS_TILE_FIELDS,
    'fields[file--file]': FILE_FIELDS,
    include: SERIES_ITEMS_INCLUDE,
    sort: 'series_sort_value,created',
    ...buildPageParams(page),
  }).toString()

export const buildTopicItemsQueryString = (topicUuid: string, page: number) =>
  new URLSearchParams({
    'filter[field_topics.id]': topicUuid,
    'fields[node--page]': TOPIC_ITEMS_TILE_FIELDS,
    'fields[node--moj_video_item]': TOPIC_ITEMS_TILE_FIELDS,
    'fields[node--moj_radio_item]': TOPIC_ITEMS_TILE_FIELDS,
    'fields[node--moj_pdf_item]': TOPIC_ITEMS_TILE_FIELDS,
    'fields[file--file]': FILE_FIELDS,
    include: TOPIC_ITEMS_INCLUDE,
    sort: 'created',
    ...buildPageParams(page),
  }).toString()

export const buildTopicPageQueryString = (topicUuid: string, page: number) =>
  new URLSearchParams({
    'filter[field_topics.id]': topicUuid,
    'fields[node--page]': TOPIC_PAGE_NODE_FIELDS,
    'fields[node--moj_video_item]': TOPIC_PAGE_NODE_FIELDS,
    'fields[node--moj_radio_item]': TOPIC_PAGE_NODE_FIELDS,
    'fields[node--moj_pdf_item]': TOPIC_PAGE_NODE_FIELDS,
    sort: '-created',
    ...buildPageParams(page),
  }).toString()

export const buildPageContentQueryString = () =>
  new URLSearchParams({
    'fields[node--page]': PAGE_CONTENT_FIELDS,
    'fields[taxonomy_term--topics]': 'drupal_internal__tid,name',
    'fields[taxonomy_term--moj_categories]': 'drupal_internal__tid,name',
    include: PAGE_CONTENT_INCLUDE,
  }).toString()

export const buildVideoContentQueryString = () =>
  new URLSearchParams({
    'fields[node--moj_video_item]': VIDEO_CONTENT_FIELDS,
    'fields[file--file]': FILE_FIELDS,
    'fields[taxonomy_term--series]': 'drupal_internal__tid,name,path',
    'fields[taxonomy_term--topics]': 'drupal_internal__tid,name',
    'fields[taxonomy_term--moj_categories]': 'drupal_internal__tid,name',
    include: VIDEO_CONTENT_INCLUDE,
  }).toString()

export const buildAudioContentQueryString = () =>
  new URLSearchParams({
    'fields[node--moj_radio_item]': AUDIO_CONTENT_FIELDS,
    'fields[file--file]': FILE_FIELDS,
    'fields[taxonomy_term--series]': 'drupal_internal__tid,name,path',
    'fields[taxonomy_term--topics]': 'drupal_internal__tid,name',
    'fields[taxonomy_term--moj_categories]': 'drupal_internal__tid,name',
    include: AUDIO_CONTENT_INCLUDE,
  }).toString()

export const buildContentLookupQueryString = (contentId: string) =>
  new URLSearchParams({
    'filter[drupal_internal__nid]': contentId,
    'fields[node--page]': 'drupal_internal__nid',
    'fields[node--moj_video_item]': 'drupal_internal__nid',
    'fields[node--moj_radio_item]': 'drupal_internal__nid',
    'page[limit]': '1',
  }).toString()

export const buildTopicTermByTidQueryString = (topicId: string) =>
  new URLSearchParams({
    'fields[taxonomy_term--topics]': TOPIC_TERM_LOOKUP_FIELDS,
    'filter[vid.meta.drupal_internal__target_id]': 'topics',
    'filter[drupal_internal__tid]': topicId,
    'page[limit]': '1',
  }).toString()

export const buildNextEpisodesQueryString = (
  seriesId: number,
  seriesSortValue: number | null,
  created: string | null,
) =>
  new URLSearchParams({
    'fields[node--page]': EPISODE_TILE_NODE_FIELDS,
    'fields[node--moj_video_item]': EPISODE_TILE_NODE_FIELDS,
    'fields[node--moj_radio_item]': EPISODE_TILE_NODE_FIELDS,
    'fields[node--moj_pdf_item]': EPISODE_TILE_NODE_FIELDS,
    'fields[file--file]': FILE_FIELDS,
    include: EPISODE_TILE_INCLUDE,
    'filter[field_moj_series.meta.drupal_internal__tid]': `${seriesId}`,
    'filter[next_items][group][conjunction]': 'OR',
    'filter[sort_value_gt][condition][path]': 'series_sort_value',
    'filter[sort_value_gt][condition][value]': `${seriesSortValue ?? 0}`,
    'filter[sort_value_gt][condition][operator]': '>',
    'filter[sort_value_gt][condition][memberOf]': 'next_items',
    'filter[created_gt][condition][path]': 'created',
    'filter[created_gt][condition][value]': created ?? '',
    'filter[created_gt][condition][operator]': '>',
    'filter[created_gt][condition][memberOf]': 'next_items',
    sort: 'series_sort_value,created',
    'page[limit]': '3',
  }).toString()

export const buildSuggestionsQueryString = (limit: number = 4) =>
  new URLSearchParams({
    'fields[node--page]': SUGGESTION_TILE_FIELDS,
    'fields[node--moj_video_item]': SUGGESTION_TILE_FIELDS,
    'fields[node--moj_radio_item]': SUGGESTION_TILE_FIELDS,
    'fields[node--moj_pdf_item]': SUGGESTION_TILE_FIELDS,
    'fields[file--file]': FILE_FIELDS,
    include: SUGGESTION_TILE_INCLUDE,
    'page[limit]': `${limit}`,
  }).toString()

export const buildCategoryContentQueryString = (categoryUuid: string, page: number = 1, limit: number = 40) =>
  new URLSearchParams({
    'filter[field_moj_top_level_categories.id]': categoryUuid,
    'fields[node--page]': CATEGORY_CONTENT_FIELDS,
    'fields[node--moj_video_item]': CATEGORY_CONTENT_FIELDS,
    'fields[node--moj_radio_item]': CATEGORY_CONTENT_FIELDS,
    'fields[node--moj_pdf_item]': CATEGORY_CONTENT_FIELDS,
    'fields[file--file]': FILE_FIELDS,
    include: CATEGORY_CONTENT_INCLUDE,
    sort: '-created',
    ...buildPageParams(page, limit),
  }).toString()

export const buildUrgentBannerQueryString = () =>
  new URLSearchParams({
    'fields[node--urgent_banner]': URGENT_BANNER_FIELDS,
    'fields[node--page]': 'path',
    include: URGENT_BANNER_INCLUDE,
  }).toString()

export const buildHomePageContentQueryString = (limit = 4) =>
  new URLSearchParams({
    include: HOMEPAGE_CONTENT_INCLUDE,
    'page[limit]': `${limit}`,
    'fields[node--field_featured_tiles]': HOMEPAGE_CONTENT_TILE,
    'fields[node--field_key_info_tiles]': HOMEPAGE_CONTENT_TILE,
    'fields[file--file]': HOMEPAGE_FILE_FIELDS,
  }).toString()

export const buildRecentlyAddedHomepageContentQueryString = (page = 1, limit = 8) =>
  new URLSearchParams({
    include: CONTENT_TILE_INCLUDE,
    sort: '-published_at,created',
    'fields[node--page]': HOMEPAGE_CONTENT_TILE,
    'fields[node--moj_video_item]': HOMEPAGE_CONTENT_TILE,
    'fields[node--moj_radio_item]': HOMEPAGE_CONTENT_TILE,
    'fields[node--moj_pdf_item]': HOMEPAGE_CONTENT_TILE,
    'fields[file--file]': HOMEPAGE_FILE_FIELDS,
    ...buildPageParams(page, limit),
  }).toString()

export const buildExploreContentQueryString = (limit = 4) =>
  new URLSearchParams({
    include: CONTENT_TILE_INCLUDE,
    'page[limit]': `${limit}`,
    'fields[node--page]': HOMEPAGE_CONTENT_TILE,
    'fields[node--moj_video_item]': HOMEPAGE_CONTENT_TILE,
    'fields[node--moj_radio_item]': HOMEPAGE_CONTENT_TILE,
    'fields[node--moj_pdf_item]': HOMEPAGE_CONTENT_TILE,
  }).toString()

export const buildUpdatesContentQueryString = (page = 1, limit = 5) =>
  new URLSearchParams({
    'filter[6][condition][path]': 'published_at',
    'filter[6][condition][value]': unixTimestamp(90, new Date().setHours(0, 0, 0, 0)),
    'filter[6][condition][operator]': '>=',
    'filter[6][condition][memberOf]': 'series_group',
    'filter[parent_or_group][group][conjunction]': 'OR',
    'filter[categories_group][group][conjunction]': 'AND',
    'filter[categories_group][group][memberOf]': 'parent_or_group',
    'filter[series_group][group][conjunction]': 'AND',
    'filter[series_group][group][memberOf]': 'parent_or_group',
    'filter[field_moj_top_level_categories.field_is_homepage_updates][condition][path]':
      'field_moj_top_level_categories.field_is_homepage_updates',
    'filter[field_moj_top_level_categories.field_is_homepage_updates][condition][value]': '1',
    'filter[field_moj_top_level_categories.field_is_homepage_updates][condition][memberOf]': 'categories_group',
    'filter[published_at][condition][path]': 'published_at',
    'filter[published_at][condition][value]': unixTimestamp(90, new Date().setHours(0, 0, 0, 0)),
    'filter[published_at][condition][operator]': '>=',
    'filter[published_at][condition][memberOf]': 'categories_group',
    'filter[field_moj_series.field_is_homepage_updates][condition][path]': 'field_moj_series.field_is_homepage_updates',
    'filter[field_moj_series.field_is_homepage_updates][condition][value]': '1',
    'filter[field_moj_series.field_is_homepage_updates][condition][memberOf]': 'series_group',
    include: CONTENT_TILE_INCLUDE,
    sort: '-published_at,created',
    'fields[node--page]': HOMEPAGE_CONTENT_TILE,
    'fields[node--moj_video_item]': HOMEPAGE_CONTENT_TILE,
    'fields[node--moj_radio_item]': HOMEPAGE_CONTENT_TILE,
    'fields[node--moj_pdf_item]': HOMEPAGE_CONTENT_TILE,
    'fields[file--file]': HOMEPAGE_FILE_FIELDS,
    ...buildPageParams(page, limit),
  }).toString()

export const unixTimestamp = (offset: number, date = Date.now()) => {
  return Math.floor((date - 24 * 60 * 60 * 1000 * offset) / 1000).toString()
}
