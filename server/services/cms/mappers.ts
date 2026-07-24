import { JsonApiCollectionResponse, JsonApiRelationships, JsonApiResource } from '../../data/jsonApiClient'
import {
  CmsFileAttributes,
  CmsNodeAttributes,
  CmsPath,
  CmsPrimaryNavigationAttributes,
  CmsPrimaryNavigationItem,
  CmsTaxonomyAttributes,
  CmsTopicAttributes,
  CmsTopicItem,
  CmsTopicPageItem,
  CmsUrgentBanner,
  CmsUrgentBannerAttributes,
  CmsTagItem,
  CategoryContent,
  CmsSearchResult,
  CmsSearchResultAttributes,
} from './types'
import {
  findIncluded,
  relationshipDataArray,
  resolveFileUrl,
  resolveLink,
  resolvePath,
  resolveTagHref,
  stripLanguagePrefix,
} from './utils'

export const mapTopic = (item: JsonApiResource<CmsTopicAttributes>): CmsTopicItem => ({
  id: `${item.attributes.drupal_internal__tid}`,
  linkText: item.attributes.name,
  href: `/tags/${item.attributes.drupal_internal__tid}`,
})

export const mapPrimaryNavigationItem = (
  item: JsonApiResource<CmsPrimaryNavigationAttributes>,
  language: string,
): CmsPrimaryNavigationItem => ({
  text: item.attributes.title,
  href: stripLanguagePrefix(resolveLink(item.attributes.url), language),
})

export const mapTopicPageItem = (item: JsonApiResource<CmsNodeAttributes>): CmsTopicPageItem => ({
  id: item.id,
  title: item.attributes.title,
  summary: item.attributes.field_summary,
  href: resolvePath(item.attributes.path, item.attributes.drupal_internal__nid),
})

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

export const mapUrgentBanner = (
  item: JsonApiResource<CmsUrgentBannerAttributes>,
  included: JsonApiResource[] | undefined,
): CmsUrgentBanner => {
  const moreInfoIdentifier = relationshipDataArray(item.relationships?.field_more_info_page)[0]
  const moreInfoPage =
    included && moreInfoIdentifier ? findIncluded<{ path?: CmsPath }>(included, moreInfoIdentifier) : undefined

  return {
    title: item.attributes.title,
    moreInfoLink: moreInfoPage?.attributes.path?.alias ?? null,
    unpublishOn: item.attributes.unpublish_on ? new Date(item.attributes.unpublish_on).getTime() : null,
  }
}

export const mapSearchResponse = (
  response: JsonApiCollectionResponse<CmsSearchResultAttributes>,
): CmsSearchResult[] => {
  return response.data.map(item => {
    return {
      title: item.attributes.title,
      summary: item.attributes.field_summary || 'No summary available',
      url: item.attributes.path?.alias || `/content/${item.attributes.drupal_internal__nid}`,
    }
  })
}
