import { JsonApiClient } from '../../../data'
import mapTagPageHeader from '../mappers/mapTagPageHeader'
import buildSeriesHeaderQueryString from '../query-string-builders/seriesHeaderBuilder'
import { CmsTagHeaderAttributes } from '../types'

const getSeriesHeader = async (
  establishmentName: string,
  seriesUuid: string,
  language: string,
  jsonApiClient: JsonApiClient,
) => {
  const queryString = buildSeriesHeaderQueryString()
  const path = `/${language}/jsonapi/prison/${establishmentName}/taxonomy_term/series/${seriesUuid}?${queryString}`
  const response = await jsonApiClient.getSingleByPath<CmsTagHeaderAttributes>(path)
  return mapTagPageHeader(response, language)
}

export default getSeriesHeader
