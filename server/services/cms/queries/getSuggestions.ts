import { ContentTile } from '../../../@types/content'
import { JsonApiClient } from '../../../data'
import mapContentToTiles from '../mappers/mapContentToTiles'
import buildSuggestionsQueryString from '../query-string-builders/suggestionsBuilder'
import { CMSContentNodeAttributes } from '../types'

const getSuggestions = async (
  establishmentName: string,
  uuid: string,
  language: string,
  jsonApiClient: JsonApiClient,
): Promise<ContentTile[]> => {
  const qs = buildSuggestionsQueryString()
  const path = `/${language}/jsonapi/prison/${establishmentName}/node/moj_radio_item/${uuid}/suggestions?${qs}`
  const response = await jsonApiClient.getCollectionByPath<CMSContentNodeAttributes>(path)
  return mapContentToTiles(response)
}

export default getSuggestions
