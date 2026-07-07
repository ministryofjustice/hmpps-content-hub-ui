import { ContentTile } from '../../../@types/content'
import { JsonApiClient } from '../../../data'
import mapPaginatedContent from '../mappers/mapPaginatedContent'
import buildExploreContentQueryString from '../query-string-builders/exploreContentBuilder'
import { CMSContentNodeAttributes, CmsPaginatedContent } from '../types'

const getExploreContent = async (
  establishmentName: string,
  language: string,
  jsonApiClient: JsonApiClient,
): Promise<CmsPaginatedContent<ContentTile>> => {
  const queryString = buildExploreContentQueryString()
  const path = `/${language}/jsonapi/prison/${establishmentName}/explore/node?${queryString}`
  const response = await jsonApiClient.getCollectionByPath<CMSContentNodeAttributes>(path)
  return mapPaginatedContent(response)
}

export default getExploreContent
