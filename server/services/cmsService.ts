import JsonApiClient from '../data/jsonApiClient'
import {
  mapCategoryDetails,
  mapCategoryMenuItem,
  mapPrimaryNavigationItem,
  mapSeriesHeader,
  mapSeriesItem,
  mapTopic,
  mapTopicHeader,
  mapTopicItem,
  mapTopicPageItem,
} from './cms/mappers'
import {
  buildCategoryMenuQueryString,
  buildCategoryPageQueryString,
  buildPrimaryNavigationQueryString,
  buildSeriesHeaderQueryString,
  buildSeriesItemsQueryString,
  buildTagLookupQueryString,
  buildTopicHeaderQueryString,
  buildTopicItemsQueryString,
  buildTopicPageQueryString,
  buildTopicTermByTidQueryString,
  buildTopicsQueryString,
} from './cms/queries'
import { mapTagType } from './cms/utils'
import {
  CmsCategoryMenuAttributes,
  CmsCategoryTermAttributes,
  CmsNodeAttributes,
  CmsPrimaryNavigationAttributes,
  CmsPrimaryNavigationItem,
  CmsSeriesTermAttributes,
  CmsTag,
  CmsTagTermAttributes,
  CmsTagTermItem,
  CmsTopicAttributes,
  CmsTopicHeaderAttributes,
  CmsTopicItem,
  CmsTopicPage,
  CmsTopicTermAttributes,
  CmsTopicTermItem,
} from './cms/types'

export default class CmsService {
  constructor(private readonly jsonApiClient: JsonApiClient) {}

  async getTopics(establishmentName: string, language: string): Promise<CmsTopicItem[]> {
    const queryString = buildTopicsQueryString()
    const path = `/${language}/jsonapi/prison/${establishmentName}/taxonomy_term?${queryString}`
    const response = await this.jsonApiClient.getCollectionByPath<CmsTopicAttributes>(path)

    return response.data.map(mapTopic).sort((left, right) => left.linkText.localeCompare(right.linkText))
  }

  async getPrimaryNavigation(establishmentName: string, language: string): Promise<CmsPrimaryNavigationItem[]> {
    const queryString = buildPrimaryNavigationQueryString()
    const path = `/${language}/jsonapi/prison/${establishmentName}/primary_navigation?${queryString}`
    const response = await this.jsonApiClient.getCollectionByPath<CmsPrimaryNavigationAttributes>(path)

    return response.data.map(item => mapPrimaryNavigationItem(item, language))
  }

  async getTopicPage(
    establishmentName: string,
    topicId: string,
    language: string,
    page: number = 1,
  ): Promise<CmsTopicPage | null> {
    const topicTerm = await this.getTopicTermByTid(establishmentName, topicId, language)
    if (!topicTerm) return null

    const queryString = buildTopicPageQueryString(topicTerm.id, page)
    const path = `/${language}/jsonapi/prison/${establishmentName}/node?${queryString}`
    const response = await this.jsonApiClient.getCollectionByPath<CmsNodeAttributes>(path)

    return {
      topic: {
        id: `${topicTerm.attributes.drupal_internal__tid}`,
        title: topicTerm.attributes.name,
        description: topicTerm.attributes.description,
      },
      items: response.data.map(mapTopicPageItem),
    }
  }

  async getTag(establishmentName: string, tagId: string, language: string): Promise<CmsTag | null> {
    const queryString = buildTagLookupQueryString(tagId)
    const path = `/${language}/jsonapi/prison/${establishmentName}/taxonomy_term?${queryString}`
    const response = await this.jsonApiClient.getCollectionByPath<CmsTagTermAttributes>(path)
    const match = response.data[0] as CmsTagTermItem | undefined
    if (!match) return null

    const tagType = mapTagType(match.type)
    if (!tagType) return null

    const baseTag: CmsTag = {
      id: `${match.attributes.drupal_internal__tid ?? match.id}`,
      uuid: match.id,
      type: tagType,
      name: match.attributes.name,
      description: match.attributes.description,
    }

    if (tagType === 'topic') {
      const [topicHeader, topicItems] = await Promise.all([
        this.getTopicHeader(establishmentName, match.id, language),
        this.getTopicItems(establishmentName, match.id, language),
      ])

      return {
        ...baseTag,
        name: topicHeader?.name ?? baseTag.name,
        description: topicHeader?.description ?? baseTag.description,
        topicHeaderImageUrl: topicHeader?.thumbnailUrl,
        topicItems,
      }
    }

    if (tagType === 'series') {
      const [seriesHeader, seriesItems] = await Promise.all([
        this.getSeriesHeader(establishmentName, match.id, language),
        this.getSeriesItems(establishmentName, match.id, language),
      ])

      return {
        ...baseTag,
        name: seriesHeader?.name ?? baseTag.name,
        description: seriesHeader?.description ?? baseTag.description,
        seriesHeaderImageUrl: seriesHeader?.thumbnailUrl,
        seriesItems,
      }
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

  private async getTopicTermByTid(establishmentName: string, topicId: string, language: string) {
    const queryString = buildTopicTermByTidQueryString(topicId)
    const path = `/${language}/jsonapi/prison/${establishmentName}/taxonomy_term?${queryString}`
    const response = await this.jsonApiClient.getCollectionByPath<CmsTopicTermAttributes>(path)
    return (response.data[0] as CmsTopicTermItem | undefined) ?? null
  }

  private async getCategoryDetails(establishmentName: string, categoryUuid: string, language: string) {
    const queryString = buildCategoryPageQueryString()
    const path = `/${language}/jsonapi/prison/${establishmentName}/taxonomy_term/moj_categories/${categoryUuid}?${queryString}`
    const response = await this.jsonApiClient.getSingleByPath<CmsCategoryTermAttributes>(path)

    return mapCategoryDetails(response)
  }

  private async getCategoryMenu(establishmentName: string, categoryUuid: string, language: string) {
    const queryString = buildCategoryMenuQueryString()
    const response = await this.jsonApiClient.getCollectionByPath<CmsCategoryMenuAttributes>(
      `/${language}/jsonapi/prison/${establishmentName}/taxonomy_term/moj_categories/${categoryUuid}/sub_terms?${queryString}`,
    )
    return response.data.map(item => mapCategoryMenuItem(item, response.included))
  }

  private async getSeriesHeader(establishmentName: string, seriesUuid: string, language: string) {
    const queryString = buildSeriesHeaderQueryString()
    const path = `/${language}/jsonapi/prison/${establishmentName}/taxonomy_term/series/${seriesUuid}?${queryString}`
    const response = await this.jsonApiClient.getSingleByPath<CmsSeriesTermAttributes>(path)
    return mapSeriesHeader(response)
  }

  private async getTopicHeader(establishmentName: string, topicUuid: string, language: string) {
    const queryString = buildTopicHeaderQueryString()
    const path = `/${language}/jsonapi/prison/${establishmentName}/taxonomy_term/topics/${topicUuid}?${queryString}`
    const response = await this.jsonApiClient.getSingleByPath<CmsTopicHeaderAttributes>(path)
    return mapTopicHeader(response)
  }

  private async getSeriesItems(establishmentName: string, seriesUuid: string, language: string, page: number = 1) {
    const queryString = buildSeriesItemsQueryString(seriesUuid, page)
    const path = `/${language}/jsonapi/prison/${establishmentName}/node?${queryString}`
    const response = await this.jsonApiClient.getCollectionByPath<CmsNodeAttributes>(path)
    return response.data.map(item => mapSeriesItem(item, response.included))
  }

  private async getTopicItems(establishmentName: string, topicUuid: string, language: string, page: number = 1) {
    const queryString = buildTopicItemsQueryString(topicUuid, page)
    const path = `/${language}/jsonapi/prison/${establishmentName}/node?${queryString}`
    const response = await this.jsonApiClient.getCollectionByPath<CmsNodeAttributes>(path)
    return response.data.map(item => mapTopicItem(item, response.included))
  }
}
