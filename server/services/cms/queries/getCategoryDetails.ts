import { JsonApiClient } from '../../../data'
import mapCategoryDetails from '../mappers/mapCategoryDetails'
import buildCategoryPageQueryString from '../query-string-builders/categoryPageBuilder'
import { CmsTagHeaderAttributes } from '../types'

const getCategoryDetails = async (
  establishmentName: string,
  categoryUuid: string,
  language: string,
  jsonApiClient: JsonApiClient,
) => {
  const queryString = buildCategoryPageQueryString()
  const path = `/${language}/jsonapi/prison/${establishmentName}/taxonomy_term/moj_categories/${categoryUuid}?${queryString}`
  const response = await jsonApiClient.getSingleByPath<CmsTagHeaderAttributes>(path)

  return mapCategoryDetails(response, language)
}

export default getCategoryDetails
