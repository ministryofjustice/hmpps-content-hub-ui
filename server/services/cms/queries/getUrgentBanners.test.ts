import JsonApiClient, { JsonApiCollectionResponse } from '../../../data/jsonApiClient'
import { CmsUrgentBannerAttributes } from '../types'
import getUrgentBanners from './getUrgentBanners'

jest.mock('../../../data/jsonApiClient')

describe('getUrgentBanners', () => {
  const jsonApiClient = new JsonApiClient(null, null) as jest.Mocked<JsonApiClient>

  afterEach(() => {
    jest.resetAllMocks()
  })

  const collectionResponse: JsonApiCollectionResponse<CmsUrgentBannerAttributes> = {
    data: [
      {
        type: 'taxonomy_term--topics',
        id: 'topic-item-1',
        attributes: {
          drupal_internal__nid: 1,
          title: 'category-content',
          created: '2024-01-01T00:00:00Z',
          changed: '2026-01-01T00:00:00Z',
          unpublish_on: '2027-01-01T00:00:00Z',
        },
      },
    ],
  }

  it('should fetch urgent banner items', async () => {
    jsonApiClient.getCollectionByPath.mockResolvedValue(collectionResponse)

    const result = await getUrgentBanners('bullingdon', 'en', jsonApiClient)

    expect(result).toEqual([{ moreInfoLink: null, title: 'category-content', unpublishOn: 1798761600000 }])
  })
})
