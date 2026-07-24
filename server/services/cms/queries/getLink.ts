import { JsonApiClient } from '../../../data'
import buildExternalLinkQueryString from '../query-string-builders/externalLinkBuilder'
import { CmsLink, CmsLinkAttributes, LookupType } from '../types'

const lookup = async (establishmentName: string, id: string, lookupType: LookupType, jsonApiClient: JsonApiClient) => {
  const lookupPath = `/router/prison/${establishmentName}/translate-path?path=${lookupType}/${id}`
  const lookupResponse = await jsonApiClient.getLookupByPath(lookupPath)
  return lookupResponse?.entity?.uuid
}

const getLink = async (
  establishmentName: string,
  linkId: string,
  language: string,
  jsonApiClient: JsonApiClient,
): Promise<CmsLink> => {
  const lookupResponse = await lookup(establishmentName, linkId, 'link', jsonApiClient)
  if (!lookupResponse) return null

  const queryString = buildExternalLinkQueryString()
  const path = `/${language}/jsonapi/prison/${establishmentName}/node/link/${lookupResponse}?${queryString}`
  const response = await jsonApiClient.getSingleByPath<CmsLinkAttributes>(path)

  return {
    url: response.data.attributes.field_url,
    intercept: response.data.attributes.field_show_interstitial_page === true,
  }
}

export default getLink
