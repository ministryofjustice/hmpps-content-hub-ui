import { JsonApiResource } from '../../../data/jsonApiClient'
import { CmsPrimaryNavigationAttributes, CmsPrimaryNavigationItem } from '../types'
import { resolveLink, stripLanguagePrefix } from '../utils'

const mapPrimaryNavigationItem = (
  item: JsonApiResource<CmsPrimaryNavigationAttributes>,
  language: string,
): CmsPrimaryNavigationItem => ({
  text: item.attributes.title,
  href: stripLanguagePrefix(resolveLink(item.attributes.url), language),
})

export default mapPrimaryNavigationItem
