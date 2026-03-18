import { JsonApiCollectionResponse, JsonApiRelationships, JsonApiResource, JsonApiSingleResponse } from '../../data/jsonApiClient'
import type { EpisodeTile, ContentTile } from '../../@types/content'
import {
  CmsAudioContent,
  CmsAudioNodeAttributes,
  CmsCategoryFeaturedItem,
  CmsCategoryMenuAttributes,
  CmsCategoryMenuItem,
  CmsCategoryTermAttributes,
  CmsEpisodeTileNodeAttributes,
  CmsFileAttributes,
  CmsNodeAttributes,
  CmsPageContent,
  CmsPageNodeAttributes,
  CmsPath,
  CmsPrimaryNavigationAttributes,
  CmsPrimaryNavigationItem,
  CmsSeriesItem,
  CmsSeriesTermAttributes,
  CmsSuggestionNodeAttributes,
  CmsTaxonomyAttributes,
  CmsTopicAttributes,
  CmsTopicContentItem,
  CmsTopicHeaderAttributes,
  CmsTopicItem,
  CmsTopicPageItem,
  CmsVideoContent,
  CmsVideoNodeAttributes,
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

// Content page mappers

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

const mapEpisodeId = (season: number | undefined, episode: number | undefined): number | null => {
  if (season !== undefined && episode !== undefined) return season * 1000 + episode
  return episode ?? null
}

export const mapPageContent = (
  response: JsonApiSingleResponse<CmsPageNodeAttributes>,
  language: string,
): CmsPageContent => {
  const { data } = response
  return {
    id: data.attributes.drupal_internal__nid!,
    title: data.attributes.title,
    contentType: 'page',
    breadcrumbs: mapBreadcrumbs(data.attributes.breadcrumbs, language),
    description: data.attributes.field_main_body_content?.processed ?? null,
    standFirst: data.attributes.field_moj_stand_first ?? null,
    categories: mapContentCategory(data.relationships, response.included),
    topics: mapContentTopics(data.relationships, response.included),
    excludeFeedback: data.attributes.field_exclude_feedback ?? false,
  }
}

export const mapVideoContent = (
  response: JsonApiSingleResponse<CmsVideoNodeAttributes>,
  language: string,
): CmsVideoContent => {
  const { data } = response
  const series = mapSeriesInfo(data.relationships, response.included)
  const thumbnailIdentifier = relationshipDataArray(data.relationships?.field_moj_thumbnail_image)[0]
  const thumbnail = thumbnailIdentifier
    ? findIncluded<CmsFileAttributes>(response.included ?? [], thumbnailIdentifier)
    : undefined

  return {
    id: data.attributes.drupal_internal__nid!,
    uuid: data.id,
    created: data.attributes.created ?? null,
    title: data.attributes.title,
    contentType: 'video',
    breadcrumbs: mapBreadcrumbs(data.attributes.breadcrumbs, language),
    description: data.attributes.field_description?.processed ?? null,
    episodeId: mapEpisodeId(data.attributes.field_moj_season, data.attributes.field_moj_episode),
    seasonId: data.attributes.field_moj_season ?? null,
    seriesId: series.id,
    seriesPath: series.path,
    seriesName: series.name,
    seriesSortValue: data.attributes.series_sort_value ?? null,
    media: mapMediaUrl(data.relationships, response.included, 'field_video'),
    categories: mapContentCategory(data.relationships, response.included),
    topics: mapContentTopics(data.relationships, response.included),
    image: resolveFileUrl(thumbnail) ?? null,
    excludeFeedback: data.attributes.field_exclude_feedback ?? false,
  }
}

export const mapAudioContent = (
  response: JsonApiSingleResponse<CmsAudioNodeAttributes>,
  language: string,
): CmsAudioContent => {
  const { data } = response
  const series = mapSeriesInfo(data.relationships, response.included)
  const thumbnailIdentifier = relationshipDataArray(data.relationships?.field_moj_thumbnail_image)[0]
  const thumbnail = thumbnailIdentifier
    ? findIncluded<CmsFileAttributes>(response.included ?? [], thumbnailIdentifier)
    : undefined

  return {
    id: data.attributes.drupal_internal__nid!,
    uuid: data.id,
    created: data.attributes.created ?? null,
    title: data.attributes.title,
    contentType: 'radio',
    breadcrumbs: mapBreadcrumbs(data.attributes.breadcrumbs, language),
    description: data.attributes.field_description?.processed ?? null,
    programmeCode: data.attributes.field_moj_programme_code ?? null,
    episodeId: mapEpisodeId(data.attributes.field_moj_season, data.attributes.field_moj_episode),
    seasonId: data.attributes.field_moj_season ?? null,
    seriesId: series.id,
    seriesPath: series.path,
    seriesName: series.name,
    seriesSortValue: data.attributes.series_sort_value ?? null,
    media: mapMediaUrl(data.relationships, response.included, 'field_moj_audio'),
    categories: mapContentCategory(data.relationships, response.included),
    topics: mapContentTopics(data.relationships, response.included),
    image: resolveFileUrl(thumbnail) ?? null,
    excludeFeedback: data.attributes.field_exclude_feedback ?? false,
  }
}

// Next episodes / suggested content mappers

export const mapEpisodeTile = (
  item: JsonApiResource<CmsEpisodeTileNodeAttributes>,
  included: JsonApiResource[] | undefined,
): EpisodeTile => {
  const thumbnailIdentifier = relationshipDataArray(item.relationships?.field_moj_thumbnail_image)[0]
  const thumbnail =
    thumbnailIdentifier && included ? findIncluded<CmsFileAttributes>(included, thumbnailIdentifier) : undefined

  return {
    id: item.attributes.drupal_internal__nid!,
    episodeId: mapEpisodeId(item.attributes.field_moj_season, item.attributes.field_moj_episode),
    title: item.attributes.title,
    seasonId: item.attributes.field_moj_season ?? null,
    seriesSortValue: item.attributes.series_sort_value ?? null,
    image: resolveFileUrl(thumbnail) ? { url: resolveFileUrl(thumbnail)!, alt: '' } : null,
  }
}

export const mapNextEpisodes = (
  response: JsonApiCollectionResponse<CmsEpisodeTileNodeAttributes>,
): EpisodeTile[] => response.data.map(item => mapEpisodeTile(item, response.included))

const EXTERNAL_CONTENT_TYPES = new Set(['moj_pdf_item', 'link'])

const mapNodeTypeToContentType = (type: string): string => {
  const match = type.match(/(?<=--)(.*)/)?.[0] ?? ''
  if (match === 'moj_radio_item') return 'radio'
  if (match === 'moj_video_item') return 'video'
  return match
}

export const mapContentTile = (
  item: JsonApiResource<CmsSuggestionNodeAttributes>,
  included: JsonApiResource[] | undefined,
): ContentTile => {
  const thumbnailIdentifier = relationshipDataArray(item.relationships?.field_moj_thumbnail_image)[0]
  const thumbnail =
    thumbnailIdentifier && included ? findIncluded<CmsFileAttributes>(included, thumbnailIdentifier) : undefined
  const contentType = mapNodeTypeToContentType(item.type)
  const publishedAt = item.attributes.published_at

  return {
    id: (item.attributes.drupal_internal__nid ?? item.attributes.drupal_internal__tid)!,
    contentType,
    externalContent: EXTERNAL_CONTENT_TYPES.has(contentType),
    title: (item.attributes.title ?? item.attributes.name)!,
    summary: item.attributes.field_summary ?? '',
    contentUrl: resolvePath(item.attributes.path, item.attributes.drupal_internal__nid),
    displayUrl: item.attributes.field_display_url ?? '',
    image: resolveFileUrl(thumbnail) ? { url: resolveFileUrl(thumbnail)!, alt: '' } : null,
    isNew: publishedAt ? (Date.now() - new Date(publishedAt).getTime()) / 86_400_000 <= 2 : false,
  }
}

export const mapSuggestedContent = (
  response: JsonApiCollectionResponse<CmsSuggestionNodeAttributes>,
): ContentTile[] => response.data.map(item => mapContentTile(item, response.included))
