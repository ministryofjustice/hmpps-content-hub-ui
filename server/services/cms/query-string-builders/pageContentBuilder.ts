import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { PAGE_CONTENT_FIELDS, PAGE_CONTENT_INCLUDE } from '../constants'

const buildPageContentQueryString = () =>
  new DrupalJsonApiParams()
    .addFields('node--page', PAGE_CONTENT_FIELDS)
    .addFields('taxonomy_term--topics', ['drupal_internal__tid', 'name'])
    .addFields('taxonomy_term--moj_categories', ['drupal_internal__tid', 'name'])
    .addInclude(PAGE_CONTENT_INCLUDE)
    .getQueryString()

export default buildPageContentQueryString
