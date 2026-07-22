import { JsonApiRelationships, JsonApiResource } from '../../../data/jsonApiClient'
import { CmsTopicAttributes } from '../types'
import { findIncluded, relationshipDataArray } from '../utils'

const mapContentTopics = (
  relationships: JsonApiRelationships | undefined,
  included: JsonApiResource[] | undefined,
): { id: number; name: string }[] => {
  const identifiers = relationshipDataArray(relationships?.field_topics)
  if (!identifiers.length || !included) return []

  return identifiers
    .map(identifier => findIncluded<CmsTopicAttributes>(included, identifier))
    .filter((item): item is JsonApiResource<CmsTopicAttributes> => Boolean(item))
    .map(item => ({
      id: item.attributes.drupal_internal__tid,
      name: item.attributes.name,
    }))
}

export default mapContentTopics
