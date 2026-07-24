import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { CONTENT_TILE_FIELDS, FILE_FIELDS, PAGE_SIZE } from './constants'
import { calculatePageOffset } from '../utils'

const TOPIC_ITEMS_INCLUDE = ['field_moj_thumbnail_image', 'field_topics.field_moj_thumbnail_image']
const TOPIC_ITEMS_TILE_FIELDS = [...CONTENT_TILE_FIELDS, 'field_topics']

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
