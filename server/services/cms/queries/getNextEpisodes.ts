import { EpisodeTile } from '../../../@types/content'
import { JsonApiClient } from '../../../data'
import mapNextEpisodes from '../mappers/mapNextEpisodes'
import buildNextEpisodesQueryString from '../query-string-builders/nextEpisodesBuilder'
import { CmsEpisodeTileNodeAttributes } from '../types'

const getNextEpisodes = async (
  establishmentName: string,
  seriesId: number | null,
  seriesSortValue: number | null,
  created: string | null,
  language: string,
  jsonApiClient: JsonApiClient,
): Promise<EpisodeTile[]> => {
  if (!seriesId) return []

  const qs = buildNextEpisodesQueryString(seriesId, seriesSortValue, created)
  const path = `/${language}/jsonapi/prison/${establishmentName}/node?${qs}`
  const response = await jsonApiClient.getCollectionByPath<CmsEpisodeTileNodeAttributes>(path)
  return mapNextEpisodes(response)
}

export default getNextEpisodes
