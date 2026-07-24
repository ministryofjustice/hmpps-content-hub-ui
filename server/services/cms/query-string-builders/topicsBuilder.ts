import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

const buildTopicsQueryString = () =>
  new DrupalJsonApiParams()
    .addFields('taxonomy_term--topics', ['drupal_internal__tid', 'name'])
    .addFilter('vid.meta.drupal_internal__target_id', 'topics')
    .addSort('name')
    .addPageLimit(100)
    .getQueryString()

export default buildTopicsQueryString
