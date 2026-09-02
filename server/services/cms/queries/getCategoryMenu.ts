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
  page?: number,
) => {
  const queryString = buildCategoryMenuQueryString(page)
  const path = `/${language}/jsonapi/prison/${establishmentName}/taxonomy_term/moj_categories/${categoryUuid}/sub_terms?${queryString}`
  const response = await jsonApiClient.getCollectionByPath<CmsCategoryMenuAttributes>(path, minutes(1))
  return {
    data: response.data.map(item => mapCategoryMenuItem(item, response.included)),
    isLastPage: !response.links?.next,
  }
}

export default getCategoryMenu
