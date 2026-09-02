import { ContentTile } from '../../../@types/content'
import { JsonApiClient } from '../../../data'
import buildTagLookupQueryString from '../query-string-builders/tagLookupBuilder'
import {
  CategoryMenuContent,
  CategoryType,
  CmsPaginatedContent,
  CmsTagItem,
  CmsTagTermAttributes,
  CmsTagTermItem,
  MediaContent,
} from '../types'
import { mapTagType } from '../utils'
import getCategoryContent from './getCategoryContent'
import getCategoryMenu from './getCategoryMenu'
import getSeriesItems from './getSeriesItems'
import getTopicItems from './getTopicItems'

const getTagPage = async (
  establishmentName: string,
  tagId: string,
  language: string,
  page: number,
  jsonApiClient: JsonApiClient,
  categoryType?: CategoryType,
): Promise<CmsPaginatedContent<CmsTagItem<MediaContent> | ContentTile | CmsTagItem<CategoryMenuContent>>> => {
  const queryString = buildTagLookupQueryString(tagId)
  const path = `/${language}/jsonapi/prison/${establishmentName}/taxonomy_term?${queryString}`
  const response = await jsonApiClient.getCollectionByPath<CmsTagTermAttributes>(path)
  const match = response.data[0] as CmsTagTermItem | undefined
  if (!match) return null

  const tagType = mapTagType(match.type)
  if (!tagType) return null

  if (tagType === 'topic') {
    const topicItems = await getTopicItems(establishmentName, match.id, language, jsonApiClient, page)
    return topicItems
  }

  if (tagType === 'series') {
    const seriesItems = await getSeriesItems(establishmentName, match.id, language, jsonApiClient, page)
    return seriesItems
  }

  if (tagType !== 'category') return null

  if (categoryType === 'content') {
    const categoryContent = await getCategoryContent(establishmentName, match.id, language, jsonApiClient, page)
    return categoryContent
  }

  const categoryMenu = await getCategoryMenu(establishmentName, match.id, language, jsonApiClient, page)
  return categoryMenu
}
export default getTagPage
