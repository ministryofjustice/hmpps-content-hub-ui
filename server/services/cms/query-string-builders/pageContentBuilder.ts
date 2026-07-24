import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { COMMON_CONTENT_FIELDS } from './constants'

const PAGE_CONTENT_FIELDS = [...COMMON_CONTENT_FIELDS, 'field_main_body_content', 'field_moj_stand_first']

const PAGE_CONTENT_INCLUDE = ['field_topics', 'field_moj_top_level_categories']

const buildPageContentQueryString = () =>
  new DrupalJsonApiParams()
    .addFields('node--page', PAGE_CONTENT_FIELDS)
    .addFields('taxonomy_term--topics', ['drupal_internal__tid', 'name'])
    .addFields('taxonomy_term--moj_categories', ['drupal_internal__tid', 'name'])
    .addInclude(PAGE_CONTENT_INCLUDE)
    .getQueryString()

export default buildPageContentQueryString
