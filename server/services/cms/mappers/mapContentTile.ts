import { ContentTile } from '../../../@types/content'
import { JsonApiResource } from '../../../data/jsonApiClient'
import { CMSContentNodeAttributes, CmsFileAttributes, ImageSize } from '../types'
import { findIncluded, relationshipDataArray, resolveFileUrl, resolvePath } from '../utils'

const mapNodeTypeToContentType = (type: string): string => {
  const match = type.match(/(?<=--)(.*)/)?.[0] ?? ''
  if (match === 'moj_radio_item') return 'radio'
  if (match === 'moj_video_item') return 'video'
  return match
}

const EXTERNAL_CONTENT_TYPES = new Set(['moj_pdf_item', 'link'])

const mapContentTile = (
  item: JsonApiResource<CMSContentNodeAttributes>,
  included: JsonApiResource[] | undefined,
  size?: ImageSize,
): ContentTile => {
  const thumbnailIdentifier = relationshipDataArray(item.relationships?.field_moj_thumbnail_image)[0]
  const thumbnail =
    thumbnailIdentifier && included ? findIncluded<CmsFileAttributes>(included, thumbnailIdentifier) : undefined
  const contentType = mapNodeTypeToContentType(item.type)
  const publishedAt = item.attributes.published_at

  return {
    id: (item.attributes.drupal_internal__nid ?? item.attributes.drupal_internal__tid)!,
    contentType,
    externalContent: EXTERNAL_CONTENT_TYPES.has(contentType),
    title: (item.attributes.title ?? item.attributes.name)!,
    summary: item.attributes.field_summary ?? '',
    contentUrl: resolvePath(item.attributes.path, item.attributes.drupal_internal__nid),
    displayUrl: item.attributes.field_display_url ?? '',
    thumbnailUrl: resolveFileUrl(thumbnail, size) ?? '',
    thumbnailAlt: '',
    isNew: publishedAt ? (Date.now() - new Date(publishedAt).getTime()) / 86_400_000 <= 2 : false,
    publishedAt: publishedAt
      ? Intl.DateTimeFormat('en-GB', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
        }).format(new Date(publishedAt))
      : undefined,
  }
}

export default mapContentTile
