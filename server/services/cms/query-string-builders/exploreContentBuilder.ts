import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { HOMEPAGE_CONTENT_TILE, MOJ_THUMBNAIL_IMAGE_INCLUDE } from '../constants'

const buildExploreContentQueryString = (limit = 4) =>
  new DrupalJsonApiParams()
    .addFields('node--page', HOMEPAGE_CONTENT_TILE)
    .addFields('node--moj_video_item', HOMEPAGE_CONTENT_TILE)
    .addFields('node--moj_radio_item', HOMEPAGE_CONTENT_TILE)
    .addFields('node--moj_pdf_item', HOMEPAGE_CONTENT_TILE)
    .addInclude(MOJ_THUMBNAIL_IMAGE_INCLUDE)
    .addPageLimit(limit)
    .getQueryString()

export default buildExploreContentQueryString
