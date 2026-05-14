import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

import {
  AUDIO_CONTENT_FIELDS,
  AUDIO_CONTENT_INCLUDE,
  CATEGORY_PAGE_FIELDS,
  CATEGORY_PAGE_INCLUDE,
  CATEGORY_TILE_FIELDS,
  FILE_FIELDS,
  PAGE_CONTENT_FIELDS,
  PAGE_CONTENT_INCLUDE,
  PAGE_SIZE,
  SERIES_ITEMS_INCLUDE,
  SERIES_ITEMS_TILE_FIELDS,
  SUGGESTION_TILE_FIELDS,
  TAG_LOOKUP_FIELDS,
  URGENT_BANNER_FIELDS,
  URGENT_BANNER_INCLUDE,
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
  EXTERNAL_LINK_FIELDS,
  MENU_FIELDS,
  HEADER_FIELDS,
  EPISODE_TILE_FIELDS,
  MOJ_THUMBNAIL_IMAGE_INCLUDE,
  CONTENT_TILE_FIELDS,
} from './constants'

const calculatePageOffset = (page: number, pageSize: number = PAGE_SIZE) => Math.max(page - 1, 0) * pageSize
// to be removed
const buildPageParams = (page: number, pageSize: number = PAGE_SIZE) => ({
  'page[offset]': `${Math.max(page - 1, 0) * pageSize}`,
  'page[limit]': `${pageSize}`,
})

export const buildTopicsQueryString = () =>
  new DrupalJsonApiParams()
    .addFields('taxonomy_term--topics', TOPICS_TERM_FIELDS)
    .addFilter('vid.meta.drupal_internal__target_id', 'topics')
    .addSort('name')
    .addPageLimit(100)
    .getQueryString()

export const buildPrimaryNavigationQueryString = () =>
  new DrupalJsonApiParams().addFields('menu_link_content--menu_link_content', ['id', 'title', 'url']).getQueryString()

export const buildTagLookupQueryString = (tagId: string) =>
  new DrupalJsonApiParams()
    .addFields('taxonomy_term--topics', TAG_LOOKUP_FIELDS)
    .addFields('taxonomy_term--series', TAG_LOOKUP_FIELDS)
    .addFields('taxonomy_term--moj_categories', TAG_LOOKUP_FIELDS)
    .addFilter('drupal_internal__tid', tagId)
    .addPageLimit(1)
    .getQueryString()

export const buildCategoryPageQueryString = () =>
  new DrupalJsonApiParams()
    .addFields('node--page', CATEGORY_TILE_FIELDS)
    .addFields('node--moj_video_item', CATEGORY_TILE_FIELDS)
    .addFields('node--moj_radio_item', CATEGORY_TILE_FIELDS)
    .addFields('node--moj_pdf_item', CATEGORY_TILE_FIELDS)
    .addFields('taxonomy_term--series', MENU_FIELDS)
    .addFields('taxonomy_term--moj_categories', CATEGORY_PAGE_FIELDS)
    .addInclude(CATEGORY_PAGE_INCLUDE)
    .addFields('file--file', FILE_FIELDS)
    .getQueryString()

export const buildCategoryMenuQueryString = () =>
  new DrupalJsonApiParams()
    .addFields('taxonomy_term--series', MENU_FIELDS)
    .addFields('taxonomy_term--moj_categories', MENU_FIELDS)
    .addInclude(['field_moj_thumbnail_image'])
    .addPageLimit(100)
    .addFields('file--file', FILE_FIELDS)
    .getQueryString()

export const buildSeriesHeaderQueryString = () =>
  new DrupalJsonApiParams()
    .addFields('taxonomy_term--series', HEADER_FIELDS)
    .addInclude(['field_moj_thumbnail_image'])
    .addFields('file--file', FILE_FIELDS)
    .getQueryString()

export const buildTopicHeaderQueryString = () =>
  new DrupalJsonApiParams()
    .addFields('taxonomy_term--topics', HEADER_FIELDS)
    .addInclude(['field_moj_thumbnail_image'])
    .addFields('file--file', FILE_FIELDS)
    .getQueryString()

export const buildSeriesItemsQueryString = (seriesUuid: string, page: number) =>
  new DrupalJsonApiParams()
    .addFilter('field_moj_series.id', seriesUuid)
    .addFields('node--page', SERIES_ITEMS_TILE_FIELDS)
    .addFields('node--moj_video_item', SERIES_ITEMS_TILE_FIELDS)
    .addFields('node--moj_radio_item', SERIES_ITEMS_TILE_FIELDS)
    .addFields('node--moj_pdf_item', SERIES_ITEMS_TILE_FIELDS)
    .addFields('file--file', FILE_FIELDS)
    .addInclude(SERIES_ITEMS_INCLUDE)
    .addSort('series_sort_value')
    .addSort('created')
    .addPageLimit(PAGE_SIZE)
    .addPageOffset(calculatePageOffset(page))
    .getQueryString()

export const buildTopicItemsQueryString = (topicUuid: string, page: number) =>
  new DrupalJsonApiParams()
    .addFilter('field_topics.id', topicUuid)
    .addFields('node--page', TOPIC_ITEMS_TILE_FIELDS)
    .addFields('node--moj_video_item', TOPIC_ITEMS_TILE_FIELDS)
    .addFields('node--moj_radio_item', TOPIC_ITEMS_TILE_FIELDS)
    .addFields('node--moj_pdf_item', TOPIC_ITEMS_TILE_FIELDS)
    .addFields('file--file', FILE_FIELDS)
    .addInclude(TOPIC_ITEMS_INCLUDE)
    .addSort('created')
    .addPageLimit(PAGE_SIZE)
    .addPageOffset(calculatePageOffset(page))
    .getQueryString()

export const buildTopicPageQueryString = (topicUuid: string, page: number) =>
  new DrupalJsonApiParams()
    .addFilter('field_topics.id', topicUuid)
    .addFields('node--page', TOPIC_PAGE_NODE_FIELDS)
    .addFields('node--moj_video_item', TOPIC_PAGE_NODE_FIELDS)
    .addFields('node--moj_radio_item', TOPIC_PAGE_NODE_FIELDS)
    .addFields('node--moj_pdf_item', TOPIC_PAGE_NODE_FIELDS)
    .addSort('created', 'DESC')
    .addPageLimit(PAGE_SIZE)
    .addPageOffset(calculatePageOffset(page))
    .getQueryString()

export const buildPageContentQueryString = () =>
  new DrupalJsonApiParams()
    .addFields('node--page', PAGE_CONTENT_FIELDS)
    .addFields('taxonomy_term--topics', ['drupal_internal__tid', 'name'])
    .addFields('taxonomy_term--moj_categories', ['drupal_internal__tid', 'name'])
    .addInclude(PAGE_CONTENT_INCLUDE)
    .getQueryString()

export const buildVideoContentQueryString = () =>
  new DrupalJsonApiParams()
    .addFields('node--moj_video_item', VIDEO_CONTENT_FIELDS)
    .addFields('file--file', FILE_FIELDS)
    .addFields('taxonomy_term--series', ['drupal_internal__tid', 'name', 'path'])
    .addFields('taxonomy_term--topics', ['drupal_internal__tid', 'name'])
    .addFields('taxonomy_term--moj_categories', ['drupal_internal__tid', 'name'])
    .addInclude(VIDEO_CONTENT_INCLUDE)
    .getQueryString()

export const buildAudioContentQueryString = () =>
  new DrupalJsonApiParams()
    .addFields('node--moj_radio_item', AUDIO_CONTENT_FIELDS)
    .addFields('file--file', FILE_FIELDS)
    .addFields('taxonomy_term--series', ['drupal_internal__tid', 'name', 'path'])
    .addFields('taxonomy_term--topics', ['drupal_internal__tid', 'name'])
    .addFields('taxonomy_term--moj_categories', ['drupal_internal__tid', 'name'])
    .addInclude(AUDIO_CONTENT_INCLUDE)
    .getQueryString()

export const buildContentLookupQueryString = (contentId: string) =>
  new DrupalJsonApiParams()
    .addFilter('drupal_internal__nid', contentId)
    .addFields('node--page', ['drupal_internal__nid'])
    .addFields('node--moj_video_item', ['drupal_internal__nid'])
    .addFields('node--moj_radio_item', ['drupal_internal__nid'])
    .addPageLimit(1)
    .getQueryString()

export const buildTopicTermByTidQueryString = (topicId: string) =>
  new DrupalJsonApiParams()
    .addFields('taxonomy_term--topics', TOPIC_TERM_LOOKUP_FIELDS)
    .addFilter('vid.meta.drupal_internal__target_id', 'topics')
    .addFilter('drupal_internal__tid', topicId)
    .addPageLimit(1)
    .getQueryString()

export const buildNextEpisodesQueryString = (
  seriesId: number,
  seriesSortValue: number | null,
  created: string | null,
) =>
  new DrupalJsonApiParams()
    .addFields('node--page', EPISODE_TILE_FIELDS)
    .addFields('node--moj_video_item', EPISODE_TILE_FIELDS)
    .addFields('node--moj_radio_item', EPISODE_TILE_FIELDS)
    .addFields('node--moj_pdf_item', EPISODE_TILE_FIELDS)
    .addInclude(MOJ_THUMBNAIL_IMAGE_INCLUDE)
    .addFilter('field_moj_series.meta.drupal_internal__tid', `${seriesId}`)
    .addGroup('next_items', 'OR')
    .addFilter('series_sort_value', `${seriesSortValue ?? 0}`, '>', 'next_items')
    .addFilter('created', created, '>', 'next_items')
    .addFields('file--file', FILE_FIELDS)
    .addSort('series_sort_value')
    .addSort('created')
    .addPageLimit(3)
    .getQueryString()

export const buildSuggestionsQueryString = (limit: number = 4) =>
  new DrupalJsonApiParams()
    .addFields('node--page', SUGGESTION_TILE_FIELDS)
    .addFields('node--moj_video_item', SUGGESTION_TILE_FIELDS)
    .addFields('node--moj_radio_item', SUGGESTION_TILE_FIELDS)
    .addFields('node--moj_pdf_item', SUGGESTION_TILE_FIELDS)
    .addFields('file--file', FILE_FIELDS)
    .addInclude(MOJ_THUMBNAIL_IMAGE_INCLUDE)
    .addPageLimit(limit)
    .getQueryString()

export const buildCategoryContentQueryString = (categoryUuid: string, page: number = 1, limit: number = 40) =>
  new DrupalJsonApiParams()
    .addFilter('field_moj_top_level_categories.id', categoryUuid)
    .addFields('node--page', CONTENT_TILE_FIELDS)
    .addFields('node--moj_video_item', CONTENT_TILE_FIELDS)
    .addFields('node--moj_radio_item', CONTENT_TILE_FIELDS)
    .addFields('node--moj_pdf_item', CONTENT_TILE_FIELDS)
    .addFields('file--file', FILE_FIELDS)
    .addInclude(MOJ_THUMBNAIL_IMAGE_INCLUDE)
    .addSort('created', 'DESC')
    .addPageLimit(limit)
    .addPageOffset(calculatePageOffset(page, limit))
    .getQueryString()

export const buildUrgentBannerQueryString = () =>
  new DrupalJsonApiParams()
    .addFields('node--urgent_banner', URGENT_BANNER_FIELDS)
    .addFields('node--page', ['path'])
    .addInclude(URGENT_BANNER_INCLUDE)
    .getQueryString()

// to be implemented
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

export const buildExternalLinkQueryString = () =>
  new DrupalJsonApiParams().addFields('node--link', EXTERNAL_LINK_FIELDS).getQueryString()
