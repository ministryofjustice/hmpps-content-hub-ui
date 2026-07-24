import JsonApiClient from '../data/jsonApiClient'
import type { ContentTile } from '../@types/content'
import { mapPrimaryNavigationItem, mapTopic, mapTopicPageItem, mapUrgentBanner, mapSearchResponse } from './cms/mappers'
import {
  buildExternalLinkQueryString,
  buildPrimaryNavigationQueryString,
  buildTopicPageQueryString,
  buildTopicTermByTidQueryString,
  buildTopicsQueryString,
  buildUrgentBannerQueryString,
  buildSearchQueryString,
} from './cms/queries'
import {
  CmsContent,
  CmsLink,
  CmsLinkAttributes,
  CmsNodeAttributes,
  CmsPrimaryNavigationAttributes,
  CmsPrimaryNavigationItem,
  CmsTag,
  CmsTopicAttributes,
  CmsTopicItem,
  CmsTopicPage,
  CmsTopicTermAttributes,
  CmsTopicTermItem,
  CmsUrgentBanner,
  CmsUrgentBannerAttributes,
  UpdatesContent,
  HomePageContent,
  LookupType,
  MediaContent,
  CmsTagItem,
  CmsPaginatedContent,
  CmsSearchResult,
  CmsSearchResultAttributes,
} from './cms/types'
import getHomepageContent from './cms/queries/getHomepageContent'
import getRecentlyAddedContent from './cms/queries/getRecentlyAddedContent'
import getRecentlyAddedHomepageContent from './cms/queries/getRecentlyAddedHomepageContent'
import getExploreContent from './cms/queries/getExploreContent'
import getUpdatesContent from './cms/queries/getUpdatesContent'
import getTag from './cms/queries/getTag'
import getTagPage from './cms/queries/getTagPage'
import getContent from './cms/queries/getContent'

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
    return getTag(establishmentName, tagId, language, this.jsonApiClient)
  }

  async getTagPage(
    establishmentName: string,
    tagId: string,
    language: string,
    page: number,
  ): Promise<CmsPaginatedContent<CmsTagItem<MediaContent> | ContentTile>> {
    return getTagPage(establishmentName, tagId, language, page, this.jsonApiClient)
  }

  private async getTopicTermByTid(establishmentName: string, topicId: string, language: string) {
    const queryString = buildTopicTermByTidQueryString(topicId)
    const path = `/${language}/jsonapi/prison/${establishmentName}/taxonomy_term?${queryString}`
    const response = await this.jsonApiClient.getCollectionByPath<CmsTopicTermAttributes>(path)
    return (response.data[0] as CmsTopicTermItem | undefined) ?? null
  }

  async getContent(establishmentName: string, contentId: number, language: string): Promise<CmsContent | null> {
    return getContent(establishmentName, contentId, language, this.jsonApiClient)
  }

  async getUrgentBanners(establishmentName: string, language: string): Promise<CmsUrgentBanner[]> {
    const queryString = buildUrgentBannerQueryString()
    const path = `/${language}/jsonapi/prison/${establishmentName}/node/urgent_banner?${queryString}`
    const response = await this.jsonApiClient.getCollectionByPath<CmsUrgentBannerAttributes>(path)
    const now = Date.now()
    return response.data
      .map(item => mapUrgentBanner(item, response.included))
      .filter(banner => banner.unpublishOn === null || banner.unpublishOn >= now)
  }

  async getHomepageContent(establishmentName: string, language: string): Promise<HomePageContent> {
    return getHomepageContent(establishmentName, language, this.jsonApiClient)
  }

  async getRecentlyAddedHomepageContent(establishmentName: string, language: string): Promise<ContentTile[]> {
    return getRecentlyAddedHomepageContent(establishmentName, language, this.jsonApiClient)
  }

  async getRecentlyAddedContent(
    establishmentName: string,
    language: string,
    page?: number,
    limit?: number,
  ): Promise<CmsPaginatedContent<ContentTile>> {
    return getRecentlyAddedContent(establishmentName, language, this.jsonApiClient, page, limit)
  }

  async getExploreContent(establishmentName: string, language: string): Promise<CmsPaginatedContent<ContentTile>> {
    return getExploreContent(establishmentName, language, this.jsonApiClient)
  }

  async getUpdatesContent(
    establishmentName: string,
    language: string,
    page?: number,
    limit?: number,
  ): Promise<UpdatesContent> {
    return getUpdatesContent(establishmentName, language, this.jsonApiClient, page, limit)
  }

  async getLink(establishmentName: string, linkId: string, language: string): Promise<CmsLink> {
    const lookupResponse = await this.lookup(establishmentName, linkId, 'link')
    if (!lookupResponse) return null

    const queryString = buildExternalLinkQueryString()
    const path = `/${language}/jsonapi/prison/${establishmentName}/node/link/${lookupResponse}?${queryString}`
    const response = await this.jsonApiClient.getSingleByPath<CmsLinkAttributes>(path)

    return {
      url: response.data.attributes.field_url,
      intercept: response.data.attributes.field_show_interstitial_page === true,
    }
  }

  async getSearchContent(
    establishmentName: string,
    searchTerm: string,
    pageLimit?: number,
  ): Promise<CmsSearchResult[]> {
    const queryString = buildSearchQueryString(searchTerm, pageLimit)

    const path = `/jsonapi/prison/${establishmentName}/index/content_for_search?${queryString}`
    const response = await this.jsonApiClient.getCollectionByPath<CmsSearchResultAttributes>(path)

    return mapSearchResponse(response)
  }

  private async lookup(establishmentName: string, id: string, lookupType: LookupType) {
    const lookupPath = `/router/prison/${establishmentName}/translate-path?path=${lookupType}/${id}`
    const lookupResponse = await this.jsonApiClient.getLookupByPath(lookupPath)
    return lookupResponse?.entity?.uuid
  }
}
