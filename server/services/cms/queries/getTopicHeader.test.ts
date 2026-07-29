import JsonApiClient, { JsonApiSingleResponse } from '../../../data/jsonApiClient'
import { CmsBreadcrumbItem, CmsTagHeaderAttributes } from '../types'
import getTopicHeader from './getTopicHeader'

jest.mock('../../../data/jsonApiClient')

describe('getTopicHeader', () => {
  const jsonApiClient = new JsonApiClient(null, null) as jest.Mocked<JsonApiClient>

  afterEach(() => {
    jest.resetAllMocks()
  })

  const singleResponse: JsonApiSingleResponse<CmsTagHeaderAttributes> = {
    data: {
      type: 'taxonomy_term--topics',
      id: 'search-result-1',
      attributes: {
        drupal_internal__tid: 10,
        name: 'topic-header',
        path: { alias: 'path-alias' },
        description: { processed: 'topic-header-description' },
        breadcrumbs: [],
      },
    },
  }

  it('should fetch category details', async () => {
    jsonApiClient.getSingleByPath.mockResolvedValue(singleResponse)

    const result = await getTopicHeader('bullingdon', 'category-uuid', 'en', jsonApiClient)

    const expectedResult = {
      breadcrumbs: [] as CmsBreadcrumbItem[],
      description: 'topic-header-description',
      name: 'topic-header',
    }

    expect(result).toEqual(expectedResult)
  })
})
