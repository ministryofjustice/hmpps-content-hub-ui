import { JsonApiRelationships, JsonApiResource } from '../../../data/jsonApiClient'
import { CmsPath, CmsTaxonomyAttributes } from '../types'
import { findIncluded, relationshipDataArray } from '../utils'

const mapSeriesInfo = (
  relationships: JsonApiRelationships | undefined,
  included: JsonApiResource[] | undefined,
): { id: number | null; name: string | null; path: string | null } => {
  const identifiers = relationshipDataArray(relationships?.field_moj_series)
  if (!identifiers.length || !included) return { id: null, name: null, path: null }

  const series = findIncluded<CmsTaxonomyAttributes & { path?: CmsPath }>(included, identifiers[0])
  if (!series) return { id: null, name: null, path: null }

  return {
    id: series.attributes.drupal_internal__tid ?? null,
    name: series.attributes.name ?? null,
    path: series.attributes.path?.alias ?? null,
  }
}

export default mapSeriesInfo
