import JsonApiClient from '../data/jsonApiClient'

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
  type: CmsTagType
  name?: string
  description?: string
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

    return {
      id: `${match.attributes.drupal_internal__tid ?? match.id}`,
      type: tagType,
      name: match.attributes.name,
      description: match.attributes.description,
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
