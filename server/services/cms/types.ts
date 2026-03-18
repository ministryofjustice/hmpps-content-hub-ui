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

export interface CmsRawBreadcrumb {
  title?: string
  text?: string
  uri?: string
  url?: string
  href?: string
}

export interface CmsBreadcrumbItem {
  text: string
  href?: string
}

export type CmsTagType = 'topic' | 'series' | 'category'

export interface CmsTag {
  id: string
  uuid: string
  type: CmsTagType
  name?: string
  description?: string
  breadcrumbs?: CmsBreadcrumbItem[]
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
  contentType?: 'video' | 'radio' | 'page' | 'link'
}

export interface CmsTopicContentItem {
  id: string
  title?: string
  summary?: string
  href: string
  thumbnailUrl?: string
  contentType?: 'video' | 'radio' | 'page' | 'link'
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
  breadcrumbs?: CmsRawBreadcrumb[]
  path?: CmsPath
  drupal_internal__tid?: number
}

export type CmsSeriesTermAttributes = {
  name?: string
  description?: { processed?: string }
  breadcrumbs?: CmsRawBreadcrumb[]
  path?: CmsPath
  drupal_internal__tid?: number
}

export type CmsTopicHeaderAttributes = {
  name?: string
  description?: { processed?: string }
  breadcrumbs?: CmsRawBreadcrumb[]
  path?: CmsPath
  drupal_internal__tid?: number
}

export type CmsCategoryMenuAttributes = {
  name?: string
  path?: CmsPath
  drupal_internal__tid?: number
}

export type CmsPageNodeAttributes = {
  drupal_internal__nid?: number
  title: string
  created?: string
  field_main_body_content?: { processed?: string }
  field_moj_stand_first?: string
  field_exclude_feedback?: boolean
  breadcrumbs?: CmsRawBreadcrumb[]
}

export type CmsVideoNodeAttributes = {
  drupal_internal__nid?: number
  title: string
  created?: string
  field_description?: { processed?: string }
  field_moj_season?: number
  field_moj_episode?: number
  series_sort_value?: number
  field_exclude_feedback?: boolean
  breadcrumbs?: CmsRawBreadcrumb[]
}

export type CmsAudioNodeAttributes = {
  drupal_internal__nid?: number
  title: string
  created?: string
  field_description?: { processed?: string }
  field_moj_programme_code?: string
  field_moj_season?: number
  field_moj_episode?: number
  series_sort_value?: number
  field_exclude_feedback?: boolean
  breadcrumbs?: CmsRawBreadcrumb[]
}

export type CmsEpisodeTileNodeAttributes = {
  drupal_internal__nid?: number
  title: string
  field_moj_season?: number
  field_moj_episode?: number
  series_sort_value?: number
}

export type CmsSuggestionNodeAttributes = {
  drupal_internal__nid?: number
  drupal_internal__tid?: number
  title?: string
  name?: string
  field_summary?: string
  path?: CmsPath
  published_at?: string
  field_display_url?: string
}

export type CmsContentType = 'page' | 'video' | 'radio'

export interface CmsContentBase {
  id: number
  title: string
  contentType: CmsContentType
  breadcrumbs: CmsBreadcrumbItem[]
  categories: { id: number; name: string } | null
  topics: { id: number; name: string }[]
  excludeFeedback: boolean
}

export interface CmsPageContent extends CmsContentBase {
  contentType: 'page'
  description: string | null
  standFirst: string | null
}

export interface CmsVideoContent extends CmsContentBase {
  contentType: 'video'
  uuid: string
  created: string | null
  description: string | null
  media: string | null
  image: string | null
  episodeId: number | null
  seasonId: number | null
  seriesId: number | null
  seriesPath: string | null
  seriesName: string | null
  seriesSortValue: number | null
}

export interface CmsAudioContent extends CmsContentBase {
  contentType: 'radio'
  uuid: string
  created: string | null
  description: string | null
  media: string | null
  image: string | null
  programmeCode: string | null
  episodeId: number | null
  seasonId: number | null
  seriesId: number | null
  seriesPath: string | null
  seriesName: string | null
  seriesSortValue: number | null
}

export type CmsContent = CmsPageContent | CmsVideoContent | CmsAudioContent

export type CmsMediaContent = CmsVideoContent | CmsAudioContent
