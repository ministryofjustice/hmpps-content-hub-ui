import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { calculatePageOffset, unixTimestamp } from '../utils'
import { HOMEPAGE_CONTENT_TILE, HOMEPAGE_FILE_FIELDS, MOJ_THUMBNAIL_IMAGE_INCLUDE } from '../constants'

const buildUpdatesContentQueryString = (page = 1, limit = 5) =>
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

export default buildUpdatesContentQueryString
