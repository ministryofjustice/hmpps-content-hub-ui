import JsonApiClient, { JsonApiCollectionResponse } from '../data/jsonApiClient'
import CmsService, { CmsTopicAttributes } from './cmsService'

jest.mock('../data/jsonApiClient')

describe('CmsService', () => {
  const jsonApiClient = new JsonApiClient(null) as jest.Mocked<JsonApiClient>
  let cmsService: CmsService

  beforeEach(() => {
    cmsService = new CmsService(jsonApiClient)
  })

  it('should fetch topics and map them into topic items', async () => {
    const expectedResponse: JsonApiCollectionResponse<CmsTopicAttributes> = {
      data: [
        {
          type: 'taxonomy_term--topics',
          id: 'topic-1',
          attributes: {
            drupal_internal__tid: 42,
            name: 'Education',
          },
        },
      ],
    }

    jsonApiClient.getCollectionByPath.mockResolvedValue(expectedResponse)

    const result = await cmsService.getTopics('bullingdon', 'en')

    expect(jsonApiClient.getCollectionByPath).toHaveBeenCalledWith(
      '/en/jsonapi/prison/bullingdon/taxonomy_term?fields%5Btaxonomy_term--topics%5D=drupal_internal__tid%2Cname&filter%5Bvid.meta.drupal_internal__target_id%5D=topics&sort=name&page%5Blimit%5D=100',
    )
    expect(result).toEqual([
      {
        id: '42',
        linkText: 'Education',
        href: '/tags/42',
      },
    ])
  })
})
