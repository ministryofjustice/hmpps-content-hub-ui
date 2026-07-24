import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { HEADER_FIELDS, FILE_FIELDS } from './constants'

const buildTopicHeaderQueryString = () =>
  new DrupalJsonApiParams()
    .addFields('taxonomy_term--topics', HEADER_FIELDS)
    .addInclude(['field_moj_thumbnail_image'])
    .addFields('file--file', FILE_FIELDS)
    .getQueryString()

export default buildTopicHeaderQueryString
