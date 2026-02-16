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
      href: CmsService.resolveLink(item.attributes.url),
    }))
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

  private static resolveLink(value: CmsPrimaryNavigationAttributes['url']) {
    if (typeof value === 'string') return value
    return value.url || value.uri || '#'
  }
}
