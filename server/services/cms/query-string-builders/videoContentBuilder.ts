import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { FILE_FIELDS, VIDEO_CONTENT_FIELDS, VIDEO_CONTENT_INCLUDE } from '../constants'

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
