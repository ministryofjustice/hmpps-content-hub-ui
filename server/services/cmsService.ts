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

  private static buildTopicsQueryString() {
    const params = new URLSearchParams({
      'fields[taxonomy_term--topics]': 'drupal_internal__tid,name',
      'filter[vid.meta.drupal_internal__target_id]': 'topics',
      sort: 'name',
      'page[limit]': '100',
    })

    return params.toString()
  }
}
