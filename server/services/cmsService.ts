import JsonApiClient from '../data/jsonApiClient'
import type { ContentTile } from '../@types/content'
import {
  CmsContent,
  CmsLink,
  CmsPrimaryNavigationItem,
  CmsTag,
  CmsTopicItem,
  CmsUrgentBanner,
  UpdatesContent,
  HomePageContent,
  MediaContent,
  CmsTagItem,
  CmsPaginatedContent,
  CmsSearchResult,
} from './cms/types'
import getHomepageContent from './cms/queries/getHomepageContent'
import getRecentlyAddedContent from './cms/queries/getRecentlyAddedContent'
import getRecentlyAddedHomepageContent from './cms/queries/getRecentlyAddedHomepageContent'
import getExploreContent from './cms/queries/getExploreContent'
import getUpdatesContent from './cms/queries/getUpdatesContent'
import getTag from './cms/queries/getTag'
import getTagPage from './cms/queries/getTagPage'
import getContent from './cms/queries/getContent'
import getTopics from './cms/queries/getTopics'
import getPrimaryNavigation from './cms/queries/getPrimaryNavigation'
import getUrgentBanners from './cms/queries/getUrgentBanners'
import getLink from './cms/queries/getLink'
import getSearchContent from './cms/queries/getSearchContent'

export default class CmsService {
  constructor(private readonly jsonApiClient: JsonApiClient) {}

  async getTopics(establishmentName: string, language: string): Promise<CmsTopicItem[]> {
    return getTopics(establishmentName, language, this.jsonApiClient)
  }

  async getPrimaryNavigation(establishmentName: string, language: string): Promise<CmsPrimaryNavigationItem[]> {
    return getPrimaryNavigation(establishmentName, language, this.jsonApiClient)
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

  async getContent(establishmentName: string, contentId: number, language: string): Promise<CmsContent | null> {
    return getContent(establishmentName, contentId, language, this.jsonApiClient)
  }

  async getUrgentBanners(establishmentName: string, language: string): Promise<CmsUrgentBanner[]> {
    return getUrgentBanners(establishmentName, language, this.jsonApiClient)
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
    return getLink(establishmentName, linkId, language, this.jsonApiClient)
  }

  async getSearchContent(
    establishmentName: string,
    searchTerm: string,
    pageLimit?: number,
  ): Promise<CmsSearchResult[]> {
    return getSearchContent(establishmentName, searchTerm, this.jsonApiClient, pageLimit)
  }
}
