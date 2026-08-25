import JsonApiClient, { JsonApiCollectionResponse, JsonApiSingleResponse } from '../../../data/jsonApiClient'
import {
  CmsCategoryMenuAttributes,
  CMSContentNodeAttributes,
  CmsNodeAttributes,
  CmsTagHeaderAttributes,
} from '../types'
import getTag from './getTag'

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

  it('should fetch series content', async () => {
    const seriesHeaderResponse: JsonApiSingleResponse<CmsTagHeaderAttributes> = {
      data: {
        type: 'taxonomy_term--series',
        id: 'series-header-1',
        attributes: {
          drupal_internal__tid: 10,
          name: 'series-header',
          path: { alias: 'path-alias' },
          description: { processed: 'series-header-description' },
          breadcrumbs: [],
        },
      },
    }

    const seriesItemsResponse: JsonApiCollectionResponse<CmsNodeAttributes> = {
      data: [
        {
          type: 'taxonomy_term--series',
          id: 'series-item-1',
          attributes: {
            drupal_internal__nid: 1,
            title: 'series-content',
            field_summary: 'content-summary',
            path: { alias: 'path-alias' },
          },
        },
      ],
    }
    jsonApiClient.getCollectionByPath
      .mockResolvedValueOnce(generateTagWithTaxonomyType('series'))
      .mockResolvedValueOnce(seriesItemsResponse)
    jsonApiClient.getSingleByPath.mockResolvedValueOnce(seriesHeaderResponse)

    const result = await getTag('bullingdon', '99', 'en', jsonApiClient)

    expect(result).toEqual({
      breadcrumbs: [],
      description: 'series-header-description',
      id: '99',
      isLastPage: true,
      name: 'series-header',
      seriesItems: [
        {
          contentType: 'page',
          contentUrl: 'path-alias',
          id: 'series-item-1',
          summary: 'content-summary',
          title: 'series-content',
        },
      ],
      type: 'series',
      uuid: 'uuid-1',
    })
  })

  it('should fetch topic content', async () => {
    const topicHeaderResponse: JsonApiSingleResponse<CmsTagHeaderAttributes> = {
      data: {
        type: 'taxonomy_term--topics',
        id: 'topic-header-1',
        attributes: {
          drupal_internal__tid: 10,
          name: 'topic-header',
          path: { alias: 'path-alias' },
          description: { processed: 'topic-header-description' },
          breadcrumbs: [],
        },
      },
    }

    const topicItemsResponse: JsonApiCollectionResponse<CmsNodeAttributes> = {
      data: [
        {
          type: 'taxonomy_term--topics',
          id: 'topic-item-1',
          attributes: {
            drupal_internal__nid: 1,
            title: 'topic-content',
            field_summary: 'content-summary',
            path: { alias: 'path-alias' },
          },
        },
      ],
    }

    jsonApiClient.getCollectionByPath
      .mockResolvedValueOnce(generateTagWithTaxonomyType('topics'))
      .mockResolvedValueOnce(topicItemsResponse)
    jsonApiClient.getSingleByPath.mockResolvedValueOnce(topicHeaderResponse)

    const result = await getTag('bullingdon', '99', 'en', jsonApiClient)

    expect(result).toEqual({
      breadcrumbs: [],
      description: 'topic-header-description',
      id: '99',
      isLastPage: true,
      name: 'topic-header',
      topicItems: [
        {
          contentType: 'page',
          contentUrl: 'path-alias',
          id: 'topic-item-1',
          summary: 'content-summary',
          title: 'topic-content',
        },
      ],
      type: 'topic',
      uuid: 'uuid-1',
    })
  })

  it('should fetch category content', async () => {
    const categoryDetailsResponse: JsonApiSingleResponse<CmsTagHeaderAttributes> = {
      data: {
        type: 'taxonomy_term--moj_categories',
        id: 'category-details-1',
        attributes: {
          drupal_internal__tid: 10,
          name: 'category-details',
          path: { alias: 'path-alias' },
          description: { processed: 'category-detail-description' },
          breadcrumbs: [],
        },
      },
    }

    const categoryMenuResponse: JsonApiCollectionResponse<CmsCategoryMenuAttributes> = {
      data: [
        {
          type: 'taxonomy_term--moj_categories',
          id: 'category-menu-1',
          attributes: {
            name: 'category-menu',
            path: { alias: 'path-alias' },
            drupal_internal__tid: 1,
          },
        },
      ],
    }

    const categoryContentResponse: JsonApiCollectionResponse<CMSContentNodeAttributes> = {
      data: [
        {
          type: 'node--video',
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

    jsonApiClient.getCollectionByPath
      .mockResolvedValueOnce(generateTagWithTaxonomyType('moj_categories'))
      .mockResolvedValueOnce(categoryMenuResponse)
      .mockResolvedValueOnce(categoryContentResponse)
    jsonApiClient.getSingleByPath.mockResolvedValueOnce(categoryDetailsResponse)

    const result = await getTag('bullingdon', '99', 'en', jsonApiClient)

    expect(result).toEqual({
      breadcrumbs: [],
      categoryContent: [
        {
          contentType: 'video',
          contentUrl: 'path-alias',
          displayUrl: 'display-url',
          externalContent: false,
          id: 1,
          isNew: false,
          publishedAt: 'Thursday 1 January',
          summary: 'content-summary',
          thumbnailAlt: '',
          thumbnailUrl: '',
          title: 'category-content',
        },
      ],
      categoryFeaturedContent: [],
      categoryMenu: [
        {
          contentType: 'category',
          contentUrl: '/tags/1',
          id: '1',
          title: 'category-menu',
        },
      ],
      description: 'category-detail-description',
      id: '99',
      isLastPage: true,
      name: 'category-details',
      type: 'category',
      uuid: 'uuid-1',
    })
  })

  it('should return null for unrecognised taxonomy types', async () => {
    jsonApiClient.getCollectionByPath.mockResolvedValueOnce(generateTagWithTaxonomyType('cantaloupe'))

    const result = await getTag('bullingdon', '99', 'en', jsonApiClient)

    expect(result).toBeNull()
  })

  it('should return null when tag cannot be located', async () => {
    jsonApiClient.getCollectionByPath.mockResolvedValueOnce({ data: [] })

    const result = await getTag('bullingdon', '99', 'en', jsonApiClient)

    expect(result).toBeNull()
  })
})
