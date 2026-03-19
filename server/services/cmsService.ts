import JsonApiClient from '../data/jsonApiClient'
import type { EpisodeTile, ContentTile } from '../@types/content'
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
  mapPageContent,
  mapVideoContent,
  mapAudioContent,
  mapNextEpisodes,
  mapSuggestedContent,
} from './cms/mappers'
import {
  buildAudioContentQueryString,
  buildCategoryMenuQueryString,
  buildCategoryPageQueryString,
  buildContentLookupQueryString,
  buildNextEpisodesQueryString,
  buildPageContentQueryString,
  buildPrimaryNavigationQueryString,
  buildSeriesHeaderQueryString,
  buildSeriesItemsQueryString,
  buildSuggestionsQueryString,
  buildTagLookupQueryString,
  buildTopicHeaderQueryString,
  buildTopicItemsQueryString,
  buildTopicPageQueryString,
  buildTopicTermByTidQueryString,
  buildTopicsQueryString,
  buildVideoContentQueryString,
} from './cms/queries'
import { mapTagType } from './cms/utils'
import {
  CmsAudioNodeAttributes,
  CmsCategoryMenuAttributes,
  CmsCategoryTermAttributes,
  CmsContent,
  CmsEpisodeTileNodeAttributes,
  CmsMediaContent,
  CmsNodeAttributes,
  CmsPageNodeAttributes,
  CmsPrimaryNavigationAttributes,
  CmsPrimaryNavigationItem,
  CmsSeriesTermAttributes,
  CmsSuggestionNodeAttributes,
  CmsTag,
  CmsTagTermAttributes,
  CmsTagTermItem,
  CmsTopicAttributes,
  CmsTopicHeaderAttributes,
  CmsTopicItem,
  CmsTopicPage,
  CmsTopicTermAttributes,
  CmsTopicTermItem,
  CmsVideoNodeAttributes,
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
      breadcrumbs: [],
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
        breadcrumbs: topicHeader?.breadcrumbs ?? baseTag.breadcrumbs,
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
        breadcrumbs: seriesHeader?.breadcrumbs ?? baseTag.breadcrumbs,
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
      breadcrumbs: categoryDetails?.breadcrumbs ?? baseTag.breadcrumbs,
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

    return mapCategoryDetails(response, language)
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
    return mapSeriesHeader(response, language)
  }

  private async getTopicHeader(establishmentName: string, topicUuid: string, language: string) {
    const queryString = buildTopicHeaderQueryString()
    const path = `/${language}/jsonapi/prison/${establishmentName}/taxonomy_term/topics/${topicUuid}?${queryString}`
    const response = await this.jsonApiClient.getSingleByPath<CmsTopicHeaderAttributes>(path)
    return mapTopicHeader(response, language)
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

  async getContent(establishmentName: string, contentId: number, language: string): Promise<CmsContent | null> {
    const lookupQs = buildContentLookupQueryString(`${contentId}`)
    const lookupPath = `/${language}/jsonapi/prison/${establishmentName}/node?${lookupQs}`
    const lookupResponse = await this.jsonApiClient.getCollectionByPath<CmsNodeAttributes>(lookupPath)
    const match = lookupResponse.data[0]
    if (!match) return null

    const { id: uuid } = match

    switch (match.type) {
      case 'node--page': {
        const qs = buildPageContentQueryString()
        const path = `/${language}/jsonapi/prison/${establishmentName}/node/page/${uuid}?${qs}`
        const response = await this.jsonApiClient.getSingleByPath<CmsPageNodeAttributes>(path)
        return mapPageContent(response, language)
      }
      case 'node--moj_video_item': {
        const qs = buildVideoContentQueryString()
        const path = `/${language}/jsonapi/prison/${establishmentName}/node/moj_video_item/${uuid}?${qs}`
        const response = await this.jsonApiClient.getSingleByPath<CmsVideoNodeAttributes>(path)
        const content = mapVideoContent(response, language)
        return this.enrichMediaContent(establishmentName, content, language)
      }
      case 'node--moj_radio_item': {
        const qs = buildAudioContentQueryString()
        const path = `/${language}/jsonapi/prison/${establishmentName}/node/moj_radio_item/${uuid}?${qs}`
        const response = await this.jsonApiClient.getSingleByPath<CmsAudioNodeAttributes>(path)
        const content = mapAudioContent(response, language)
        return this.enrichMediaContent(establishmentName, content, language)
      }
      default:
        return null
    }
  }

  private async enrichMediaContent(
    establishmentName: string,
    content: CmsMediaContent,
    language: string,
  ): Promise<CmsMediaContent & { nextEpisodes: EpisodeTile[]; suggestedContent: ContentTile[] }> {
    const [nextEpisodes, suggestedContent] = await Promise.all([
      this.getNextEpisodes(establishmentName, content.seriesId, content.seriesSortValue, content.created, language),
      this.getSuggestions(establishmentName, content.uuid, language),
    ])

    return { ...content, nextEpisodes, suggestedContent }
  }

  private async getNextEpisodes(
    establishmentName: string,
    seriesId: number | null,
    seriesSortValue: number | null,
    created: string | null,
    language: string,
  ): Promise<EpisodeTile[]> {
    if (!seriesId) return []

    const qs = buildNextEpisodesQueryString(seriesId, seriesSortValue, created)
    const path = `/${language}/jsonapi/prison/${establishmentName}/node?${qs}`
    const response = await this.jsonApiClient.getCollectionByPath<CmsEpisodeTileNodeAttributes>(path)
    return mapNextEpisodes(response)
  }

  private async getSuggestions(establishmentName: string, uuid: string, language: string): Promise<ContentTile[]> {
    const qs = buildSuggestionsQueryString()
    const path = `/${language}/jsonapi/prison/${establishmentName}/node/moj_radio_item/${uuid}/suggestions?${qs}`
    const response = await this.jsonApiClient.getCollectionByPath<CmsSuggestionNodeAttributes>(path)
    return mapSuggestedContent(response)
  }
}
