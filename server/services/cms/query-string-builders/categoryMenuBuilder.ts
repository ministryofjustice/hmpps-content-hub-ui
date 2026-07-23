import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { MENU_FIELDS, FILE_FIELDS } from '../constants'

const buildCategoryMenuQueryString = () =>
  new DrupalJsonApiParams()
    .addFields('taxonomy_term--series', MENU_FIELDS)
    .addFields('taxonomy_term--moj_categories', MENU_FIELDS)
    .addInclude(['field_moj_thumbnail_image'])
    .addPageLimit(100)
    .addFields('file--file', FILE_FIELDS)
    .getQueryString()

export default buildCategoryMenuQueryString
