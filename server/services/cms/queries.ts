import {
  CATEGORY_MENU_FIELDS,
  CATEGORY_PAGE_FIELDS,
  CATEGORY_PAGE_INCLUDE,
  CATEGORY_TILE_FIELDS,
  FILE_FIELDS,
  PAGE_SIZE,
  SERIES_HEADER_FIELDS,
  SERIES_ITEMS_INCLUDE,
  SERIES_ITEMS_TILE_FIELDS,
  SERIES_MENU_FIELDS,
  TAG_LOOKUP_FIELDS,
  TOPIC_HEADER_FIELDS,
  TOPIC_ITEMS_INCLUDE,
  TOPIC_ITEMS_TILE_FIELDS,
  TOPIC_PAGE_NODE_FIELDS,
  TOPIC_TERM_LOOKUP_FIELDS,
  TOPICS_TERM_FIELDS,
} from './constants'

const buildPageParams = (page: number, pageSize: number = PAGE_SIZE) => ({
  'page[limit]': `${pageSize}`,
  'page[offset]': `${Math.max(page - 1, 0) * pageSize}`,
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

export const buildTopicTermByTidQueryString = (topicId: string) =>
  new URLSearchParams({
    'fields[taxonomy_term--topics]': TOPIC_TERM_LOOKUP_FIELDS,
    'filter[vid.meta.drupal_internal__target_id]': 'topics',
    'filter[drupal_internal__tid]': topicId,
    'page[limit]': '1',
  }).toString()
