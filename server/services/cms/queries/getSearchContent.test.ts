import JsonApiClient, { JsonApiCollectionResponse } from '../../../data/jsonApiClient'
import { CmsSearchResultAttributes } from '../types'
import getSearchContent from './getSearchContent'

jest.mock('../../../data/jsonApiClient')

describe('getSearchContent', () => {
  const jsonApiClient = new JsonApiClient(null, null) as jest.Mocked<JsonApiClient>

  afterEach(() => {
    jest.resetAllMocks()
  })

  const collectionResponse: JsonApiCollectionResponse<CmsSearchResultAttributes> = {
    data: [
      {
        type: 'taxonomy_term--topics',
        id: 'search-result-1',
        attributes: {
          title: 'search-result',
          drupal_internal__nid: 1,
          field_summary: 'search-result-field-summary',
          path: { alias: 'path-alias' },
        },
      },
    ],
  }

  it('should fetch search results', async () => {
    jsonApiClient.getCollectionByPath.mockResolvedValue(collectionResponse)

    const result = await getSearchContent('bullingdon', 'search-term', jsonApiClient, 1)

    expect(jsonApiClient.getCollectionByPath).toHaveBeenCalledWith(
      '/jsonapi/prison/bullingdon/index/content_for_search?filter%5Bfulltext%5D=search-term&page%5Blimit%5D=1',
    )

    expect(result).toEqual([{ summary: 'search-result-field-summary', title: 'search-result', url: 'path-alias' }])
  })
})
