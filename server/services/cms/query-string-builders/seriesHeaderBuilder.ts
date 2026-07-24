import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { HEADER_FIELDS, FILE_FIELDS } from './constants'

const buildSeriesHeaderQueryString = () =>
  new DrupalJsonApiParams()
    .addFields('taxonomy_term--series', HEADER_FIELDS)
    .addInclude(['field_moj_thumbnail_image'])
    .addFields('file--file', FILE_FIELDS)
    .getQueryString()

export default buildSeriesHeaderQueryString
