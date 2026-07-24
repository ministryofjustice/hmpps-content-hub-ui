import { EpisodeTile } from '../../../@types/content'
import { JsonApiCollectionResponse, JsonApiResource } from '../../../data/jsonApiClient'
import { CmsEpisodeTileNodeAttributes, CmsFileAttributes } from '../types'
import { findIncluded, relationshipDataArray, resolveFileUrl } from '../utils'
import mapEpisodeId from './mapEpisodeId'

const mapNextEpisodes = (response: JsonApiCollectionResponse<CmsEpisodeTileNodeAttributes>): EpisodeTile[] =>
  response.data.map(item => mapEpisodeTile(item, response.included))

const mapEpisodeTile = (
  item: JsonApiResource<CmsEpisodeTileNodeAttributes>,
  included: JsonApiResource[] | undefined,
): EpisodeTile => {
  const thumbnailIdentifier = relationshipDataArray(item.relationships?.field_moj_thumbnail_image)[0]
  const thumbnail =
    thumbnailIdentifier && included ? findIncluded<CmsFileAttributes>(included, thumbnailIdentifier) : undefined

  return {
    id: item.attributes.drupal_internal__nid!,
    episodeId: mapEpisodeId(item.attributes.field_moj_season, item.attributes.field_moj_episode),
    title: item.attributes.title,
    seasonId: item.attributes.field_moj_season ?? null,
    seriesSortValue: item.attributes.series_sort_value ?? null,
    thumbnailUrl: resolveFileUrl(thumbnail) ?? '',
    thumbnailAlt: '',
  }
}

export default mapNextEpisodes
