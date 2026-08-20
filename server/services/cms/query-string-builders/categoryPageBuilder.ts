import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { MENU_FIELDS, FILE_FIELDS, COMMON_TILE_FIELDS } from './constants'

const CATEGORY_PAGE_FIELDS = ['name', 'description', 'field_featured_tiles', 'breadcrumbs']

const CATEGORY_PAGE_INCLUDE = [
  'field_featured_tiles',
  'field_featured_tiles.field_moj_thumbnail_image',
  'field_featured_tiles.field_moj_series',
  'field_featured_tiles.field_moj_series.field_moj_thumbnail_image',
]

const CATEGORY_TILE_FIELDS = [...COMMON_TILE_FIELDS, 'drupal_internal__tid', 'field_topics', 'field_exclude_feedback']

const buildCategoryPageQueryString = () =>
  new DrupalJsonApiParams()
    .addFields('node--page', CATEGORY_TILE_FIELDS)
    .addFields('node--moj_video_item', CATEGORY_TILE_FIELDS)
    .addFields('node--moj_radio_item', CATEGORY_TILE_FIELDS)
    .addFields('node--moj_pdf_item', CATEGORY_TILE_FIELDS)
    .addFields('taxonomy_term--series', MENU_FIELDS)
    .addFields('taxonomy_term--moj_categories', CATEGORY_PAGE_FIELDS)
    .addInclude(CATEGORY_PAGE_INCLUDE)
    .addFields('file--file', FILE_FIELDS)
    .getQueryString()

export default buildCategoryPageQueryString
