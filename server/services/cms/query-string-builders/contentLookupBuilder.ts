import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

const buildContentLookupQueryString = (contentId: string) =>
  new DrupalJsonApiParams()
    .addFilter('drupal_internal__nid', contentId)
    .addFields('node--page', ['drupal_internal__nid'])
    .addFields('node--moj_video_item', ['drupal_internal__nid'])
    .addFields('node--moj_radio_item', ['drupal_internal__nid'])
    .addPageLimit(1)
    .getQueryString()

export default buildContentLookupQueryString
