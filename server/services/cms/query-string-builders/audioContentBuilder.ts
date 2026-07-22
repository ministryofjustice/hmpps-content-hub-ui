import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { AUDIO_CONTENT_FIELDS, AUDIO_CONTENT_INCLUDE, FILE_FIELDS } from '../constants'

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
