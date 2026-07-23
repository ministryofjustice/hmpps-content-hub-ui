import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { TAG_LOOKUP_FIELDS } from '../constants'

const buildTagLookupQueryString = (tagId: string) =>
  new DrupalJsonApiParams()
    .addFields('taxonomy_term--topics', TAG_LOOKUP_FIELDS)
    .addFields('taxonomy_term--series', TAG_LOOKUP_FIELDS)
    .addFields('taxonomy_term--moj_categories', TAG_LOOKUP_FIELDS)
    .addFilter('drupal_internal__tid', tagId)
    .addPageLimit(1)
    .getQueryString()

export default buildTagLookupQueryString
