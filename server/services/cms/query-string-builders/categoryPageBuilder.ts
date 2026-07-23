import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import {
  CATEGORY_TILE_FIELDS,
  MENU_FIELDS,
  CATEGORY_PAGE_FIELDS,
  CATEGORY_PAGE_INCLUDE,
  FILE_FIELDS,
} from '../constants'

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
