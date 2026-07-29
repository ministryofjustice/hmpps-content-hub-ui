import JsonApiClient, { JsonApiCollectionResponse } from '../../../data/jsonApiClient'
import { CMSContentNodeAttributes } from '../types'
import getCategoryContent from './getCategoryContent'

jest.mock('../../../data/jsonApiClient')

describe('getCategoryContent', () => {
  const jsonApiClient = new JsonApiClient(null, null) as jest.Mocked<JsonApiClient>

  afterEach(() => {
    jest.resetAllMocks()
  })

  const collectionResponse: JsonApiCollectionResponse<CMSContentNodeAttributes> = {
    data: [
      {
        type: 'taxonomy_term--topics',
        id: 'category-content-1',
        attributes: {
          drupal_internal__nid: 1,
          drupal_internal__tid: 10,
          title: 'category-content',
          field_summary: 'content-summary',
          path: { alias: 'path-alias' },
          published_at: '2026-01-01T00:00:00.000Z',
          field_display_url: 'display-url',
        },
      },
    ],
  }

  it('should fetch category content', async () => {
    jsonApiClient.getCollectionByPath.mockResolvedValue(collectionResponse)

    const result = await getCategoryContent('bullingdon', 'category-uuid', 'en', jsonApiClient, 1)

    const expectedResult = {
      data: [
        {
          contentType: 'topics',
          contentUrl: 'path-alias',
          displayUrl: 'display-url',
          externalContent: false,
          id: 1,
          isNew: false,
          publishedAt: 'Thursday 01 January',
          summary: 'content-summary',
          thumbnailAlt: '',
          thumbnailUrl: '',
          title: 'category-content',
        },
      ],
      isLastPage: true,
    }

    expect(result).toEqual(expectedResult)
  })
})
