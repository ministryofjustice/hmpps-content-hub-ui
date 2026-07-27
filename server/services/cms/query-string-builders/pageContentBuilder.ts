import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

const PAGE_CONTENT_FIELDS = [
  'title',
  'field_topics',
  'field_moj_top_level_categories',
  'field_exclude_feedback',
  'breadcrumbs',
  'field_main_body_content',
  'field_moj_stand_first',
]

const PAGE_CONTENT_INCLUDE = ['field_topics', 'field_moj_top_level_categories']

const buildPageContentQueryString = () =>
  new DrupalJsonApiParams()
    .addFields('node--page', PAGE_CONTENT_FIELDS)
    .addInclude(PAGE_CONTENT_INCLUDE)
    .getQueryString()

export default buildPageContentQueryString
