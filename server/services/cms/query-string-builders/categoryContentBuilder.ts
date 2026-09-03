import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { CONTENT_TILE_FIELDS, FILE_FIELDS, PAGE_SIZE } from './constants'
import { calculatePageOffset } from '../utils'

const buildCategoryContentQueryString = (categoryUuid: string, page: number = 1, limit: number = PAGE_SIZE) =>
  new DrupalJsonApiParams()
    .addFilter('field_moj_top_level_categories.id', categoryUuid)
    .addFields('node--page', CONTENT_TILE_FIELDS)
    .addFields('node--moj_video_item', CONTENT_TILE_FIELDS)
    .addFields('node--moj_radio_item', CONTENT_TILE_FIELDS)
    .addFields('node--moj_pdf_item', CONTENT_TILE_FIELDS)
    .addFields('file--file', FILE_FIELDS)
    .addInclude(['field_moj_thumbnail_image'])
    .addSort('created', 'DESC')
    .addPageLimit(limit)
    .addPageOffset(calculatePageOffset(page, limit))
    .getQueryString()

export default buildCategoryContentQueryString
