import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { HOMEPAGE_CONTENT_INCLUDE, HOMEPAGE_CONTENT_TILE, HOMEPAGE_FILE_FIELDS } from '../constants'

export const buildHomePageContentQueryString = (limit = 4) =>
  new DrupalJsonApiParams()
    .addFields('node--field_featured_tiles', HOMEPAGE_CONTENT_TILE)
    .addFields('node--field_key_info_tiles', HOMEPAGE_CONTENT_TILE)
    .addFields('file--file', HOMEPAGE_FILE_FIELDS)
    .addInclude(HOMEPAGE_CONTENT_INCLUDE)
    .addPageLimit(limit)
    .getQueryString()

export default buildHomePageContentQueryString
