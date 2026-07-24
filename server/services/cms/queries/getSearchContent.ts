import { JsonApiClient } from '../../../data'
import mapSearchResponse from '../mappers/mapSearchResponse'
import buildSearchQueryString from '../query-string-builders/searchBuilder'
import { CmsSearchResult, CmsSearchResultAttributes } from '../types'

const getSearchContent = async (
  establishmentName: string,
  searchTerm: string,
  jsonApiClient: JsonApiClient,
  pageLimit?: number,
): Promise<CmsSearchResult[]> => {
  const queryString = buildSearchQueryString(searchTerm, pageLimit)

  const path = `/jsonapi/prison/${establishmentName}/index/content_for_search?${queryString}`
  const response = await jsonApiClient.getCollectionByPath<CmsSearchResultAttributes>(path)

  return mapSearchResponse(response)
}

export default getSearchContent
