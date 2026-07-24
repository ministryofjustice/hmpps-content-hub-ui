import { JsonApiResource } from '../../../data/jsonApiClient'
import { CmsNodeAttributes, CmsTagItem, MediaContent, CmsFileAttributes } from '../types'
import { relationshipDataArray, findIncluded, resolvePath, resolveFileUrl } from '../utils'

const mapContentItem = (
  item: JsonApiResource<CmsNodeAttributes>,
  included: JsonApiResource[] | undefined,
): CmsTagItem<MediaContent> => {
  const thumbnailIdentifier = relationshipDataArray(item.relationships?.field_moj_thumbnail_image)[0]
  const thumbnail =
    thumbnailIdentifier && included ? findIncluded<CmsFileAttributes>(included, thumbnailIdentifier) : undefined
  const contentUrl = resolvePath(item.attributes.path, item.attributes.drupal_internal__nid)

  const contentTypeByNodeType: Record<string, 'video' | 'radio'> = {
    'node--moj_video_item': 'video',
    'node--moj_radio_item': 'radio',
  }
  const contentType: 'video' | 'radio' | 'page' | 'link' =
    contentTypeByNodeType[item.type] ?? (contentUrl.startsWith('/link/') ? 'link' : 'page')

  return {
    id: item.id,
    title: item.attributes.title,
    summary: item.attributes.field_summary,
    contentUrl,
    thumbnailUrl: resolveFileUrl(thumbnail),
    contentType,
  }
}

export default mapContentItem
