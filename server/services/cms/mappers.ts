import {
  JsonApiCollectionResponse,
  JsonApiRelationships,
  JsonApiResource,
  JsonApiSingleResponse,
} from '../../data/jsonApiClient'
import {
  CmsCategoryMenuAttributes,
  CmsCategoryTermAttributes,
  CmsFileAttributes,
  CmsNodeAttributes,
  CmsPath,
  CmsPrimaryNavigationAttributes,
  CmsPrimaryNavigationItem,
  CmsSeriesTermAttributes,
  CmsTaxonomyAttributes,
  CmsTopicAttributes,
  CmsTopicHeaderAttributes,
  CmsTopicItem,
  CmsTopicPageItem,
  CmsUrgentBanner,
  CmsUrgentBannerAttributes,
  CmsTagItem,
  CategoryContent,
  CategoryMenuContent,
  MediaContent,
  CmsSearchResult,
  CmsSearchResultAttributes,
} from './types'
import {
  findIncluded,
  relationshipDataArray,
  resolveFileUrl,
  resolveLink,
  mapBreadcrumbs,
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

export const mapCategoryDetails = (
  response: JsonApiSingleResponse<CmsCategoryTermAttributes>,
  language: string = 'en',
) => {
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

export const mapCategoryMenuItem = (
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

export const mapSeriesHeader = (response: JsonApiSingleResponse<CmsSeriesTermAttributes>, language: string = 'en') => {
  const term = response.data
  const thumbnailIdentifier = relationshipDataArray(term.relationships?.field_moj_thumbnail_image)[0]
  const thumbnail = thumbnailIdentifier
    ? findIncluded<CmsFileAttributes>(response.included ?? [], thumbnailIdentifier)
    : undefined

  return {
    name: term.attributes.name,
    description: term.attributes.description?.processed,
    breadcrumbs: mapBreadcrumbs(term.attributes.breadcrumbs, language),
    thumbnailUrl: resolveFileUrl(thumbnail),
  }
}

export const mapTopicHeader = (response: JsonApiSingleResponse<CmsTopicHeaderAttributes>, language: string = 'en') => {
  const term = response.data
  const thumbnailIdentifier = relationshipDataArray(term.relationships?.field_moj_thumbnail_image)[0]
  const thumbnail = thumbnailIdentifier
    ? findIncluded<CmsFileAttributes>(response.included ?? [], thumbnailIdentifier)
    : undefined

  return {
    name: term.attributes.name,
    description: term.attributes.description?.processed,
    breadcrumbs: mapBreadcrumbs(term.attributes.breadcrumbs, language),
    thumbnailUrl: resolveFileUrl(thumbnail),
  }
}

const mapContentItem = (
  item: JsonApiResource<CmsNodeAttributes>,
  included: JsonApiResource[] | undefined,
): CmsTagItem<MediaContent> => {
  const thumbnailIdentifier = relationshipDataArray(item.relationships?.field_moj_thumbnail_image)[0]
  const thumbnail =
    thumbnailIdentifier && included ? findIncluded<CmsFileAttributes>(included, thumbnailIdentifier) : undefined
  const contentUrl = resolvePath(item.attributes.path, item.attributes.drupal_internal__nid)

  const contentTypeByNodeType: Record<string, 'video' | 'radio'> = {
    'node--moj_video_item': 'video',
    'node--moj_radio_item': 'radio',
  }
  const contentType: 'video' | 'radio' | 'page' | 'link' =
    contentTypeByNodeType[item.type] ?? (contentUrl.startsWith('/link/') ? 'link' : 'page')

  return {
    id: item.id,
    title: item.attributes.title,
    summary: item.attributes.field_summary,
    contentUrl,
    thumbnailUrl: resolveFileUrl(thumbnail),
    contentType,
  }
}

export const mapSeriesItem = (
  item: JsonApiResource<CmsNodeAttributes>,
  included: JsonApiResource[] | undefined,
): CmsTagItem<MediaContent> => mapContentItem(item, included)

export const mapTopicItem = (
  item: JsonApiResource<CmsNodeAttributes>,
  included: JsonApiResource[] | undefined,
): CmsTagItem<MediaContent> => mapContentItem(item, included)

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
