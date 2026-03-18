export interface Topic {
  id: number
  uuid: string
  name: string
}

export interface ContentImage {
  url: string
  alt: string
}

export interface Breadcrumb {
  href: string
  text: string
}

export interface Category {
  id: number
  uuid: string
  name: string
}

interface BaseContent {
  id: number
  uuid: string
  title: string
  created: string
  description: string | null
  breadcrumbs: Breadcrumb[]
  categories: Category | null
  topics: Topic[]
  excludeFeedback: boolean
}

export interface PageContent extends BaseContent {
  contentType: 'page'
  standFirst: string | null
}

export interface AudioContent extends BaseContent {
  contentType: 'radio'
  media: string | null
  image: ContentImage | null
  programmeCode: string | null
  episodeId: number | null
  seasonId: number | null
  seriesId: number | null
  seriesName: string | null
  seriesSortValue: number | null
  nextEpisodes: EpisodeTile[]
  suggestedContent: ContentTile[]
}

export interface VideoContent extends BaseContent {
  contentType: 'video'
  media: string | null
  image: ContentImage | null
  episodeId: number | null
  seasonId: number | null
  seriesId: number | null
  seriesName: string | null
  seriesSortValue: number | null
  nextEpisodes: EpisodeTile[]
  suggestedContent: ContentTile[]
}

export interface PdfContent {
  id: number
  title: string
  contentType: 'pdf'
  url: string | null
}

export interface EpisodeTile {
  id: number
  episodeId: number | null
  title: string
  seasonId: number | null
  seriesSortValue: number | null
  image: ContentImage | null
}

export interface ContentTile {
  id: number
  contentType: string
  externalContent: boolean
  title: string
  summary: string
  contentUrl: string
  displayUrl: string
  image: ContentImage | null
  isNew: boolean
}

export type Content = PageContent | AudioContent | VideoContent | PdfContent
