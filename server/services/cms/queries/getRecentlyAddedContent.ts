import { ContentTile } from '../../../@types/content'
import { JsonApiClient } from '../../../data'
import mapPaginatedContent from '../mappers/mapPaginatedContent'
import buildRecentlyAddedQueryString from '../query-string-builders/recentlyAddedBuilder'
import { CMSContentNodeAttributes, CmsPaginatedContent } from '../types'

const getRecentlyAddedContent = async (
  establishmentName: string,
  language: string,
  jsonApiClient: JsonApiClient,
  page?: number,
  limit?: number,
): Promise<CmsPaginatedContent<ContentTile>> => {
  const queryString = buildRecentlyAddedQueryString(page, limit)
  const path = `/${language}/jsonapi/prison/${establishmentName}/node?${queryString}`
  const response = await jsonApiClient.getCollectionByPath<CMSContentNodeAttributes>(path)
  return mapPaginatedContent(response)
}

export default getRecentlyAddedContent
