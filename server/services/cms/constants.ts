const joinFields = (fields: string[]) => fields.join(',')

const COMMON_TILE_FIELDS = ['drupal_internal__nid', 'title', 'field_moj_thumbnail_image', 'path', 'published_at']

const HEADER_FIELDS = joinFields([
  'name',
  'description',
  'breadcrumbs',
  'drupal_internal__tid',
  'field_moj_thumbnail_image',
  'path',
  'published_at',
])

const MENU_FIELDS = joinFields(['drupal_internal__tid', 'name', 'path', 'field_moj_thumbnail_image'])

const CONTENT_TILE_FIELDS = [...COMMON_TILE_FIELDS, 'field_summary']

export const CATEGORY_MENU_FIELDS = MENU_FIELDS

export const CATEGORY_PAGE_FIELDS = joinFields([
  'name',
  'description',
  'field_exclude_feedback',
  'field_featured_tiles',
  'breadcrumbs',
  'child_term_count',
])

export const CATEGORY_PAGE_INCLUDE =
  'field_featured_tiles,field_featured_tiles.field_moj_thumbnail_image,field_featured_tiles.field_moj_series,field_featured_tiles.field_moj_series.field_moj_thumbnail_image'

export const CATEGORY_TILE_FIELDS = joinFields([
  ...COMMON_TILE_FIELDS,
  'drupal_internal__tid',
  'field_topics',
  'field_exclude_feedback',
])

export const FILE_FIELDS = joinFields(['image_style_uri', 'uri', 'url'])

export const PAGE_SIZE = 40

export const SERIES_HEADER_FIELDS = HEADER_FIELDS

export const SERIES_ITEMS_INCLUDE = 'field_moj_thumbnail_image,field_moj_series.field_moj_thumbnail_image'

export const SERIES_ITEMS_TILE_FIELDS = joinFields([...CONTENT_TILE_FIELDS, 'field_moj_series'])

export const SERIES_MENU_FIELDS = MENU_FIELDS

export const TAG_LOOKUP_FIELDS = joinFields(['drupal_internal__tid', 'name', 'description'])

export const TOPIC_HEADER_FIELDS = HEADER_FIELDS

export const TOPIC_ITEMS_INCLUDE = 'field_moj_thumbnail_image,field_topics.field_moj_thumbnail_image'

export const TOPIC_ITEMS_TILE_FIELDS = joinFields([...CONTENT_TILE_FIELDS, 'field_topics'])

export const TOPIC_PAGE_NODE_FIELDS = joinFields([
  'drupal_internal__nid',
  'title',
  'field_summary',
  'path',
  'published_at',
])

export const TOPIC_TERM_LOOKUP_FIELDS = joinFields(['name', 'description', 'drupal_internal__tid'])

export const TOPICS_TERM_FIELDS = joinFields(['drupal_internal__tid', 'name'])
