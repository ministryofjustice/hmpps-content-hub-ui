import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { calculatePageOffset, unixTimestamp } from '../utils'
import { HOMEPAGE_CONTENT_TILE, HOMEPAGE_FILE_FIELDS } from './constants'

const CONTENT_FILTERS = ['page', 'moj_video_item', 'moj_radio_item', 'moj_pdf_item']

const buildRecentlyAddedQueryString = (page = 1, limit = 8, offsetDays = 14) =>
  new DrupalJsonApiParams()
    .addFields('node--page', HOMEPAGE_CONTENT_TILE)
    .addFields('node--moj_video_item', HOMEPAGE_CONTENT_TILE)
    .addFields('node--moj_radio_item', HOMEPAGE_CONTENT_TILE)
    .addFields('node--moj_pdf_item', HOMEPAGE_CONTENT_TILE)
    .addFields('file--file', HOMEPAGE_FILE_FIELDS)
    .addInclude(['field_moj_thumbnail_image'])
    .addFilter('type.meta.drupal_internal__target_id', CONTENT_FILTERS, 'IN')
    .addFilter('created', unixTimestamp(offsetDays, new Date().setHours(0, 0, 0, 0)), '>=')
    .addSort('published_at', 'DESC')
    .addSort('created')
    .addPageLimit(limit)
    .addPageOffset(calculatePageOffset(page, limit))
    .getQueryString()

export default buildRecentlyAddedQueryString
