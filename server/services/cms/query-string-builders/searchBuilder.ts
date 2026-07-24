import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

const buildSearchQueryString = (searchTerm: string, pageLimit = 5) =>
  new DrupalJsonApiParams().addFilter('fulltext', searchTerm).addPageLimit(pageLimit).getQueryString()

export default buildSearchQueryString
