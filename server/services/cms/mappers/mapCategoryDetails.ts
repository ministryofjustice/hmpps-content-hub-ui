import { JsonApiRelationships, JsonApiResource, JsonApiSingleResponse } from '../../../data/jsonApiClient'
import {
  CategoryContent,
  CmsFileAttributes,
  CmsNodeAttributes,
  CmsTagHeaderAttributes,
  CmsTagItem,
  CmsTaxonomyAttributes,
} from '../types'
import {
  findIncluded,
  mapBreadcrumbs,
  relationshipDataArray,
  resolveFileUrl,
  resolvePath,
  resolveTagHref,
} from '../utils'

const mapCategoryDetails = (response: JsonApiSingleResponse<CmsTagHeaderAttributes>, language: string = 'en') => {
  const category = response.data
  const { name } = category.attributes
  const description = category.attributes.description?.processed
  const featured = mapCategoryFeaturedContent(category.relationships, response.included)

  return {
    name,
    description,
    breadcrumbs: mapBreadcrumbs(category.attributes.breadcrumbs, language),
    categoryFeaturedContent: featured,
  }
}

export const mapCategoryFeaturedContent = (
  relationships?: JsonApiRelationships,
  included?: JsonApiResource[],
): CmsTagItem<CategoryContent>[] => {
  const identifiers = relationshipDataArray(relationships?.field_featured_tiles)
  if (!identifiers.length || !included) return []

  return identifiers
    .map(identifier => findIncluded<CmsNodeAttributes>(included, identifier))
    .filter((item): item is JsonApiResource<CmsNodeAttributes> => Boolean(item))
    .map(item => {
      const thumbnailIdentifier = relationshipDataArray(item.relationships?.field_moj_thumbnail_image)[0]
      const thumbnail = thumbnailIdentifier ? findIncluded<CmsFileAttributes>(included, thumbnailIdentifier) : undefined

      const seriesIdentifier = relationshipDataArray(item.relationships?.field_moj_series)[0]
      const series = seriesIdentifier ? findIncluded<CmsTaxonomyAttributes>(included, seriesIdentifier) : undefined

      const seriesThumbnailIdentifier = series
        ? relationshipDataArray(series.relationships?.field_moj_thumbnail_image)[0]
        : undefined

      const seriesThumbnail = seriesThumbnailIdentifier
        ? findIncluded<CmsFileAttributes>(included, seriesThumbnailIdentifier)
        : undefined

      const isSeries = item.type === 'taxonomy_term--series' || Boolean(series)
      const isCategory = item.type === 'taxonomy_term--moj_categories'
      const taxonomyItem = series ?? (item as JsonApiResource<CmsTaxonomyAttributes>)
      const title = isSeries || isCategory ? taxonomyItem.attributes.name : item.attributes.title

      const contentUrl =
        isSeries || isCategory
          ? resolveTagHref(taxonomyItem.attributes.path, taxonomyItem.attributes.drupal_internal__tid)
          : resolvePath(item.attributes.path, item.attributes.drupal_internal__nid)

      let contentType: CategoryContent = 'content'

      if (isSeries) {
        contentType = 'series'
      } else if (isCategory) {
        contentType = 'category'
      }

      return {
        id: item.id,
        title: title ?? 'Untitled',
        summary: isSeries || isCategory ? undefined : item.attributes.field_summary,
        contentUrl,
        thumbnailUrl: resolveFileUrl(thumbnail) ?? resolveFileUrl(seriesThumbnail),
        contentType,
      }
    })
}

export default mapCategoryDetails
