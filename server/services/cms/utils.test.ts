import { JsonApiResource } from '../../data/jsonApiClient'
import {
  findIncluded,
  mapTagType,
  relationshipDataArray,
  resolveFileUrl,
  resolveLink,
  resolvePath,
  resolveTagHref,
  stripLanguagePrefix,
} from './utils'
import { CmsFileAttributes } from './types'

describe('cms utils', () => {
  it('resolves links from strings and objects', () => {
    expect(resolveLink('/path')).toBe('/path')
    expect(resolveLink({ url: '/from-url' })).toBe('/from-url')
    expect(resolveLink({ uri: '/from-uri' })).toBe('/from-uri')
  })

  it('strips language prefixes for internal links', () => {
    expect(stripLanguagePrefix('en/tags/42', 'en')).toBe('/tags/42')
    expect(stripLanguagePrefix('/en', 'en')).toBe('/')
    expect(stripLanguagePrefix('https://example.com', 'en')).toBe('https://example.com')
  })

  it('resolves paths with sensible fallbacks', () => {
    expect(resolvePath({ alias: '/alias' }, 10)).toBe('/alias')
    expect(resolvePath({ url: '/url' }, 10)).toBe('/url')
    expect(resolvePath(undefined, 10)).toBe('/content/10')
    expect(resolvePath()).toBe('#')
  })

  it('resolves tag hrefs with fallback ids', () => {
    expect(resolveTagHref({ alias: '/alias' }, 10)).toBe('/tags/10')
    expect(resolveTagHref({ alias: '/alias' })).toBe('/alias')
  })

  it('normalizes relationship data into arrays', () => {
    expect(relationshipDataArray()).toEqual([])
    expect(relationshipDataArray({ data: { type: 'node--page', id: '1' } })).toEqual([{ type: 'node--page', id: '1' }])
    expect(relationshipDataArray({ data: [{ type: 'node--page', id: '1' }] })).toEqual([
      { type: 'node--page', id: '1' },
    ])
  })

  it('finds included resources by type and id', () => {
    const included: JsonApiResource[] = [{ type: 'file--file', id: 'file-1', attributes: { url: '/file' } }]

    expect(findIncluded(included, { type: 'file--file', id: 'file-1' })?.id).toBe('file-1')
    expect(findIncluded(included, { type: 'file--file', id: 'missing' })).toBeUndefined()
  })

  it('resolves file urls with style and uri fallbacks', () => {
    const fileWithStyles: JsonApiResource<CmsFileAttributes> = {
      type: 'file--file',
      id: 'file-1',
      attributes: {
        image_style_uri: { tile_small: '/small' },
      },
    }
    const fileWithUri: JsonApiResource<CmsFileAttributes> = {
      type: 'file--file',
      id: 'file-2',
      attributes: {
        uri: { url: '/uri-url' },
      },
    }

    expect(resolveFileUrl(fileWithStyles)).toBe('/small')
    expect(resolveFileUrl(fileWithUri)).toBe('/uri-url')
    expect(resolveFileUrl(undefined)).toBeUndefined()
  })

  it('maps tag types from resource types', () => {
    expect(mapTagType('taxonomy_term--topics')).toBe('topic')
    expect(mapTagType('taxonomy_term--series')).toBe('series')
    expect(mapTagType('taxonomy_term--moj_categories')).toBe('category')
    expect(mapTagType('unknown')).toBeNull()
  })
})
