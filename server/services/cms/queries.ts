import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

import {
  PAGE_SIZE,
  URGENT_BANNER_FIELDS,
  URGENT_BANNER_INCLUDE,
  TOPIC_PAGE_NODE_FIELDS,
  TOPIC_TERM_LOOKUP_FIELDS,
  TOPICS_TERM_FIELDS,
  EXTERNAL_LINK_FIELDS,
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

export const buildTopicTermByTidQueryString = (topicId: string) =>
  new DrupalJsonApiParams()
    .addFields('taxonomy_term--topics', TOPIC_TERM_LOOKUP_FIELDS)
    .addFilter('vid.meta.drupal_internal__target_id', 'topics')
    .addFilter('drupal_internal__tid', topicId)
    .addPageLimit(1)
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
