import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { HOMEPAGE_CONTENT_TILE } from './constants'

const buildExploreContentQueryString = (limit = 4) =>
  new DrupalJsonApiParams()
    .addFields('node--page', HOMEPAGE_CONTENT_TILE)
    .addFields('node--moj_video_item', HOMEPAGE_CONTENT_TILE)
    .addFields('node--moj_radio_item', HOMEPAGE_CONTENT_TILE)
    .addFields('node--moj_pdf_item', HOMEPAGE_CONTENT_TILE)
    .addInclude(['field_moj_thumbnail_image'])
    .addPageLimit(limit)
    .getQueryString()

export default buildExploreContentQueryString
