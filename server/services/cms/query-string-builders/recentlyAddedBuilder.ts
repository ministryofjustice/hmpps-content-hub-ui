import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { calculatePageOffset, unixTimestamp } from '../utils'
import { CONTENT_FILTERS, HOMEPAGE_CONTENT_TILE, HOMEPAGE_FILE_FIELDS, MOJ_THUMBNAIL_IMAGE_INCLUDE } from '../constants'

export const buildRecentlyAddedQueryString = (page = 1, limit = 8, offsetDays = 14) =>
  new DrupalJsonApiParams()
    .addFields('node--page', HOMEPAGE_CONTENT_TILE)
    .addFields('node--moj_video_item', HOMEPAGE_CONTENT_TILE)
    .addFields('node--moj_radio_item', HOMEPAGE_CONTENT_TILE)
    .addFields('node--moj_pdf_item', HOMEPAGE_CONTENT_TILE)
    .addFields('file--file', HOMEPAGE_FILE_FIELDS)
    .addInclude(MOJ_THUMBNAIL_IMAGE_INCLUDE)
    .addFilter('type.meta.drupal_internal__target_id', CONTENT_FILTERS, 'IN')
    .addFilter('created', unixTimestamp(offsetDays, new Date().setHours(0, 0, 0, 0)), '>=')
    .addSort('published_at', 'DESC')
    .addSort('created')
    .addPageLimit(limit)
    .addPageOffset(calculatePageOffset(page, limit))
    .getQueryString()

export default buildRecentlyAddedQueryString
