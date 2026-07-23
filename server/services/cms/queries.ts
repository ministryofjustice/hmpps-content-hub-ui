import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

import {
  AUDIO_CONTENT_FIELDS,
  AUDIO_CONTENT_INCLUDE,
  FILE_FIELDS,
  PAGE_CONTENT_FIELDS,
  PAGE_CONTENT_INCLUDE,
  PAGE_SIZE,
  SUGGESTION_TILE_FIELDS,
  URGENT_BANNER_FIELDS,
  URGENT_BANNER_INCLUDE,
  TOPIC_PAGE_NODE_FIELDS,
  TOPIC_TERM_LOOKUP_FIELDS,
  TOPICS_TERM_FIELDS,
  VIDEO_CONTENT_FIELDS,
  VIDEO_CONTENT_INCLUDE,
  EXTERNAL_LINK_FIELDS,
  EPISODE_TILE_FIELDS,
  MOJ_THUMBNAIL_IMAGE_INCLUDE,
  PDF_CONTENT_FIELDS,
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

export const buildPdfContentQueryString = () =>
  new DrupalJsonApiParams()
    .addFields('node--moj_pdf_item', PDF_CONTENT_FIELDS)
    .addInclude(['field_moj_pdf'])
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
