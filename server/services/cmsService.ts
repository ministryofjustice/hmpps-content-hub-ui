import JsonApiClient, {
  JsonApiResource,
  JsonApiResourceIdentifier,
  JsonApiRelationships,
  JsonApiSingleResponse,
} from '../data/jsonApiClient'
import logger from '../../logger'

export interface CmsTopicAttributes {
  drupal_internal__tid: number
  name: string
}

export interface CmsTopicItem {
  id: string
  linkText: string
  href: string
}

export interface CmsPrimaryNavigationAttributes {
  title: string
  url: string | { uri?: string; url?: string }
}

export interface CmsPrimaryNavigationItem {
  text: string
  href: string
}

export interface CmsTopicPageHeader {
  id: string
  title: string
  description?: string
}

export interface CmsTopicPageItem {
  id: string
  title: string
  summary?: string
  href: string
}

export interface CmsTopicPage {
  topic: CmsTopicPageHeader
  items: CmsTopicPageItem[]
}

export type CmsTagType = 'topic' | 'series' | 'category'

export interface CmsTag {
  id: string
  uuid: string
  type: CmsTagType
  name?: string
  description?: string
  categoryFeaturedContent?: CmsCategoryFeaturedItem[]
  categoryMenu?: CmsCategoryMenuItem[]
}

export interface CmsCategoryFeaturedItem {
  id: string
  title?: string
  summary?: string
  href: string
  thumbnailUrl?: string
}

export interface CmsCategoryMenuItem {
  id: string
  linkText: string
  href: string
  thumbnailUrl?: string
}

type CmsPath = {
  alias?: string
  url?: string
}

type CmsTopicTermAttributes = {
  name: string
  description?: string
  drupal_internal__tid: number
}

type CmsTopicTermItem = {
  id: string
  attributes: CmsTopicTermAttributes
}

type CmsTagTermAttributes = {
  name?: string
  description?: string
  drupal_internal__tid?: number
}

type CmsTagTermItem = {
  type: string
  id: string
  attributes: CmsTagTermAttributes
}

type CmsNodeAttributes = {
  title: string
  field_summary?: string
  path?: CmsPath
  drupal_internal__nid?: number
}

type CmsFileAttributes = {
  image_style_uri?: Record<string, string>
  uri?: { url?: string; value?: string }
  url?: string
}

type CmsCategoryTermAttributes = {
  name?: string
  description?: { processed?: string }
  path?: CmsPath
  drupal_internal__tid?: number
}

type CmsCategoryMenuAttributes = {
  name?: string
  path?: CmsPath
  drupal_internal__tid?: number
}

export default class CmsService {
  constructor(private readonly jsonApiClient: JsonApiClient) {}

  async getTopics(establishmentName: string, language: string): Promise<CmsTopicItem[]> {
    const queryString = CmsService.buildTopicsQueryString()
    const path = `/${language}/jsonapi/prison/${establishmentName}/taxonomy_term?${queryString}`
    const response = await this.jsonApiClient.getCollectionByPath<CmsTopicAttributes>(path)

    return response.data
      .map(item => ({
        id: `${item.attributes.drupal_internal__tid}`,
        linkText: item.attributes.name,
        href: `/tags/${item.attributes.drupal_internal__tid}`,
      }))
      .sort((left, right) => left.linkText.localeCompare(right.linkText))
  }

  async getPrimaryNavigation(establishmentName: string, language: string): Promise<CmsPrimaryNavigationItem[]> {
    const queryString = CmsService.buildPrimaryNavigationQueryString()
    const path = `/${language}/jsonapi/prison/${establishmentName}/primary_navigation?${queryString}`
    const response = await this.jsonApiClient.getCollectionByPath<CmsPrimaryNavigationAttributes>(path)

    return response.data.map(item => ({
      text: item.attributes.title,
      href: CmsService.stripLanguagePrefix(CmsService.resolveLink(item.attributes.url), language),
    }))
  }

  async getTopicPage(
    establishmentName: string,
    topicId: string,
    language: string,
    page: number = 1,
  ): Promise<CmsTopicPage | null> {
    const topicTerm = await this.getTopicTermByTid(establishmentName, topicId, language)
    if (!topicTerm) return null

    const queryString = CmsService.buildTopicPageQueryString(topicTerm.id, page)
    const path = `/${language}/jsonapi/prison/${establishmentName}/node?${queryString}`
    const response = await this.jsonApiClient.getCollectionByPath<CmsNodeAttributes>(path)

    return {
      topic: {
        id: `${topicTerm.attributes.drupal_internal__tid}`,
        title: topicTerm.attributes.name,
        description: topicTerm.attributes.description,
      },
      items: response.data.map(item => ({
        id: item.id,
        title: item.attributes.title,
        summary: item.attributes.field_summary,
        href: CmsService.resolvePath(item.attributes.path, item.attributes.drupal_internal__nid),
      })),
    }
  }

  async getTag(establishmentName: string, tagId: string, language: string): Promise<CmsTag | null> {
    const queryString = CmsService.buildTagLookupQueryString(tagId)
    const path = `/${language}/jsonapi/prison/${establishmentName}/taxonomy_term?${queryString}`
    const response = await this.jsonApiClient.getCollectionByPath<CmsTagTermAttributes>(path)
    const match = response.data[0] as CmsTagTermItem | undefined
    if (!match) return null

    const tagType = CmsService.mapTagType(match.type)
    if (!tagType) return null

    const baseTag: CmsTag = {
      id: `${match.attributes.drupal_internal__tid ?? match.id}`,
      uuid: match.id,
      type: tagType,
      name: match.attributes.name,
      description: match.attributes.description,
    }

    if (tagType !== 'category') return baseTag

    const [categoryDetails, categoryMenu] = await Promise.all([
      this.getCategoryDetails(establishmentName, match.id, language),
      this.getCategoryMenu(establishmentName, match.id, language),
    ])
    return {
      ...baseTag,
      name: categoryDetails?.name ?? baseTag.name,
      description: categoryDetails?.description ?? baseTag.description,
      categoryFeaturedContent: categoryDetails?.categoryFeaturedContent ?? [],
      categoryMenu,
    }
  }

  private static buildTopicsQueryString() {
    const params = new URLSearchParams({
      'fields[taxonomy_term--topics]': 'drupal_internal__tid,name',
      'filter[vid.meta.drupal_internal__target_id]': 'topics',
      sort: 'name',
      'page[limit]': '100',
    })

    return params.toString()
  }

  private static buildPrimaryNavigationQueryString() {
    const params = new URLSearchParams({
      'fields[menu_link_content--menu_link_content]': 'id,title,url',
    })

    return params.toString()
  }

  private static buildTagLookupQueryString(tagId: string) {
    const params = new URLSearchParams({
      'fields[taxonomy_term--topics]': 'drupal_internal__tid,name,description',
      'fields[taxonomy_term--series]': 'drupal_internal__tid,name,description',
      'fields[taxonomy_term--moj_categories]': 'drupal_internal__tid,name,description',
      'filter[drupal_internal__tid]': tagId,
      'page[limit]': '1',
    })

    return params.toString()
  }

  private static buildCategoryPageQueryString() {
    const tileFields = [
      'drupal_internal__nid',
      'drupal_internal__tid',
      'title',
      'field_moj_thumbnail_image',
      'field_topics',
      'path',
      'field_exclude_feedback',
      'published_at',
    ].join(',')

    const params = new URLSearchParams({
      'fields[node--page]': tileFields,
      'fields[node--moj_video_item]': tileFields,
      'fields[node--moj_radio_item]': tileFields,
      'fields[node--moj_pdf_item]': tileFields,
      'fields[taxonomy_term--series]': tileFields,
      'fields[taxonomy_term--moj_categories]':
        'name,description,field_exclude_feedback,field_featured_tiles,breadcrumbs,child_term_count',
      include: 'field_featured_tiles,field_featured_tiles.field_moj_thumbnail_image',
      'fields[file--file]': 'image_style_uri,uri,url',
    })

    return params.toString()
  }

  private static buildCategoryMenuQueryString(termType: 'moj_categories' | 'series', categoryUuid: string) {
    const params = new URLSearchParams({
      [`fields[taxonomy_term--${termType}]`]: 'drupal_internal__tid,name,path,field_moj_thumbnail_image',
      'filter[vid.meta.drupal_internal__target_id]': termType,
      'filter[parent.id]': categoryUuid,
      'page[limit]': '100',
      include: 'field_moj_thumbnail_image',
      'fields[file--file]': 'image_style_uri,uri,url',
    })

    return params.toString()
  }

  private static buildTopicPageQueryString(topicUuid: string, page: number) {
    const pageSize = 40
    const params = new URLSearchParams({
      'filter[field_topics.id]': topicUuid,
      'fields[node--page]': 'drupal_internal__nid,title,field_summary,path,published_at',
      'fields[node--moj_video_item]': 'drupal_internal__nid,title,field_summary,path,published_at',
      'fields[node--moj_radio_item]': 'drupal_internal__nid,title,field_summary,path,published_at',
      'fields[node--moj_pdf_item]': 'drupal_internal__nid,title,field_summary,path,published_at',
      sort: '-created',
      'page[limit]': `${pageSize}`,
      'page[offset]': `${Math.max(page - 1, 0) * pageSize}`,
    })

    return params.toString()
  }

  private async getTopicTermByTid(establishmentName: string, topicId: string, language: string) {
    const params = new URLSearchParams({
      'fields[taxonomy_term--topics]': 'name,description,drupal_internal__tid',
      'filter[vid.meta.drupal_internal__target_id]': 'topics',
      'filter[drupal_internal__tid]': topicId,
      'page[limit]': '1',
    })

    const path = `/${language}/jsonapi/prison/${establishmentName}/taxonomy_term?${params.toString()}`
    const response = await this.jsonApiClient.getCollectionByPath<CmsTopicTermAttributes>(path)
    return (response.data[0] as CmsTopicTermItem | undefined) ?? null
  }

  private async getCategoryDetails(establishmentName: string, categoryUuid: string, language: string) {
    const queryString = CmsService.buildCategoryPageQueryString()
    const path = `/${language}/jsonapi/prison/${establishmentName}/taxonomy_term/moj_categories/${categoryUuid}?${queryString}`
    const response = await this.jsonApiClient.getSingleByPath<CmsCategoryTermAttributes>(path)

    logger.info('CMS category response', {
      categoryUuid,
      type: response.data?.type,
      attributes: response.data?.attributes,
      relationships: response.data?.relationships,
      includedCount: response.included?.length ?? 0,
    })

    return CmsService.mapCategoryDetails(response)
  }

  private async getCategoryMenu(establishmentName: string, categoryUuid: string, language: string) {
    const categoryQuery = CmsService.buildCategoryMenuQueryString('moj_categories', categoryUuid)
    const seriesQuery = CmsService.buildCategoryMenuQueryString('series', categoryUuid)

    const [categoryResponse, seriesResponse] = await Promise.all([
      this.jsonApiClient.getCollectionByPath<CmsCategoryMenuAttributes>(
        `/${language}/jsonapi/prison/${establishmentName}/taxonomy_term?${categoryQuery}`,
      ),
      this.jsonApiClient.getCollectionByPath<CmsCategoryMenuAttributes>(
        `/${language}/jsonapi/prison/${establishmentName}/taxonomy_term?${seriesQuery}`,
      ),
    ])

    const mapItem = (
      item: JsonApiResource<CmsCategoryMenuAttributes>,
      included: JsonApiResource[] | undefined,
    ): CmsCategoryMenuItem => {
      const thumbnailIdentifier = CmsService.relationshipDataArray(item.relationships?.field_moj_thumbnail_image)[0]
      const thumbnail = included && thumbnailIdentifier
        ? CmsService.findIncluded<CmsFileAttributes>(included, thumbnailIdentifier)
        : undefined

      return {
        id: `${item.attributes.drupal_internal__tid ?? item.id}`,
        linkText: item.attributes.name ?? 'Untitled',
        href: CmsService.resolveTagHref(item.attributes.path, item.attributes.drupal_internal__tid),
        thumbnailUrl: CmsService.resolveFileUrl(thumbnail),
      }
    }

    return [
      ...categoryResponse.data.map(item => mapItem(item, categoryResponse.included)),
      ...seriesResponse.data.map(item => mapItem(item, seriesResponse.included)),
    ]
  }

  private static resolveLink(value: CmsPrimaryNavigationAttributes['url']) {
    if (typeof value === 'string') return value
    return value.url || value.uri || '#'
  }

  private static stripLanguagePrefix(href: string, language: string) {
    if (!href || href === '#') return href
    if (href.startsWith('http://') || href.startsWith('https://')) return href

    const withSlash = href.startsWith('/') ? href : `/${href}`
    const prefix = `/${language}`

    if (withSlash === prefix) return '/'
    if (withSlash.startsWith(`${prefix}/`)) return `/${withSlash.slice(prefix.length + 1)}`

    return withSlash
  }

  private static resolvePath(path?: CmsPath, fallbackId?: number) {
    if (path?.alias) return path.alias
    if (path?.url) return path.url
    if (fallbackId) return `/content/${fallbackId}`
    return '#'
  }

  private static resolveTagHref(path?: CmsPath, fallbackId?: number) {
    if (fallbackId) return `/tags/${fallbackId}`
    return CmsService.resolvePath(path)
  }

  private static mapCategoryDetails(response: JsonApiSingleResponse<CmsCategoryTermAttributes>) {
    const category = response.data
    const name = category.attributes.name
    const description = category.attributes.description?.processed
    const featured = CmsService.mapCategoryFeaturedContent(category.relationships, response.included)

    return {
      name,
      description,
      categoryFeaturedContent: featured,
    }
  }

  private static mapCategoryFeaturedContent(
    relationships?: JsonApiRelationships,
    included?: JsonApiResource[],
  ): CmsCategoryFeaturedItem[] {
    const identifiers = CmsService.relationshipDataArray(relationships?.field_featured_tiles)
    if (!identifiers.length || !included) return []

    return identifiers
      .map(identifier => CmsService.findIncluded<CmsNodeAttributes>(included, identifier))
      .filter((item): item is JsonApiResource<CmsNodeAttributes> => Boolean(item))
      .map(item => {
        const thumbnailIdentifier = CmsService.relationshipDataArray(item.relationships?.field_moj_thumbnail_image)[0]
        const thumbnail = thumbnailIdentifier
          ? CmsService.findIncluded<CmsFileAttributes>(included, thumbnailIdentifier)
          : undefined

        return {
          id: item.id,
          title: item.attributes.title,
          summary: item.attributes.field_summary,
          href: CmsService.resolvePath(item.attributes.path, item.attributes.drupal_internal__nid),
          thumbnailUrl: CmsService.resolveFileUrl(thumbnail),
        }
      })
  }

  private static relationshipDataArray(relationship?: { data?: JsonApiResourceIdentifier | JsonApiResourceIdentifier[] | null }) {
    if (!relationship?.data) return []
    return Array.isArray(relationship.data) ? relationship.data : [relationship.data]
  }

  private static findIncluded<TAttributes>(
    included: JsonApiResource[],
    identifier: JsonApiResourceIdentifier,
  ): JsonApiResource<TAttributes> | undefined {
    return included.find(item => item.type === identifier.type && item.id === identifier.id) as
      | JsonApiResource<TAttributes>
      | undefined
  }

  private static resolveFileUrl(file?: JsonApiResource<CmsFileAttributes>) {
    if (!file) return undefined
    const styles = file.attributes.image_style_uri
    if (styles) {
      if (styles.tile_small) return styles.tile_small
      if (styles.tile_large) return styles.tile_large
      const styleUrl = Object.values(styles).find(value => typeof value === 'string')
      if (styleUrl) return styleUrl
    }

    if (file.attributes.uri?.url) return file.attributes.uri.url
    if (file.attributes.url) return file.attributes.url
    if (file.attributes.uri?.value) return file.attributes.uri.value
    return undefined
  }


  private static mapTagType(resourceType: string): CmsTagType | null {
    switch (resourceType) {
      case 'taxonomy_term--topics':
        return 'topic'
      case 'taxonomy_term--series':
        return 'series'
      case 'taxonomy_term--moj_categories':
        return 'category'
      default:
        return null
    }
  }
}
