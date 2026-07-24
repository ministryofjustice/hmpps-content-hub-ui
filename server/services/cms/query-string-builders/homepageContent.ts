import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { HOMEPAGE_CONTENT_TILE, HOMEPAGE_FILE_FIELDS } from './constants'

const HOMEPAGE_CONTENT_INCLUDE = [
  'field_featured_tiles.field_moj_thumbnail_image',
  'field_featured_tiles',
  'field_large_update_tile',
  'field_key_info_tiles',
  'field_key_info_tiles.field_moj_thumbnail_image',
  'field_large_update_tile.field_moj_thumbnail_image',
]

const buildHomePageContentQueryString = (limit = 4) =>
  new DrupalJsonApiParams()
    .addFields('node--field_featured_tiles', HOMEPAGE_CONTENT_TILE)
    .addFields('node--field_key_info_tiles', HOMEPAGE_CONTENT_TILE)
    .addFields('file--file', HOMEPAGE_FILE_FIELDS)
    .addInclude(HOMEPAGE_CONTENT_INCLUDE)
    .addPageLimit(limit)
    .getQueryString()

export default buildHomePageContentQueryString
