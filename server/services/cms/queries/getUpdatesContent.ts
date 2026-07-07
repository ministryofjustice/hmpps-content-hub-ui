import { JsonApiClient } from '../../../data'
import mapUpdatesContent from '../mappers/mapUpdatesContent'
import buildUpdatesContentQueryString from '../query-string-builders/updatesContentBuilder'
import { CMSContentNodeAttributes, UpdatesContent } from '../types'

const getUpdatesContent = async (
  establishmentName: string,
  language: string,
  jsonApiClient: JsonApiClient,
  page?: number,
  limit?: number,
): Promise<UpdatesContent> => {
  const queryString = buildUpdatesContentQueryString(page, limit)
  const path = `/${language}/jsonapi/prison/${establishmentName}/node?${queryString}`
  const response = await jsonApiClient.getCollectionByPath<CMSContentNodeAttributes>(path)
  return mapUpdatesContent(response)
}

export default getUpdatesContent
