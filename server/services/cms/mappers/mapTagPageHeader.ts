import { JsonApiSingleResponse } from '../../../data/jsonApiClient'
import { CmsFileAttributes, CmsTagHeaderAttributes } from '../types'
import { relationshipDataArray, findIncluded, mapBreadcrumbs, resolveFileUrl } from '../utils'

const mapTagPageHeader = (response: JsonApiSingleResponse<CmsTagHeaderAttributes>, language: string = 'en') => {
  const term = response.data
  const thumbnailIdentifier = relationshipDataArray(term.relationships?.field_moj_thumbnail_image)[0]
  const thumbnail = thumbnailIdentifier
    ? findIncluded<CmsFileAttributes>(response.included ?? [], thumbnailIdentifier)
    : undefined

  return {
    name: term.attributes.name,
    description: term.attributes.description?.processed,
    breadcrumbs: mapBreadcrumbs(term.attributes.breadcrumbs, language),
    thumbnailUrl: resolveFileUrl(thumbnail),
  }
}

export default mapTagPageHeader
