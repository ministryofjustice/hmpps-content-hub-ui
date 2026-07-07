import { ContentTile } from '../../../@types/content'
import { JsonApiResourceIdentifier, JsonApiResource } from '../../../data/jsonApiClient'
import { ImageSize, CmsHomePageRelationships } from '../types'
import { cropTextWithEllipsis } from '../utils'
import mapContentTile from './mapContentTile'

const mapResourceIdentifierToTiles = (
  resourceIdentifier: JsonApiResourceIdentifier[],
  included: JsonApiResource[],
  size?: ImageSize,
): ContentTile[] => {
  if (!resourceIdentifier?.length || !included?.length) return []

  const resourceIds = resourceIdentifier.map(item => item.id)
  const includedItems = included.filter(item => resourceIds.includes(item.id))

  return includedItems.map(item => mapContentTile(item, included, size))
}

const mapHomePageContent = (relationships: CmsHomePageRelationships, included: JsonApiResource[]) => {
  return {
    featuredContent: {
      data: mapResourceIdentifierToTiles(relationships.field_featured_tiles?.data, included),
    },
    keyInfo: {
      data: mapResourceIdentifierToTiles(relationships.field_key_info_tiles?.data, included).map(keyInfoItem =>
        cropTextWithEllipsis(keyInfoItem, 30),
      ),
    },
    largeUpdateTile: relationships.field_large_update_tile
      ? mapResourceIdentifierToTiles([relationships.field_large_update_tile?.data], included, 'large')[0]
      : null,
  }
}

export default mapHomePageContent
