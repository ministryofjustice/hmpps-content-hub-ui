import JsonApiClient, { JsonApiCollectionResponse } from '../../../data/jsonApiClient'
import { CmsNodeAttributes } from '../types'
import getTagPage from './getTagPage'

jest.mock('../../../data/jsonApiClient')

describe('getTagPage', () => {
  const jsonApiClient = new JsonApiClient(null, null) as jest.Mocked<JsonApiClient>

  afterEach(() => {
    jest.resetAllMocks()
  })

  const generateTagWithTaxonomyType = (type: string) => {
    return {
      data: [
        {
          type: `taxonomy_term--${type}`,
          id: 'uuid-1',
          attributes: {
            name: 'Induction',
            drupal_internal__tid: 99,
            description: 'Series description',
          },
        },
      ],
    }
  }

  const contentResponse: JsonApiCollectionResponse<CmsNodeAttributes> = {
    data: [
      {
        type: 'taxonomy_term--series',
        id: 'series-id',
        attributes: {
          title: 'series-title',
          drupal_internal__nid: 99,
          field_summary: 'series-summary',
        },
        relationships: {
          field_moj_thumbnail_image: { data: { type: 'file--file', id: 'thumbnail-1' } },
        },
      },
    ],
    included: [
      {
        id: 'thumbnail-1',
        type: 'file--file',
        attributes: {
          image_style_uri: {
            tile_large: 'series-large-image',
            tile_small: 'series-small-image',
          },
        },
      },
    ],
    links: { next: 'Indicates we are not the last page' },
  }

  it('should resolve additional page request for series content', async () => {
    jsonApiClient.getCollectionByPath
      .mockResolvedValueOnce(generateTagWithTaxonomyType('series'))
      .mockResolvedValueOnce(contentResponse)

    const result = await getTagPage('bullingdon', '99', 'en', 2, jsonApiClient)

    expect(result).toEqual({
      data: [
        {
          contentType: 'page',
          contentUrl: '/content/99',
          id: 'series-id',
          summary: 'series-summary',
          thumbnailUrl: 'series-small-image',
          title: 'series-title',
        },
      ],
      isLastPage: false,
    })
  })

  it('should resolve additional page request for topic content', async () => {
    jsonApiClient.getCollectionByPath
      .mockResolvedValueOnce(generateTagWithTaxonomyType('topics'))
      .mockResolvedValueOnce(contentResponse)

    const result = await getTagPage('bullingdon', '99', 'en', 2, jsonApiClient)

    expect(result).toEqual({
      data: [
        {
          contentType: 'page',
          contentUrl: '/content/99',
          id: 'series-id',
          summary: 'series-summary',
          thumbnailUrl: 'series-small-image',
          title: 'series-title',
        },
      ],
      isLastPage: false,
    })
  })

  it('should resolve additional page request for category content', async () => {
    jsonApiClient.getCollectionByPath
      .mockResolvedValueOnce(generateTagWithTaxonomyType('moj_categories'))
      .mockResolvedValueOnce(contentResponse)

    const result = await getTagPage('bullingdon', '99', 'en', 2, jsonApiClient)

    expect(result).toEqual({
      data: [
        {
          contentType: 'series',
          contentUrl: '/content/99',
          displayUrl: '',
          externalContent: false,
          id: 99,
          isNew: false,
          publishedAt: undefined,
          summary: 'series-summary',
          thumbnailAlt: '',
          thumbnailUrl: 'series-small-image',
          title: 'series-title',
        },
      ],
      isLastPage: false,
    })
  })

  it('should return null for unrecognised taxonomy types', async () => {
    jsonApiClient.getCollectionByPath
      .mockResolvedValueOnce(generateTagWithTaxonomyType('banana'))
      .mockResolvedValueOnce(contentResponse)

    const result = await getTagPage('bullingdon', '99', 'en', 2, jsonApiClient)

    expect(result).toBeNull()
  })

  it('should return null when tag cannot be located', async () => {
    jsonApiClient.getCollectionByPath.mockResolvedValueOnce({ data: [] }).mockResolvedValueOnce(contentResponse)

    const result = await getTagPage('bullingdon', '99', 'en', 2, jsonApiClient)

    expect(result).toBeNull()
  })
})
