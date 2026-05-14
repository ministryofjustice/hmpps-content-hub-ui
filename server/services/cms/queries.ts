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
  EXTERNAL_LINK_FIELDS,
  MENU_FIELDS,
  HEADER_FIELDS,
  EPISODE_TILE_FIELDS,
  MOJ_THUMBNAIL_IMAGE_INCLUDE,
  CONTENT_TILE_FIELDS,
} from './constants'

const calculatePageOffset = (page: number, pageSize: number = PAGE_SIZE) => Math.max(page - 1, 0) * pageSize

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

export const buildHomePageContentQueryString = (limit = 4) =>
  new DrupalJsonApiParams()
    .addFields('node--field_featured_tiles', HOMEPAGE_CONTENT_TILE)
    .addFields('node--field_key_info_tiles', HOMEPAGE_CONTENT_TILE)
    .addFields('file--file', HOMEPAGE_FILE_FIELDS)
    .addInclude(HOMEPAGE_CONTENT_INCLUDE)
    .addPageLimit(limit)
    .getQueryString()

export const buildRecentlyAddedHomepageContentQueryString = (page = 1, limit = 8) =>
  new DrupalJsonApiParams()
    .addFields('node--page', HOMEPAGE_CONTENT_TILE)
    .addFields('node--moj_video_item', HOMEPAGE_CONTENT_TILE)
    .addFields('node--moj_radio_item', HOMEPAGE_CONTENT_TILE)
    .addFields('node--moj_pdf_item', HOMEPAGE_CONTENT_TILE)
    .addFields('file--file', HOMEPAGE_FILE_FIELDS)
    .addInclude(MOJ_THUMBNAIL_IMAGE_INCLUDE)
    .addSort('published_at', 'DESC')
    .addSort('created')
    .addPageLimit(limit)
    .addPageOffset(calculatePageOffset(page, limit))
    .getQueryString()

export const buildExploreContentQueryString = (limit = 4) =>
  new DrupalJsonApiParams()
    .addFields('node--page', HOMEPAGE_CONTENT_TILE)
    .addFields('node--moj_video_item', HOMEPAGE_CONTENT_TILE)
    .addFields('node--moj_radio_item', HOMEPAGE_CONTENT_TILE)
    .addFields('node--moj_pdf_item', HOMEPAGE_CONTENT_TILE)
    .addInclude(MOJ_THUMBNAIL_IMAGE_INCLUDE)
    .addPageLimit(limit)
    .getQueryString()

export const buildUpdatesContentQueryString = (page = 1, limit = 5) =>
  new DrupalJsonApiParams()
    .addFields('node--page', HOMEPAGE_CONTENT_TILE)
    .addFields('node--moj_video_item', HOMEPAGE_CONTENT_TILE)
    .addFields('node--moj_radio_item', HOMEPAGE_CONTENT_TILE)
    .addFields('node--moj_pdf_item', HOMEPAGE_CONTENT_TILE)
    .addFields('file--file', HOMEPAGE_FILE_FIELDS)
    .addInclude(MOJ_THUMBNAIL_IMAGE_INCLUDE)
    .addGroup('parent_or_group', 'OR')
    .addGroup('categories_group', 'AND', 'parent_or_group')
    .addGroup('series_group', 'AND', 'parent_or_group')
    .addFilter('field_moj_top_level_categories.field_is_homepage_updates', '1', '=', 'categories_group')
    .addFilter('published_at', unixTimestamp(90, new Date().setHours(0, 0, 0, 0)), '>=', 'categories_group')
    .addFilter('field_moj_series.field_is_homepage_updates', '1', '=', 'series_group')
    .addFilter('published_at', unixTimestamp(90, new Date().setHours(0, 0, 0, 0)), '>=', 'series_group')
    .addSort('published_at', 'DESC')
    .addSort('created')
    .addPageLimit(limit)
    .addPageOffset(calculatePageOffset(page, limit))
    .getQueryString()

export const unixTimestamp = (offset: number, date = Date.now()) => {
  return Math.floor((date - 24 * 60 * 60 * 1000 * offset) / 1000).toString()
}

export const buildExternalLinkQueryString = () =>
  new DrupalJsonApiParams().addFields('node--link', EXTERNAL_LINK_FIELDS).getQueryString()
