import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { COMMON_CONTENT_FIELDS, FILE_FIELDS } from './constants'

const VIDEO_CONTENT_FIELDS = [
  ...COMMON_CONTENT_FIELDS,
  'field_video',
  'field_description',
  'field_moj_season',
  'field_moj_episode',
  'field_moj_thumbnail_image',
  'series_sort_value',
]

const VIDEO_CONTENT_INCLUDE = [
  'field_moj_thumbnail_image',
  'field_moj_series',
  'field_video',
  'field_topics',
  'field_moj_top_level_categories',
]

const buildVideoContentQueryString = () =>
  new DrupalJsonApiParams()
    .addFields('node--moj_video_item', VIDEO_CONTENT_FIELDS)
    .addFields('file--file', FILE_FIELDS)
    .addFields('taxonomy_term--series', ['drupal_internal__tid', 'name', 'path'])
    .addFields('taxonomy_term--topics', ['drupal_internal__tid', 'name'])
    .addFields('taxonomy_term--moj_categories', ['drupal_internal__tid', 'name'])
    .addInclude(VIDEO_CONTENT_INCLUDE)
    .getQueryString()

export default buildVideoContentQueryString
