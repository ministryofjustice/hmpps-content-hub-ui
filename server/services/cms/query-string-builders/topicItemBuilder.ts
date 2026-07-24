import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { TOPIC_ITEMS_TILE_FIELDS, FILE_FIELDS, TOPIC_ITEMS_INCLUDE, PAGE_SIZE } from '../constants'
import { calculatePageOffset } from '../utils'

const buildTopicItemsQueryString = (topicUuid: string, page: number) =>
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

export default buildTopicItemsQueryString
