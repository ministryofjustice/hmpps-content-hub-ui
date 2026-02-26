import { JsonApiRelationships, JsonApiResource, JsonApiSingleResponse } from '../../data/jsonApiClient'
import {
  CmsCategoryFeaturedItem,
  CmsCategoryMenuAttributes,
  CmsCategoryMenuItem,
  CmsCategoryTermAttributes,
  CmsFileAttributes,
  CmsNodeAttributes,
  CmsPrimaryNavigationAttributes,
  CmsPrimaryNavigationItem,
  CmsSeriesItem,
  CmsSeriesTermAttributes,
  CmsTaxonomyAttributes,
  CmsTopicContentItem,
  CmsTopicAttributes,
  CmsTopicHeaderAttributes,
  CmsTopicItem,
  CmsTopicPageItem,
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

export const mapCategoryDetails = (response: JsonApiSingleResponse<CmsCategoryTermAttributes>) => {
  const category = response.data
  const { name } = category.attributes
  const description = category.attributes.description?.processed
  const featured = mapCategoryFeaturedContent(category.relationships, response.included)

  return {
    name,
    description,
    categoryFeaturedContent: featured,
  }
}

export const mapCategoryMenuItem = (
  item: JsonApiResource<CmsCategoryMenuAttributes>,
  included: JsonApiResource[] | undefined,
): CmsCategoryMenuItem => {
  const thumbnailIdentifier = relationshipDataArray(item.relationships?.field_moj_thumbnail_image)[0]
  const thumbnail =
    included && thumbnailIdentifier ? findIncluded<CmsFileAttributes>(included, thumbnailIdentifier) : undefined

  return {
    id: `${item.attributes.drupal_internal__tid ?? item.id}`,
    linkText: item.attributes.name ?? (item as JsonApiResource<CmsTaxonomyAttributes>).attributes.name ?? 'Untitled',
    href: resolveTagHref(item.attributes.path, item.attributes.drupal_internal__tid),
    thumbnailUrl: resolveFileUrl(thumbnail),
    contentType: item.type === 'taxonomy_term--series' ? 'series' : 'category',
  }
}

export const mapSeriesHeader = (response: JsonApiSingleResponse<CmsSeriesTermAttributes>) => {
  const term = response.data
  const thumbnailIdentifier = relationshipDataArray(term.relationships?.field_moj_thumbnail_image)[0]
  const thumbnail = thumbnailIdentifier
    ? findIncluded<CmsFileAttributes>(response.included ?? [], thumbnailIdentifier)
    : undefined

  return {
    name: term.attributes.name,
    description: term.attributes.description?.processed,
    thumbnailUrl: resolveFileUrl(thumbnail),
  }
}

export const mapTopicHeader = (response: JsonApiSingleResponse<CmsTopicHeaderAttributes>) => {
  const term = response.data
  const thumbnailIdentifier = relationshipDataArray(term.relationships?.field_moj_thumbnail_image)[0]
  const thumbnail = thumbnailIdentifier
    ? findIncluded<CmsFileAttributes>(response.included ?? [], thumbnailIdentifier)
    : undefined

  return {
    name: term.attributes.name,
    description: term.attributes.description?.processed,
    thumbnailUrl: resolveFileUrl(thumbnail),
  }
}

const mapContentItem = (
  item: JsonApiResource<CmsNodeAttributes>,
  included: JsonApiResource[] | undefined,
): CmsSeriesItem | CmsTopicContentItem => {
  const thumbnailIdentifier = relationshipDataArray(item.relationships?.field_moj_thumbnail_image)[0]
  const thumbnail =
    thumbnailIdentifier && included ? findIncluded<CmsFileAttributes>(included, thumbnailIdentifier) : undefined
  const href = resolvePath(item.attributes.path, item.attributes.drupal_internal__nid)

  const contentTypeByNodeType: Record<string, 'video' | 'radio'> = {
    'node--moj_video_item': 'video',
    'node--moj_radio_item': 'radio',
  }
  const contentType: 'video' | 'radio' | 'page' | 'link' =
    contentTypeByNodeType[item.type] ?? (href.startsWith('/link/') ? 'link' : 'page')

  return {
    id: item.id,
    title: item.attributes.title,
    summary: item.attributes.field_summary,
    href,
    thumbnailUrl: resolveFileUrl(thumbnail),
    contentType,
  }
}

export const mapSeriesItem = (
  item: JsonApiResource<CmsNodeAttributes>,
  included: JsonApiResource[] | undefined,
): CmsSeriesItem => mapContentItem(item, included)

export const mapTopicItem = (
  item: JsonApiResource<CmsNodeAttributes>,
  included: JsonApiResource[] | undefined,
): CmsTopicContentItem => mapContentItem(item, included)

export const mapCategoryFeaturedContent = (
  relationships?: JsonApiRelationships,
  included?: JsonApiResource[],
): CmsCategoryFeaturedItem[] => {
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

      const href =
        isSeries || isCategory
          ? resolveTagHref(taxonomyItem.attributes.path, taxonomyItem.attributes.drupal_internal__tid)
          : resolvePath(item.attributes.path, item.attributes.drupal_internal__nid)

      let contentType: CmsCategoryFeaturedItem['contentType'] = 'content'

      if (isSeries) {
        contentType = 'series'
      } else if (isCategory) {
        contentType = 'category'
      }

      return {
        id: item.id,
        title: title ?? 'Untitled',
        summary: isSeries || isCategory ? undefined : item.attributes.field_summary,
        href,
        thumbnailUrl: resolveFileUrl(thumbnail) ?? resolveFileUrl(seriesThumbnail),
        contentType,
      }
    })
}
