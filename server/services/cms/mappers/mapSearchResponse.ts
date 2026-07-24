import { JsonApiCollectionResponse } from '../../../data/jsonApiClient'
import { CmsSearchResultAttributes, CmsSearchResult } from '../types'

const mapSearchResponse = (response: JsonApiCollectionResponse<CmsSearchResultAttributes>): CmsSearchResult[] => {
  return response.data.map(item => {
    return {
      title: item.attributes.title,
      summary: item.attributes.field_summary || 'No summary available',
      url: item.attributes.path?.alias || `/content/${item.attributes.drupal_internal__nid}`,
    }
  })
}

export default mapSearchResponse
