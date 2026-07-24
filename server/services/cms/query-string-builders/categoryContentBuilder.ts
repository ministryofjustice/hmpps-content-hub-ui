import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { CONTENT_TILE_FIELDS, FILE_FIELDS, MOJ_THUMBNAIL_IMAGE_INCLUDE } from '../constants'
import { calculatePageOffset } from '../utils'

const buildCategoryContentQueryString = (categoryUuid: string, page: number = 1, limit: number = 40) =>
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

export default buildCategoryContentQueryString
