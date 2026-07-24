import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

const URGENT_BANNER_FIELDS = [
  'drupal_internal__nid',
  'title',
  'created',
  'changed',
  'field_more_info_page',
  'unpublish_on',
]

const buildUrgentBannerQueryString = () =>
  new DrupalJsonApiParams()
    .addFields('node--urgent_banner', URGENT_BANNER_FIELDS)
    .addFields('node--page', ['path'])
    .addInclude(['field_more_info_page'])
    .getQueryString()

export default buildUrgentBannerQueryString
