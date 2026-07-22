import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

import {
  CATEGORY_PAGE_FIELDS,
  CATEGORY_PAGE_INCLUDE,
  CATEGORY_TILE_FIELDS,
  FILE_FIELDS,
  PAGE_SIZE,
  SERIES_ITEMS_INCLUDE,
  SERIES_ITEMS_TILE_FIELDS,
  TAG_LOOKUP_FIELDS,
  URGENT_BANNER_FIELDS,
  URGENT_BANNER_INCLUDE,
  TOPIC_ITEMS_INCLUDE,
  TOPIC_ITEMS_TILE_FIELDS,
  TOPIC_PAGE_NODE_FIELDS,
  TOPIC_TERM_LOOKUP_FIELDS,
  TOPICS_TERM_FIELDS,
  EXTERNAL_LINK_FIELDS,
  MENU_FIELDS,
  HEADER_FIELDS,
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
    .addSort('created', 'DESC')
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

export const buildTopicTermByTidQueryString = (topicId: string) =>
  new DrupalJsonApiParams()
    .addFields('taxonomy_term--topics', TOPIC_TERM_LOOKUP_FIELDS)
    .addFilter('vid.meta.drupal_internal__target_id', 'topics')
    .addFilter('drupal_internal__tid', topicId)
    .addPageLimit(1)
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

export const unixTimestamp = (offset: number, date = Date.now()) => {
  return Math.floor((date - 24 * 60 * 60 * 1000 * offset) / 1000).toString()
}

export const buildExternalLinkQueryString = () =>
  new DrupalJsonApiParams().addFields('node--link', EXTERNAL_LINK_FIELDS).getQueryString()

export const buildSearchQueryString = (searchTerm: string, pageLimit = 5) =>
  new DrupalJsonApiParams().addFilter('fulltext', searchTerm).addPageLimit(pageLimit).getQueryString()
