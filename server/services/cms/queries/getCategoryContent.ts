import { minutes } from '@ministryofjustice/hmpps-prisoner-auth'
import { JsonApiClient } from '../../../data'
import mapContentToTiles from '../mappers/mapContentToTiles'
import buildCategoryContentQueryString from '../query-string-builders/categoryContentBuilder'
import { CMSContentNodeAttributes } from '../types'

const getCategoryContent = async (
  establishmentName: string,
  categoryUuid: string,
  language: string,
  jsonApiClient: JsonApiClient,
  page?: number,
) => {
  const queryString = buildCategoryContentQueryString(categoryUuid, page)
  const path = `/${language}/jsonapi/prison/${establishmentName}/node?${queryString}`
  const response = await jsonApiClient.getCollectionByPath<CMSContentNodeAttributes>(path, minutes(1))
  return { data: mapContentToTiles(response), isLastPage: !response.links?.next }
}

export default getCategoryContent
