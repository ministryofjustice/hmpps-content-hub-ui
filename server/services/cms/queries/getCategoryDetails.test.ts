import JsonApiClient, { JsonApiSingleResponse } from '../../../data/jsonApiClient'
import { CategoryContent, CmsBreadcrumbItem, CmsTagHeaderAttributes, CmsTagItem } from '../types'
import getCategoryDetails from './getCategoryDetails'

jest.mock('../../../data/jsonApiClient')

describe('getCategoryDetails', () => {
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
        name: 'category-details',
        path: { alias: 'path-alias' },
        description: { processed: 'category-detail-description' },
        breadcrumbs: [],
      },
    },
  }

  it('should fetch category details', async () => {
    jsonApiClient.getSingleByPath.mockResolvedValue(singleResponse)

    const result = await getCategoryDetails('bullingdon', 'category-uuid', 'en', jsonApiClient)

    const expectedResult = {
      breadcrumbs: [] as CmsBreadcrumbItem[],
      categoryFeaturedContent: [] as CmsTagItem<CategoryContent>[],
      description: 'category-detail-description',
      name: 'category-details',
    }

    expect(result).toEqual(expectedResult)
  })
})
