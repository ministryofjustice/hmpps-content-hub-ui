import { JsonApiRelationships, JsonApiResource } from '../../../data/jsonApiClient'
import { CmsTaxonomyAttributes } from '../types'
import { findIncluded, relationshipDataArray } from '../utils'

const mapContentCategory = (
  relationships: JsonApiRelationships | undefined,
  included: JsonApiResource[] | undefined,
): { id: number; name: string } | null => {
  const identifiers = relationshipDataArray(relationships?.field_moj_top_level_categories)
  if (!identifiers.length || !included) return null

  const item = findIncluded<CmsTaxonomyAttributes>(included, identifiers[0])
  if (!item?.attributes.drupal_internal__tid || !item.attributes.name) return null

  return { id: item.attributes.drupal_internal__tid, name: item.attributes.name }
}

export default mapContentCategory
