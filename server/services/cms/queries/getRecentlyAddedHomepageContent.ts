import { ContentTile } from '../../../@types/content'
import { JsonApiClient } from '../../../data'
import mapContentToTiles from '../mappers/mapContentToTiles'
import buildRecentlyAddedHomepageContentQueryString from '../query-string-builders/recentlyAddedHomepageBuilder'
import { CMSContentNodeAttributes } from '../types'

const getRecentlyAddedHomepageContent = async (
  establishmentName: string,
  language: string,
  jsonApiClient: JsonApiClient,
): Promise<ContentTile[]> => {
  const queryString = buildRecentlyAddedHomepageContentQueryString()
  const path = `/${language}/jsonapi/prison/${establishmentName}/recently-added?${queryString}`
  const response = await jsonApiClient.getCollectionByPath<CMSContentNodeAttributes>(path)
  return mapContentToTiles(response)
}

export default getRecentlyAddedHomepageContent
