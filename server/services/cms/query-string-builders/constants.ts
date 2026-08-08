export const COMMON_TILE_FIELDS = ['drupal_internal__nid', 'title', 'field_moj_thumbnail_image', 'path', 'published_at']

export const HEADER_FIELDS = ['name', 'description', 'breadcrumbs', 'field_moj_thumbnail_image']

export const MENU_FIELDS = ['drupal_internal__tid', 'name', 'path', 'field_moj_thumbnail_image']

export const CONTENT_TILE_FIELDS = [...COMMON_TILE_FIELDS, 'field_summary']

export const FILE_FIELDS = ['image_style_uri', 'uri', 'url']

export const PAGE_SIZE = 40

export const COMMON_CONTENT_FIELDS = [
  'drupal_internal__nid',
  'title',
  'created',
  'field_topics',
  'field_moj_series',
  'field_moj_top_level_categories',
  'field_exclude_feedback',
  'breadcrumbs',
]

export const HOMEPAGE_CONTENT_TILE = [
  'drupal_internal__nid',
  'title',
  'field_moj_thumbnail_image',
  'field_summary',
  'field_moj_series',
  'path',
  'type.meta.drupal_internal__target_id',
  'published_at',
]

export const HOMEPAGE_FILE_FIELDS = ['drupal_internal__fid', 'id', 'image_style_uri']
