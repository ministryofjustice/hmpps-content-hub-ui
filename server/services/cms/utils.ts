import { JsonApiResource, JsonApiResourceIdentifier } from '../../data/jsonApiClient'
import { CmsBreadcrumbItem, CmsFileAttributes, CmsPath, CmsRawBreadcrumb, CmsTagType } from './types'

export const resolveLink = (value: { uri?: string; url?: string } | string): string => {
  if (typeof value === 'string') return value
  return value.url || value.uri || '#'
}

export const stripLanguagePrefix = (href: string, language: string): string => {
  if (!href || href === '#') return href
  if (href.startsWith('http://') || href.startsWith('https://')) return href

  const withSlash = href.startsWith('/') ? href : `/${href}`
  const prefix = `/${language}`

  if (withSlash === prefix) return '/'
  if (withSlash.startsWith(`${prefix}/`)) return `/${withSlash.slice(prefix.length + 1)}`

  return withSlash
}

export const mapBreadcrumbHref = (rawHref: string | undefined, language: string): string | undefined => {
  if (!rawHref) return undefined

  const trimmed = rawHref.trim()
  if (!trimmed || trimmed === '#') return undefined
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed

  const withoutInternalPrefix = trimmed.replace(/^internal:/, '')
  const withLeadingSlash = withoutInternalPrefix.startsWith('/') ? withoutInternalPrefix : `/${withoutInternalPrefix}`
  return stripLanguagePrefix(withLeadingSlash, language)
}

export const mapBreadcrumbs = (raw: CmsRawBreadcrumb[] | undefined, language: string = 'en'): CmsBreadcrumbItem[] => {
  if (!raw?.length) return []

  return raw
    .map(item => {
      const text = (item.title || item.text || '').trim()
      if (!text) return null

      const sourceHref = item.uri || item.url || item.href
      const href = mapBreadcrumbHref(sourceHref, language)

      return href ? { text, href } : { text }
    })
    .filter((item): item is CmsBreadcrumbItem => Boolean(item))
}

export const resolvePath = (path?: CmsPath, fallbackId?: number): string => {
  if (path?.alias) return path.alias
  if (path?.url) return path.url
  if (fallbackId) return `/content/${fallbackId}`
  return '#'
}

export const resolveTagHref = (path?: CmsPath, fallbackId?: number): string => {
  if (fallbackId) return `/tags/${fallbackId}`
  return resolvePath(path)
}

export const relationshipDataArray = (relationship?: {
  data?: JsonApiResourceIdentifier | JsonApiResourceIdentifier[] | null
}): JsonApiResourceIdentifier[] => {
  if (!relationship?.data) return []
  return Array.isArray(relationship.data) ? relationship.data : [relationship.data]
}

export const findIncluded = <TAttributes>(
  included: JsonApiResource[],
  identifier: JsonApiResourceIdentifier,
): JsonApiResource<TAttributes> | undefined =>
  included.find(item => item.type === identifier.type && item.id === identifier.id) as
    | JsonApiResource<TAttributes>
    | undefined

export const resolveFileUrl = (file?: JsonApiResource<CmsFileAttributes>): string | undefined => {
  if (!file) return undefined
  const styles = file.attributes.image_style_uri
  if (styles) {
    if (styles.tile_small) return styles.tile_small
    if (styles.tile_large) return styles.tile_large
    const styleUrl = Object.values(styles).find(value => typeof value === 'string')
    if (styleUrl) return styleUrl
  }

  if (file.attributes.uri?.url) return file.attributes.uri.url
  if (file.attributes.url) return file.attributes.url
  if (file.attributes.uri?.value) return file.attributes.uri.value
  return undefined
}

export const mapTagType = (resourceType: string): CmsTagType | null => {
  switch (resourceType) {
    case 'taxonomy_term--topics':
      return 'topic'
    case 'taxonomy_term--series':
      return 'series'
    case 'taxonomy_term--moj_categories':
      return 'category'
    default:
      return null
  }
}
