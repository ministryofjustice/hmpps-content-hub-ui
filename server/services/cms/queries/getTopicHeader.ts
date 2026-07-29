import { minutes } from '@ministryofjustice/hmpps-prisoner-auth'
import { JsonApiClient } from '../../../data'
import mapTagPageHeader from '../mappers/mapTagPageHeader'
import buildTopicHeaderQueryString from '../query-string-builders/topicHeaderBuilder'
import { CmsTagHeaderAttributes } from '../types'

const getTopicHeader = async (
  establishmentName: string,
  topicUuid: string,
  language: string,
  jsonApiClient: JsonApiClient,
) => {
  const queryString = buildTopicHeaderQueryString()
  const path = `/${language}/jsonapi/prison/${establishmentName}/taxonomy_term/topics/${topicUuid}?${queryString}`
  const response = await jsonApiClient.getSingleByPath<CmsTagHeaderAttributes>(path, minutes(1))
  return mapTagPageHeader(response, language)
}

export default getTopicHeader
