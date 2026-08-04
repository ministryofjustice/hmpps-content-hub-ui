import { minutes } from '@ministryofjustice/hmpps-prisoner-auth'
import { JsonApiClient } from '../../../data'
import mapPrimaryNavigationItem from '../mappers/mapPrimaryNavigationItem'
import buildPrimaryNavigationQueryString from '../query-string-builders/primaryNavigationBuilder'
import { CmsPrimaryNavigationAttributes, CmsPrimaryNavigationItem } from '../types'

const getPrimaryNavigation = async (
  establishmentName: string,
  language: string,
  jsonApiClient: JsonApiClient,
): Promise<CmsPrimaryNavigationItem[]> => {
  const queryString = buildPrimaryNavigationQueryString()
  const path = `/${language}/jsonapi/prison/${establishmentName}/primary_navigation?${queryString}`
  const response = await jsonApiClient.getCollectionByPath<CmsPrimaryNavigationAttributes>(path, minutes(1440))

  return response.data.map(item => mapPrimaryNavigationItem(item, language))
}

export default getPrimaryNavigation
