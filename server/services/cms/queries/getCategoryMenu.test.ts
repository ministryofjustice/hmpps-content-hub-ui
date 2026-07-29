import JsonApiClient, { JsonApiCollectionResponse } from '../../../data/jsonApiClient'
import { CmsCategoryMenuAttributes } from '../types'
import getCategoryMenu from './getCategoryMenu'

jest.mock('../../../data/jsonApiClient')

describe('getCategoryMenu', () => {
  const jsonApiClient = new JsonApiClient(null, null) as jest.Mocked<JsonApiClient>

  afterEach(() => {
    jest.resetAllMocks()
  })

  const collectionResponse: JsonApiCollectionResponse<CmsCategoryMenuAttributes> = {
    data: [
      {
        type: 'taxonomy_term--topics',
        id: 'category-menu-1',
        attributes: {
          name: 'category-menu',
          path: { alias: 'path-alias' },
          drupal_internal__tid: 1,
        },
      },
    ],
  }

  it('should fetch category menu', async () => {
    jsonApiClient.getCollectionByPath.mockResolvedValue(collectionResponse)

    const result = await getCategoryMenu('bullingdon', 'category-uuid', 'en', jsonApiClient)

    expect(result).toEqual([
      { contentType: 'category', contentUrl: '/tags/1', id: '1', thumbnailUrl: undefined, title: 'category-menu' },
    ])
  })
})
