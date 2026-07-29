import { CategoryMenuContent, CmsTagItem } from '../types'
import mapCategoryMenuItem from './mapCategoryMenuItem'

describe('map category menu item', () => {
  const item = {
    type: 'taxonomy_term--series',
    id: 'node-1',
    attributes: {
      drupal_internal__tid: 1,
      name: 'category-menu-item',
      path: { alias: 'path-alias', url: 'path-url' },
    },
    relationships: {
      field_moj_thumbnail_image: { data: { type: 'file--file', id: 'thumbnail' } },
    },
  }

  const included = [
    {
      type: 'file--file',
      id: 'thumbnail',
      attributes: {
        image_style_uri: {
          tile_small: 'small-image',
        },
      },
    },
  ]

  it('maps a category menu item', () => {
    const expectedResult: CmsTagItem<CategoryMenuContent> = {
      id: '1',
      contentUrl: '/tags/1',
      contentType: 'series',
      title: 'category-menu-item',
      thumbnailUrl: 'small-image',
    }

    expect(mapCategoryMenuItem(item, included)).toEqual(expectedResult)
  })

  it('falls back to expected values when attributes not present', () => {
    const itemMissingAttributes = {
      type: 'not-a-series',
      id: 'item-id',
      attributes: {
        path: { alias: 'path-alias', url: 'path-url' },
      },
      relationships: {
        field_moj_thumbnail_image: { data: { type: 'file--file', id: 'thumbnail-2' } },
      },
    }

    const expectedResult: CmsTagItem<CategoryMenuContent> = {
      id: 'item-id',
      contentUrl: 'path-alias',
      contentType: 'category',
      title: 'Untitled',
      thumbnailUrl: undefined,
    }

    expect(mapCategoryMenuItem(itemMissingAttributes, included)).toEqual(expectedResult)
  })

  it('maps thumbnail image to undefined if included not present', () => {
    const expectedResult: CmsTagItem<CategoryMenuContent> = {
      id: '1',
      contentUrl: '/tags/1',
      contentType: 'series',
      title: 'category-menu-item',
      thumbnailUrl: undefined,
    }

    expect(mapCategoryMenuItem(item, undefined)).toEqual(expectedResult)
  })
})
