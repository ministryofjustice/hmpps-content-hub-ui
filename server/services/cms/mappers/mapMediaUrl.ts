import { JsonApiRelationships, JsonApiResource } from '../../../data/jsonApiClient'
import { CmsFileAttributes } from '../types'
import { findIncluded, relationshipDataArray } from '../utils'

const mapMediaUrl = (
  relationships: JsonApiRelationships | undefined,
  included: JsonApiResource[] | undefined,
  fieldName: string,
): string | null => {
  const identifiers = relationshipDataArray(relationships?.[fieldName])
  if (!identifiers.length || !included) return null

  const file = findIncluded<CmsFileAttributes>(included, identifiers[0])
  return file?.attributes.uri?.url ?? null
}

export default mapMediaUrl
