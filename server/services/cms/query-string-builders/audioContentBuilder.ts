import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { COMMON_CONTENT_FIELDS, FILE_FIELDS } from './constants'

const AUDIO_CONTENT_FIELDS = [
  ...COMMON_CONTENT_FIELDS,
  'field_moj_audio',
  'field_description',
  'field_moj_season',
  'field_moj_episode',
  'field_moj_thumbnail_image',
  'field_moj_programme_code',
  'series_sort_value',
]

const AUDIO_CONTENT_INCLUDE = [
  'field_moj_thumbnail_image',
  'field_moj_series',
  'field_moj_audio',
  'field_topics',
  'field_moj_top_level_categories',
]

const buildAudioContentQueryString = () =>
  new DrupalJsonApiParams()
    .addFields('node--moj_radio_item', AUDIO_CONTENT_FIELDS)
    .addFields('file--file', FILE_FIELDS)
    .addFields('taxonomy_term--series', ['drupal_internal__tid', 'name', 'path'])
    .addFields('taxonomy_term--topics', ['drupal_internal__tid', 'name'])
    .addFields('taxonomy_term--moj_categories', ['drupal_internal__tid', 'name'])
    .addInclude(AUDIO_CONTENT_INCLUDE)
    .getQueryString()

export default buildAudioContentQueryString
