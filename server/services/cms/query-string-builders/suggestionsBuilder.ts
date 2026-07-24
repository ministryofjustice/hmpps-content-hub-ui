import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { COMMON_TILE_FIELDS, FILE_FIELDS } from './constants'

const SUGGESTION_TILE_FIELDS = [...COMMON_TILE_FIELDS, 'field_summary', 'field_display_url']

const buildSuggestionsQueryString = (limit: number = 4) =>
  new DrupalJsonApiParams()
    .addFields('node--page', SUGGESTION_TILE_FIELDS)
    .addFields('node--moj_video_item', SUGGESTION_TILE_FIELDS)
    .addFields('node--moj_radio_item', SUGGESTION_TILE_FIELDS)
    .addFields('node--moj_pdf_item', SUGGESTION_TILE_FIELDS)
    .addFields('file--file', FILE_FIELDS)
    .addInclude(['field_moj_thumbnail_image'])
    .addPageLimit(limit)
    .getQueryString()

export default buildSuggestionsQueryString
