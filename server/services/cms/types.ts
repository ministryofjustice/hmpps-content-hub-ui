import type { ContentTile } from '../../@types/content'
import { JsonApiRelationships, JsonApiResourceIdentifier } from '../../data/jsonApiClient'

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

export type MediaContent = 'video' | 'radio' | 'page' | 'link'

export type CategoryContent = 'series' | 'category' | 'content'

export type CategoryMenuContent = 'series' | 'category'

export interface CmsTag {
  id: string
  uuid: string
  type: CmsTagType
  name?: string
  description?: string
  breadcrumbs?: CmsBreadcrumbItem[]
  seriesHeaderImageUrl?: string
  seriesItems?: CmsTagItem<MediaContent>[]
  topicHeaderImageUrl?: string
  topicItems?: CmsTagItem<MediaContent>[]
  categoryFeaturedContent?: CmsTagItem<CategoryContent>[]
  categoryMenu?: CmsTagItem<CategoryMenuContent>[]
  categoryContent?: ContentTile[]
  isLastPage: boolean
}

export interface CmsTagItem<ContentType> {
  id: string
  title?: string
  summary?: string
  contentUrl: string
  thumbnailUrl?: string
  contentType?: ContentType
}

export interface CmsPaginatedContent<ContentType> {
  data: ContentType[]
  isLastPage: boolean
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

export type ImageSize = 'small' | 'large'

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

export type CMSContentNodeAttributes = {
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

export type CmsUrgentBannerAttributes = {
  drupal_internal__nid: number
  title: string
  created: string
  changed: string
  unpublish_on: string | null
}

export interface CmsUrgentBanner {
  title: string
  moreInfoLink: string | null
  unpublishOn: number | null
}

export interface CmsHomePageRelationships extends JsonApiRelationships {
  field_featured_tiles: { data: JsonApiResourceIdentifier[] }
  field_key_info_tiles: { data: JsonApiResourceIdentifier[] }
  field_large_update_tile: { data: JsonApiResourceIdentifier }
}

export interface HomePageContent {
  featuredContent: { data: ContentTile[] }
  keyInfo: { data: ContentTile[] }
  largeUpdateTile?: ContentTile
}

export type RecentlyAddedContent = CmsPaginatedContent<ContentTile>

export type ExploreContent = CmsPaginatedContent<ContentTile>

export interface UpdatesContent {
  largeUpdateTileDefault: ContentTile
  updatesContent: ContentTile[]
  isLastPage: boolean
}

export interface CmsLinkAttributes {
  field_show_interstitial_page: boolean
  field_url: string
}

export interface CmsLink {
  url: string
  intercept: boolean
}

export type LookupType = 'content' | 'tags' | 'link'

export interface CmsSearchResultAttributes {
  title: string
  drupal_internal__nid: number
  field_summary?: string
  path?: { alias: string }
}

export interface CmsSearchResult {
  title: string
  summary: string
  url: string
}
