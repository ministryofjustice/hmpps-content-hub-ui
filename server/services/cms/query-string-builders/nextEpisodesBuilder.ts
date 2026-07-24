import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { FILE_FIELDS } from './constants'

const EPISODE_TILE_FIELDS = [
  'drupal_internal__nid',
  'title',
  'field_moj_episode',
  'field_moj_season',
  'field_moj_series',
  'series_sort_value',
  'field_moj_thumbnail_image',
]

const buildNextEpisodesQueryString = (seriesId: number, seriesSortValue: number | null, created: string | null) =>
  new DrupalJsonApiParams()
    .addFields('node--page', EPISODE_TILE_FIELDS)
    .addFields('node--moj_video_item', EPISODE_TILE_FIELDS)
    .addFields('node--moj_radio_item', EPISODE_TILE_FIELDS)
    .addFields('node--moj_pdf_item', EPISODE_TILE_FIELDS)
    .addInclude(['field_moj_thumbnail_image'])
    .addFilter('field_moj_series.meta.drupal_internal__tid', `${seriesId}`)
    .addGroup('next_items', 'OR')
    .addFilter('series_sort_value', `${seriesSortValue ?? 0}`, '>', 'next_items')
    .addFilter('created', created, '>', 'next_items')
    .addFields('file--file', FILE_FIELDS)
    .addSort('series_sort_value')
    .addSort('created')
    .addPageLimit(3)
    .getQueryString()

export default buildNextEpisodesQueryString
