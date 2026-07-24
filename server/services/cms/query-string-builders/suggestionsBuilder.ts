import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { FILE_FIELDS, MOJ_THUMBNAIL_IMAGE_INCLUDE, SUGGESTION_TILE_FIELDS } from '../constants'

const buildSuggestionsQueryString = (limit: number = 4) =>
  new DrupalJsonApiParams()
    .addFields('node--page', SUGGESTION_TILE_FIELDS)
    .addFields('node--moj_video_item', SUGGESTION_TILE_FIELDS)
    .addFields('node--moj_radio_item', SUGGESTION_TILE_FIELDS)
    .addFields('node--moj_pdf_item', SUGGESTION_TILE_FIELDS)
    .addFields('file--file', FILE_FIELDS)
    .addInclude(MOJ_THUMBNAIL_IMAGE_INCLUDE)
    .addPageLimit(limit)
    .getQueryString()

export default buildSuggestionsQueryString
