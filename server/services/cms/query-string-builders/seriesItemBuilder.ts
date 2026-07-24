import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { FILE_FIELDS, PAGE_SIZE, CONTENT_TILE_FIELDS } from './constants'
import { calculatePageOffset } from '../utils'

const SERIES_ITEMS_INCLUDE = ['field_moj_thumbnail_image', 'field_moj_series.field_moj_thumbnail_image']
const SERIES_ITEMS_TILE_FIELDS = [...CONTENT_TILE_FIELDS, 'field_moj_series']

const buildSeriesItemsQueryString = (seriesUuid: string, page: number) =>
  new DrupalJsonApiParams()
    .addFilter('field_moj_series.id', seriesUuid)
    .addFields('node--page', SERIES_ITEMS_TILE_FIELDS)
    .addFields('node--moj_video_item', SERIES_ITEMS_TILE_FIELDS)
    .addFields('node--moj_radio_item', SERIES_ITEMS_TILE_FIELDS)
    .addFields('node--moj_pdf_item', SERIES_ITEMS_TILE_FIELDS)
    .addFields('file--file', FILE_FIELDS)
    .addInclude(SERIES_ITEMS_INCLUDE)
    .addSort('series_sort_value')
    .addSort('created')
    .addPageLimit(PAGE_SIZE)
    .addPageOffset(calculatePageOffset(page))
    .getQueryString()

export default buildSeriesItemsQueryString
