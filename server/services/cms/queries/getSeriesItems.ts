import { JsonApiClient } from '../../../data'
import mapContentItem from '../mappers/mapContentItem'
import buildSeriesItemsQueryString from '../query-string-builders/seriesItemBuilder'
import { CmsNodeAttributes } from '../types'

const getSeriesItems = async (
  establishmentName: string,
  seriesUuid: string,
  language: string,
  jsonApiClient: JsonApiClient,
  page: number = 1,
) => {
  const queryString = buildSeriesItemsQueryString(seriesUuid, page)
  const path = `/${language}/jsonapi/prison/${establishmentName}/node?${queryString}`
  const response = await jsonApiClient.getCollectionByPath<CmsNodeAttributes>(path)
  return {
    data: response.data.map(item => mapContentItem(item, response.included)),
    isLastPage: !response.links?.next,
  }
}

export default getSeriesItems
