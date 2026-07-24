import { JsonApiClient } from '../../../data'
import mapUrgentBanner from '../mappers/mapUrgentBanner'
import buildUrgentBannerQueryString from '../query-string-builders/urgentBannersBuilder'
import { CmsUrgentBanner, CmsUrgentBannerAttributes } from '../types'

const getUrgentBanners = async (
  establishmentName: string,
  language: string,
  jsonApiClient: JsonApiClient,
): Promise<CmsUrgentBanner[]> => {
  const queryString = buildUrgentBannerQueryString()
  const path = `/${language}/jsonapi/prison/${establishmentName}/node/urgent_banner?${queryString}`
  const response = await jsonApiClient.getCollectionByPath<CmsUrgentBannerAttributes>(path)
  const now = Date.now()
  return response.data
    .map(item => mapUrgentBanner(item, response.included))
    .filter(banner => banner.unpublishOn === null || banner.unpublishOn >= now)
}

export default getUrgentBanners
