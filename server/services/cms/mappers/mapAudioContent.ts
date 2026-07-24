import { JsonApiSingleResponse } from '../../../data/jsonApiClient'
import { CmsAudioContent, CmsAudioNodeAttributes, CmsFileAttributes } from '../types'
import { findIncluded, mapBreadcrumbs, relationshipDataArray, resolveFileUrl } from '../utils'
import mapContentCategory from './mapContentCategory'
import mapContentTopics from './mapContentTopics'
import mapEpisodeId from './mapEpisodeId'
import mapMediaUrl from './mapMediaUrl'
import mapSeriesInfo from './mapSeriesInfo'

const mapAudioContent = (
  response: JsonApiSingleResponse<CmsAudioNodeAttributes>,
  language: string,
): CmsAudioContent => {
  const { data } = response
  const series = mapSeriesInfo(data.relationships, response.included)
  const thumbnailIdentifier = relationshipDataArray(data.relationships?.field_moj_thumbnail_image)[0]
  const thumbnail = thumbnailIdentifier
    ? findIncluded<CmsFileAttributes>(response.included ?? [], thumbnailIdentifier)
    : undefined

  return {
    id: data.attributes.drupal_internal__nid!,
    uuid: data.id,
    created: data.attributes.created ?? null,
    title: data.attributes.title,
    contentType: 'radio',
    breadcrumbs: mapBreadcrumbs(data.attributes.breadcrumbs, language),
    description: data.attributes.field_description?.processed ?? null,
    programmeCode: data.attributes.field_moj_programme_code ?? null,
    episodeId: mapEpisodeId(data.attributes.field_moj_season, data.attributes.field_moj_episode),
    seasonId: data.attributes.field_moj_season ?? null,
    seriesId: series.id,
    seriesPath: series.path,
    seriesName: series.name,
    seriesSortValue: data.attributes.series_sort_value ?? null,
    media: mapMediaUrl(data.relationships, response.included, 'field_moj_audio'),
    categories: mapContentCategory(data.relationships, response.included),
    topics: mapContentTopics(data.relationships, response.included),
    image: resolveFileUrl(thumbnail) ?? null,
    excludeFeedback: data.attributes.field_exclude_feedback ?? false,
  }
}
export default mapAudioContent
