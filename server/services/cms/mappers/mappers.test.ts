import { JsonApiResource, JsonApiSingleResponse } from '../../../data/jsonApiClient'
import {
  CmsPrimaryNavigationAttributes,
  CmsCategoryMenuAttributes,
  CmsFileAttributes,
  CmsTagHeaderAttributes,
  CmsNodeAttributes,
} from '../types'
import mapCategoryDetails, { mapCategoryFeaturedContent } from './mapCategoryDetails'
import mapCategoryMenuItem from './mapCategoryMenuItem'
import mapContentItem from './mapContentItem'
import mapPrimaryNavigationItem from './mapPrimaryNavigationItem'
import mapSearchResponse from './mapSearchResponse'
import mapTagPageHeader from './mapTagPageHeader'

describe('cms mappers', () => {
  it('maps primary navigation with language stripping', () => {
    const item: JsonApiResource<CmsPrimaryNavigationAttributes> = {
      type: 'menu_link_content--menu_link_content',
      id: 'nav-1',
      attributes: { title: 'Topics', url: 'en/tags/42' },
    }

    expect(mapPrimaryNavigationItem(item, 'en')).toEqual({ text: 'Topics', href: '/tags/42' })
  })

  it('maps category menu items with thumbnails', () => {
    const item: JsonApiResource<CmsCategoryMenuAttributes> = {
      type: 'taxonomy_term--series',
      id: 'series-1',
      attributes: { name: 'Series A', path: { alias: '/tags/10' }, drupal_internal__tid: 10 },
      relationships: {
        field_moj_thumbnail_image: { data: { type: 'file--file', id: 'file-series' } },
      },
    }
    const included: JsonApiResource<CmsFileAttributes>[] = [
      {
        type: 'file--file',
        id: 'file-series',
        attributes: { image_style_uri: { tile_small: '/img/series.png' } },
      },
    ]

    expect(mapCategoryMenuItem(item, included)).toEqual({
      id: '10',
      title: 'Series A',
      contentUrl: '/tags/10',
      thumbnailUrl: '/img/series.png',
      contentType: 'series',
    })
  })

  it('maps series and topic headers with thumbnails', () => {
    const seriesResponse: JsonApiSingleResponse<CmsTagHeaderAttributes> = {
      data: {
        type: 'taxonomy_term--series',
        id: 'series-1',
        attributes: {
          name: 'Series A',
          description: { processed: 'Series desc' },
          breadcrumbs: [
            { title: 'Home', uri: '/' },
            { title: 'Series', uri: '/taxonomy/term/77' },
          ],
        },
        relationships: {
          field_moj_thumbnail_image: { data: { type: 'file--file', id: 'file-series' } },
        },
      },
      included: [
        {
          type: 'file--file',
          id: 'file-series',
          attributes: { image_style_uri: { tile_small: '/img/series.png' } },
        },
      ],
    }

    const topicResponse: JsonApiSingleResponse<CmsTagHeaderAttributes> = {
      data: {
        type: 'taxonomy_term--topics',
        id: 'topic-1',
        attributes: {
          name: 'Topic A',
          description: { processed: 'Topic desc' },
          breadcrumbs: [{ title: 'Home', uri: '/' }, { title: 'Current topic' }],
        },
        relationships: {
          field_moj_thumbnail_image: { data: { type: 'file--file', id: 'file-topic' } },
        },
      },
      included: [
        {
          type: 'file--file',
          id: 'file-topic',
          attributes: { image_style_uri: { tile_small: '/img/topic.png' } },
        },
      ],
    }

    expect(mapTagPageHeader(seriesResponse)).toEqual({
      name: 'Series A',
      description: 'Series desc',
      breadcrumbs: [
        { text: 'Home', href: '/' },
        { text: 'Series', href: '/taxonomy/term/77' },
      ],
      thumbnailUrl: '/img/series.png',
    })
    expect(mapTagPageHeader(topicResponse)).toEqual({
      name: 'Topic A',
      description: 'Topic desc',
      breadcrumbs: [{ text: 'Home', href: '/' }, { text: 'Current topic' }],
      thumbnailUrl: '/img/topic.png',
    })
  })

  it('maps series and topic items with thumbnails', () => {
    const item: JsonApiResource<CmsNodeAttributes> = {
      type: 'node--page',
      id: 'node-1',
      attributes: {
        title: 'Content A',
        field_summary: 'Summary',
        path: { alias: '/content/1' },
        drupal_internal__nid: 1,
      },
      relationships: {
        field_moj_thumbnail_image: { data: { type: 'file--file', id: 'file-content' } },
      },
    }
    const included: JsonApiResource<CmsFileAttributes>[] = [
      {
        type: 'file--file',
        id: 'file-content',
        attributes: { image_style_uri: { tile_small: '/img/content.png' } },
      },
    ]

    expect(mapContentItem(item, included)).toEqual({
      id: 'node-1',
      title: 'Content A',
      summary: 'Summary',
      contentUrl: '/content/1',
      thumbnailUrl: '/img/content.png',
      contentType: 'page',
    })
    expect(mapContentItem(item, included)).toEqual({
      id: 'node-1',
      title: 'Content A',
      summary: 'Summary',
      contentUrl: '/content/1',
      thumbnailUrl: '/img/content.png',
      contentType: 'page',
    })
  })

  it('omits content tags for link items', () => {
    const item: JsonApiResource<CmsNodeAttributes> = {
      type: 'node--page',
      id: 'node-2',
      attributes: {
        title: 'External link',
        field_summary: 'Summary',
        path: { alias: '/link/123' },
        drupal_internal__nid: 2,
      },
    }

    expect(mapContentItem(item, undefined)).toEqual({
      id: 'node-2',
      title: 'External link',
      summary: 'Summary',
      contentUrl: '/link/123',
      thumbnailUrl: undefined,
      contentType: 'link',
    })
  })

  it('maps category featured content items', () => {
    const relationships = {
      field_featured_tiles: {
        data: [
          { type: 'taxonomy_term--series', id: 'series-1' },
          { type: 'node--page', id: 'node-1' },
        ],
      },
    }

    const included: JsonApiResource[] = [
      {
        type: 'taxonomy_term--series',
        id: 'series-1',
        attributes: { name: 'Series A', path: { alias: '/tags/10' }, drupal_internal__tid: 10 },
        relationships: {
          field_moj_thumbnail_image: { data: { type: 'file--file', id: 'file-series' } },
        },
      },
      {
        type: 'node--page',
        id: 'node-1',
        attributes: {
          title: 'Content A',
          field_summary: 'Summary',
          path: { alias: '/content/1' },
          drupal_internal__nid: 1,
        },
        relationships: {
          field_moj_thumbnail_image: { data: { type: 'file--file', id: 'file-content' } },
        },
      },
      {
        type: 'file--file',
        id: 'file-series',
        attributes: { image_style_uri: { tile_small: '/img/series.png' } },
      },
      {
        type: 'file--file',
        id: 'file-content',
        attributes: { image_style_uri: { tile_small: '/img/content.png' } },
      },
    ]

    const result = mapCategoryFeaturedContent(relationships, included)

    expect(result).toHaveLength(2)

    const seriesItem = result.find(item => item.contentType === 'series')
    const contentItem = result.find(item => item.contentType === 'content')

    expect(seriesItem).toEqual({
      id: 'series-1',
      title: 'Series A',
      summary: undefined,
      contentUrl: '/tags/10',
      thumbnailUrl: '/img/series.png',
      contentType: 'series',
    })
    expect(contentItem).toEqual({
      id: 'node-1',
      title: 'Content A',
      summary: 'Summary',
      contentUrl: '/content/1',
      thumbnailUrl: '/img/content.png',
      contentType: 'content',
    })
  })

  it('maps category details with featured content', () => {
    const response: JsonApiSingleResponse<CmsTagHeaderAttributes> = {
      data: {
        type: 'taxonomy_term--moj_categories',
        id: 'cat-1',
        attributes: {
          name: 'Category',
          description: { processed: 'Category desc' },
          breadcrumbs: [
            { title: 'Home', uri: '/' },
            { title: 'Category parent', uri: '/taxonomy/term/200' },
            { title: 'Category' },
          ],
        },
        relationships: {
          field_featured_tiles: {
            data: [{ type: 'node--page', id: 'node-1' }],
          },
        },
      },
      included: [
        {
          type: 'node--page',
          id: 'node-1',
          attributes: {
            title: 'Content A',
            field_summary: 'Summary',
            path: { alias: '/content/1' },
            drupal_internal__nid: 1,
          },
        },
      ],
    }

    expect(mapCategoryDetails(response)).toEqual({
      name: 'Category',
      description: 'Category desc',
      breadcrumbs: [
        { text: 'Home', href: '/' },
        { text: 'Category parent', href: '/taxonomy/term/200' },
        { text: 'Category' },
      ],
      categoryFeaturedContent: [
        {
          id: 'node-1',
          title: 'Content A',
          summary: 'Summary',
          contentUrl: '/content/1',
          thumbnailUrl: undefined,
          contentType: 'content',
        },
      ],
    })
  })

  it('Maps search responses', () => {
    const response = {
      data: [
        {
          type: 'search-result',
          id: 'sr-1',
          attributes: {
            title: 'search-response-1',
            drupal_internal__nid: 1,
            field_summary: 'field-summary-1',
            path: {
              alias: '/any-path',
            },
          },
        },
        {
          type: 'search-result',
          id: 'sr-2',
          attributes: {
            title: 'search-response-2',
            drupal_internal__nid: 2,
          },
        },
      ],
    }

    const mappedResponse = mapSearchResponse(response)

    expect(mappedResponse).toHaveLength(2)

    expect(mappedResponse[0].title).toBe('search-response-1')
    expect(mappedResponse[0].summary).toBe('field-summary-1')
    expect(mappedResponse[0].url).toBe('/any-path')

    expect(mappedResponse[1].title).toBe('search-response-2')
    expect(mappedResponse[1].summary).toBe('No summary available')
    expect(mappedResponse[1].url).toBe('/content/2')
  })
})
