import { minutes } from '@ministryofjustice/hmpps-prisoner-auth'
import { JsonApiClient } from '../../../data'
import { JsonApiResource } from '../../../data/jsonApiClient'
import buildTopicsQueryString from '../query-string-builders/topicsBuilder'
import { CmsTopicAttributes, CmsTopicItem } from '../types'

const mapTopic = (item: JsonApiResource<CmsTopicAttributes>): CmsTopicItem => ({
  id: `${item.attributes.drupal_internal__tid}`,
  linkText: item.attributes.name,
  href: `/tags/${item.attributes.drupal_internal__tid}`,
})

const getTopics = async (
  establishmentName: string,
  language: string,
  jsonApiClient: JsonApiClient,
): Promise<CmsTopicItem[]> => {
  const queryString = buildTopicsQueryString()
  const path = `/${language}/jsonapi/prison/${establishmentName}/taxonomy_term?${queryString}`
  const response = await jsonApiClient.getCollectionByPath<CmsTopicAttributes>(path, minutes(1440))

  return response.data.map(mapTopic).sort((left, right) => left.linkText.localeCompare(right.linkText))
}

export default getTopics
