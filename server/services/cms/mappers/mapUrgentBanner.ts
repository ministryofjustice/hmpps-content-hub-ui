import { JsonApiResource } from '../../../data/jsonApiClient'
import { CmsPath, CmsUrgentBanner, CmsUrgentBannerAttributes } from '../types'
import { findIncluded, relationshipDataArray } from '../utils'

const mapUrgentBanner = (
  item: JsonApiResource<CmsUrgentBannerAttributes>,
  included: JsonApiResource[] | undefined,
): CmsUrgentBanner => {
  const moreInfoIdentifier = relationshipDataArray(item.relationships?.field_more_info_page)[0]
  const moreInfoPage =
    included && moreInfoIdentifier ? findIncluded<{ path?: CmsPath }>(included, moreInfoIdentifier) : undefined

  return {
    title: item.attributes.title,
    moreInfoLink: moreInfoPage?.attributes.path?.alias ?? null,
    unpublishOn: item.attributes.unpublish_on ? new Date(item.attributes.unpublish_on).getTime() : null,
  }
}

export default mapUrgentBanner
