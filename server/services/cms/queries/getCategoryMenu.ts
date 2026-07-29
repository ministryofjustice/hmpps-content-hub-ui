import { minutes } from '@ministryofjustice/hmpps-prisoner-auth'
import { JsonApiClient } from '../../../data'
import mapCategoryMenuItem from '../mappers/mapCategoryMenuItem'
import buildCategoryMenuQueryString from '../query-string-builders/categoryMenuBuilder'
import { CmsCategoryMenuAttributes } from '../types'

const getCategoryMenu = async (
  establishmentName: string,
  categoryUuid: string,
  language: string,
  jsonApiClient: JsonApiClient,
) => {
  const queryString = buildCategoryMenuQueryString()
  const path = `/${language}/jsonapi/prison/${establishmentName}/taxonomy_term/moj_categories/${categoryUuid}/sub_terms?${queryString}`
  const response = await jsonApiClient.getCollectionByPath<CmsCategoryMenuAttributes>(path, minutes(1))
  return response.data.map(item => mapCategoryMenuItem(item, response.included))
}

export default getCategoryMenu
