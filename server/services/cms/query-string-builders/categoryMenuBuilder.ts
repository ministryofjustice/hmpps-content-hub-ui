import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { MENU_FIELDS, FILE_FIELDS } from './constants'
import { calculatePageOffset } from '../utils'

const buildCategoryMenuQueryString = (page = 1, limit: number = 41) =>
  new DrupalJsonApiParams()
    .addFields('taxonomy_term--series', MENU_FIELDS)
    .addFields('taxonomy_term--moj_categories', MENU_FIELDS)
    .addInclude(['field_moj_thumbnail_image'])
    .addFields('file--file', FILE_FIELDS)
    .addSort('created', 'DESC')
    .addPageLimit(limit)
    .addPageOffset(calculatePageOffset(page, limit))
    .getQueryString()

export default buildCategoryMenuQueryString
