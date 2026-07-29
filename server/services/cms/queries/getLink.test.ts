import JsonApiClient, { JsonApiLookupResponse, JsonApiSingleResponse } from '../../../data/jsonApiClient'
import { CmsLinkAttributes } from '../types'
import getLink from './getLink'

jest.mock('../../../data/jsonApiClient')

describe('getLink', () => {
  const jsonApiClient = new JsonApiClient(null, null) as jest.Mocked<JsonApiClient>

  afterEach(() => {
    jest.resetAllMocks()
  })

  const singleResponse: JsonApiSingleResponse<CmsLinkAttributes> = {
    data: {
      type: 'taxonomy_term--topics',
      id: 'external-link-1',
      attributes: {
        field_show_interstitial_page: true,
        field_url: 'external-url',
      },
    },
  }

  const lookupResponse: JsonApiLookupResponse = {
    entity: {
      canonical: 'canonical',
      type: 'link',
      bundle: 'bundle',
      id: 'external-link-1',
      uuid: 'uuid',
    },
  }

  it('should fetch external links', async () => {
    jsonApiClient.getLookupByPath.mockResolvedValue(lookupResponse)
    jsonApiClient.getSingleByPath.mockResolvedValue(singleResponse)

    const result = await getLink('bullingdon', 'link-id', 'en', jsonApiClient)

    expect(jsonApiClient.getSingleByPath).toHaveBeenCalledWith(
      '/en/jsonapi/prison/bullingdon/node/link/uuid?fields%5Bnode--link%5D=field_show_interstitial_page%2Cfield_url',
    )

    expect(result).toEqual({ url: 'external-url', intercept: true })
  })

  it('should return null if external link lookup fails', async () => {
    jsonApiClient.getLookupByPath.mockResolvedValue(undefined)
    jsonApiClient.getSingleByPath.mockResolvedValue(singleResponse)

    const result = await getLink('bullingdon', 'link-id', 'en', jsonApiClient)

    expect(jsonApiClient.getSingleByPath).not.toHaveBeenCalled()

    expect(result).toBeNull()
  })
})
