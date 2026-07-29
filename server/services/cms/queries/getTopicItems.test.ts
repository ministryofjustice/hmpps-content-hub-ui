import JsonApiClient, { JsonApiCollectionResponse } from '../../../data/jsonApiClient'
import { CmsNodeAttributes } from '../types'
import getTopicItems from './getTopicItems'

jest.mock('../../../data/jsonApiClient')

describe('getTopicItems', () => {
  const jsonApiClient = new JsonApiClient(null, null) as jest.Mocked<JsonApiClient>

  afterEach(() => {
    jest.resetAllMocks()
  })

  const collectionResponse: JsonApiCollectionResponse<CmsNodeAttributes> = {
    data: [
      {
        type: 'taxonomy_term--topics',
        id: 'topic-item-1',
        attributes: {
          drupal_internal__nid: 1,
          title: 'category-content',
          field_summary: 'content-summary',
          path: { alias: 'path-alias' },
        },
      },
    ],
  }

  it('should fetch topic items', async () => {
    jsonApiClient.getCollectionByPath.mockResolvedValue(collectionResponse)

    const result = await getTopicItems('bullingdon', 'category-uuid', 'en', jsonApiClient)

    const expectedResult = {
      data: [
        {
          contentType: 'page',
          contentUrl: 'path-alias',
          id: 'topic-item-1',
          summary: 'content-summary',
          title: 'category-content',
        },
      ],
      isLastPage: true,
    }

    expect(result).toEqual(expectedResult)
  })
})
