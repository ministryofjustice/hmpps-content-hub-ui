export interface CmsTopicAttributes {
  drupal_internal__tid: number
  name: string
}

export interface CmsTopicItem {
  id: string
  linkText: string
  href: string
}

export interface CmsPrimaryNavigationAttributes {
  title: string
  url: string | { uri?: string; url?: string }
}

export interface CmsPrimaryNavigationItem {
  text: string
  href: string
}

export interface CmsTopicPageHeader {
  id: string
  title: string
  description?: string
}

export interface CmsTopicPageItem {
  id: string
  title?: string
  summary?: string
  href: string
}

export interface CmsTopicPage {
  topic: CmsTopicPageHeader
  items: CmsTopicPageItem[]
}

export type CmsTagType = 'topic' | 'series' | 'category'

export interface CmsTag {
  id: string
  uuid: string
  type: CmsTagType
  name?: string
  description?: string
  seriesHeaderImageUrl?: string
  seriesItems?: CmsSeriesItem[]
  topicHeaderImageUrl?: string
  topicItems?: CmsTopicContentItem[]
  categoryFeaturedContent?: CmsCategoryFeaturedItem[]
  categoryMenu?: CmsCategoryMenuItem[]
}

export interface CmsSeriesItem {
  id: string
  title?: string
  summary?: string
  href: string
  thumbnailUrl?: string
}

export interface CmsTopicContentItem {
  id: string
  title?: string
  summary?: string
  href: string
  thumbnailUrl?: string
}

export interface CmsCategoryFeaturedItem {
  id: string
  title?: string
  summary?: string
  href: string
  thumbnailUrl?: string
  contentType?: 'series' | 'category' | 'content'
}

export interface CmsCategoryMenuItem {
  id: string
  linkText: string
  href: string
  thumbnailUrl?: string
  contentType?: 'series' | 'category'
}

export type CmsPath = {
  alias?: string
  url?: string
}

export type CmsTopicTermAttributes = {
  name: string
  description?: string
  drupal_internal__tid: number
}

export type CmsTopicTermItem = {
  id: string
  attributes: CmsTopicTermAttributes
}

export type CmsTagTermAttributes = {
  name?: string
  description?: string
  drupal_internal__tid?: number
}

export type CmsTagTermItem = {
  type: string
  id: string
  attributes: CmsTagTermAttributes
}

export type CmsNodeAttributes = {
  title: string
  field_summary?: string
  path?: CmsPath
  drupal_internal__nid?: number
}

export type CmsTaxonomyAttributes = {
  name?: string
  path?: CmsPath
  drupal_internal__tid?: number
}

export type CmsFileAttributes = {
  image_style_uri?: Record<string, string>
  uri?: { url?: string; value?: string }
  url?: string
}

export type CmsCategoryTermAttributes = {
  name?: string
  description?: { processed?: string }
  path?: CmsPath
  drupal_internal__tid?: number
}

export type CmsSeriesTermAttributes = {
  name?: string
  description?: { processed?: string }
  path?: CmsPath
  drupal_internal__tid?: number
}

export type CmsTopicHeaderAttributes = {
  name?: string
  description?: { processed?: string }
  path?: CmsPath
  drupal_internal__tid?: number
}

export type CmsCategoryMenuAttributes = {
  name?: string
  path?: CmsPath
  drupal_internal__tid?: number
}
