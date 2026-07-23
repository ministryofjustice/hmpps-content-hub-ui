import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { SERIES_ITEMS_TILE_FIELDS, FILE_FIELDS, SERIES_ITEMS_INCLUDE, PAGE_SIZE } from '../constants'
import { calculatePageOffset } from '../utils'

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
