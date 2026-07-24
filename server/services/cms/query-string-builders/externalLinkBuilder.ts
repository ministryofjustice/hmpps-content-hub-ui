import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

const buildExternalLinkQueryString = () =>
  new DrupalJsonApiParams().addFields('node--link', ['field_show_interstitial_page', 'field_url']).getQueryString()

export default buildExternalLinkQueryString
