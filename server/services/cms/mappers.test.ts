import { JsonApiResource, JsonApiSingleResponse } from '../../data/jsonApiClient'
import {
  mapCategoryDetails,
  mapCategoryFeaturedContent,
  mapCategoryMenuItem,
  mapPrimaryNavigationItem,
  mapSeriesHeader,
  mapSeriesItem,
  mapTopic,
  mapTopicHeader,
  mapTopicItem,
  mapTopicPageItem,
} from './mappers'
import {
  CmsCategoryMenuAttributes,
  CmsCategoryTermAttributes,
  CmsFileAttributes,
  CmsNodeAttributes,
  CmsPrimaryNavigationAttributes,
  CmsSeriesTermAttributes,
  CmsTopicAttributes,
  CmsTopicHeaderAttributes,
} from './types'

describe('cms mappers', () => {
  it('maps a topic into a tag link', () => {
    const item: JsonApiResource<CmsTopicAttributes> = {
      type: 'taxonomy_term--topics',
      id: 'topic-1',
      attributes: { drupal_internal__tid: 42, name: 'Education' },
    }

    expect(mapTopic(item)).toEqual({ id: '42', linkText: 'Education', href: '/tags/42' })
  })

  it('maps primary navigation with language stripping', () => {
    const item: JsonApiResource<CmsPrimaryNavigationAttributes> = {
      type: 'menu_link_content--menu_link_content',
      id: 'nav-1',
      attributes: { title: 'Topics', url: 'en/tags/42' },
    }

    expect(mapPrimaryNavigationItem(item, 'en')).toEqual({ text: 'Topics', href: '/tags/42' })
  })

  it('maps topic page items into card data', () => {
    const item: JsonApiResource<CmsNodeAttributes> = {
      type: 'node--page',
      id: 'node-1',
      attributes: {
        title: 'Learning skills',
        field_summary: 'Improve your skills',
        path: { alias: '/content/123' },
        drupal_internal__nid: 123,
      },
    }

    expect(mapTopicPageItem(item)).toEqual({
      id: 'node-1',
      title: 'Learning skills',
      summary: 'Improve your skills',
      href: '/content/123',
    })
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
      linkText: 'Series A',
      href: '/tags/10',
      thumbnailUrl: '/img/series.png',
      contentType: 'series',
    })
  })

  it('maps series and topic headers with thumbnails', () => {
    const seriesResponse: JsonApiSingleResponse<CmsSeriesTermAttributes> = {
      data: {
        type: 'taxonomy_term--series',
        id: 'series-1',
        attributes: { name: 'Series A', description: { processed: 'Series desc' } },
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

    const topicResponse: JsonApiSingleResponse<CmsTopicHeaderAttributes> = {
      data: {
        type: 'taxonomy_term--topics',
        id: 'topic-1',
        attributes: { name: 'Topic A', description: { processed: 'Topic desc' } },
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

    expect(mapSeriesHeader(seriesResponse)).toEqual({
      name: 'Series A',
      description: 'Series desc',
      thumbnailUrl: '/img/series.png',
    })
    expect(mapTopicHeader(topicResponse)).toEqual({
      name: 'Topic A',
      description: 'Topic desc',
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

    expect(mapSeriesItem(item, included)).toEqual({
      id: 'node-1',
      title: 'Content A',
      summary: 'Summary',
      href: '/content/1',
      thumbnailUrl: '/img/content.png',
    })
    expect(mapTopicItem(item, included)).toEqual({
      id: 'node-1',
      title: 'Content A',
      summary: 'Summary',
      href: '/content/1',
      thumbnailUrl: '/img/content.png',
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
      href: '/tags/10',
      thumbnailUrl: '/img/series.png',
      contentType: 'series',
    })
    expect(contentItem).toEqual({
      id: 'node-1',
      title: 'Content A',
      summary: 'Summary',
      href: '/content/1',
      thumbnailUrl: '/img/content.png',
      contentType: 'content',
    })
  })

  it('maps category details with featured content', () => {
    const response: JsonApiSingleResponse<CmsCategoryTermAttributes> = {
      data: {
        type: 'taxonomy_term--moj_categories',
        id: 'cat-1',
        attributes: { name: 'Category', description: { processed: 'Category desc' } },
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
      categoryFeaturedContent: [
        {
          id: 'node-1',
          title: 'Content A',
          summary: 'Summary',
          href: '/content/1',
          thumbnailUrl: undefined,
          contentType: 'content',
        },
      ],
    })
  })
})
