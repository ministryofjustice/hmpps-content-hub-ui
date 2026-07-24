import { JsonApiResource } from '../../../data/jsonApiClient'
import {
  CmsCategoryMenuAttributes,
  CmsTagItem,
  CategoryMenuContent,
  CmsFileAttributes,
  CmsTaxonomyAttributes,
} from '../types'
import { relationshipDataArray, findIncluded, resolveTagHref, resolveFileUrl } from '../utils'

const mapCategoryMenuItem = (
  item: JsonApiResource<CmsCategoryMenuAttributes>,
  included: JsonApiResource[] | undefined,
): CmsTagItem<CategoryMenuContent> => {
  const thumbnailIdentifier = relationshipDataArray(item.relationships?.field_moj_thumbnail_image)[0]
  const thumbnail =
    included && thumbnailIdentifier ? findIncluded<CmsFileAttributes>(included, thumbnailIdentifier) : undefined

  return {
    id: `${item.attributes.drupal_internal__tid ?? item.id}`,
    title: item.attributes.name ?? (item as JsonApiResource<CmsTaxonomyAttributes>).attributes.name ?? 'Untitled',
    contentUrl: resolveTagHref(item.attributes.path, item.attributes.drupal_internal__tid),
    thumbnailUrl: resolveFileUrl(thumbnail),
    contentType: item.type === 'taxonomy_term--series' ? 'series' : 'category',
  }
}

export default mapCategoryMenuItem
