import { JsonApiClient } from '../../../data'
import mapHomePageContent from '../mappers/mapHomepageContent'
import buildHomePageContentQueryString from '../query-string-builders/homepageContent'
import { CMSContentNodeAttributes, CmsHomePageRelationships, HomePageContent } from '../types'

const getHomepageContent = async (
  establishmentName: string,
  language: string,
  jsonApiClient: JsonApiClient,
): Promise<HomePageContent> => {
  const queryString = buildHomePageContentQueryString()
  const path = `/${language}/jsonapi/prison/${establishmentName}/node/homepage?${queryString}`
  const response = await jsonApiClient.getCollectionByPath<CMSContentNodeAttributes, CmsHomePageRelationships>(path)
  return mapHomePageContent(response.data[0].relationships, response.included)
}

export default getHomepageContent
