import { JsonApiClient } from '../../../data'
import mapContentItem from '../mappers/mapContentItem'
import buildTopicItemsQueryString from '../query-string-builders/topicItemBuilder'

import { CmsNodeAttributes } from '../types'

const getTopicItems = async (
  establishmentName: string,
  topicUuid: string,
  language: string,
  jsonApiClient: JsonApiClient,
  page: number = 1,
) => {
  const queryString = buildTopicItemsQueryString(topicUuid, page)
  const path = `/${language}/jsonapi/prison/${establishmentName}/node?${queryString}`
  const response = await jsonApiClient.getCollectionByPath<CmsNodeAttributes>(path)
  return { data: response.data.map(item => mapContentItem(item, response.included)), isLastPage: !response.links?.next }
}

export default getTopicItems
