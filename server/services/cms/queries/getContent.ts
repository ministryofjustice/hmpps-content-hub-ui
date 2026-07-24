import { ContentTile, EpisodeTile } from '../../../@types/content'
import { JsonApiClient } from '../../../data'
import mapAudioContent from '../mappers/mapAudioContent'
import mapPageContent from '../mappers/mapPageContent'
import mapPdfContent from '../mappers/mapPdfContent'
import mapVideoContent from '../mappers/mapVideoContent'
import buildAudioContentQueryString from '../query-string-builders/audioContentBuilder'
import buildContentLookupQueryString from '../query-string-builders/contentLookupBuilder'
import buildPageContentQueryString from '../query-string-builders/pageContentBuilder'
import buildPdfContentQueryString from '../query-string-builders/pdfContentBuilder'
import buildVideoContentQueryString from '../query-string-builders/videoContentBuilder'
import {
  CmsAudioNodeAttributes,
  CmsContent,
  CmsMediaContent,
  CmsNodeAttributes,
  CmsPageNodeAttributes,
  CmsPdfNodeAttributes,
  CmsVideoNodeAttributes,
} from '../types'
import getNextEpisodes from './getNextEpisodes'
import getSuggestions from './getSuggestions'

const enrichMediaContent = async (
  establishmentName: string,
  content: CmsMediaContent,
  language: string,
  jsonApiClient: JsonApiClient,
): Promise<CmsMediaContent & { nextEpisodes: EpisodeTile[]; suggestedContent: ContentTile[] }> => {
  const [nextEpisodes, suggestedContent] = await Promise.all([
    getNextEpisodes(
      establishmentName,
      content.seriesId,
      content.seriesSortValue,
      content.created,
      language,
      jsonApiClient,
    ),
    getSuggestions(establishmentName, content.uuid, language, jsonApiClient),
  ])

  return { ...content, nextEpisodes, suggestedContent }
}

const getContent = async (
  establishmentName: string,
  contentId: number,
  language: string,
  jsonApiClient: JsonApiClient,
): Promise<CmsContent | null> => {
  const lookupQs = buildContentLookupQueryString(`${contentId}`)
  const lookupPath = `/${language}/jsonapi/prison/${establishmentName}/node?${lookupQs}`
  const lookupResponse = await jsonApiClient.getCollectionByPath<CmsNodeAttributes>(lookupPath)
  const match = lookupResponse.data[0]
  if (!match) return null

  const { id: uuid } = match

  switch (match.type) {
    case 'node--page': {
      const qs = buildPageContentQueryString()
      const path = `/${language}/jsonapi/prison/${establishmentName}/node/page/${uuid}?${qs}`
      const response = await jsonApiClient.getSingleByPath<CmsPageNodeAttributes>(path)
      return mapPageContent(response, language)
    }
    case 'node--moj_video_item': {
      const qs = buildVideoContentQueryString()
      const path = `/${language}/jsonapi/prison/${establishmentName}/node/moj_video_item/${uuid}?${qs}`
      const response = await jsonApiClient.getSingleByPath<CmsVideoNodeAttributes>(path)
      const content = mapVideoContent(response, language)
      return enrichMediaContent(establishmentName, content, language, jsonApiClient)
    }
    case 'node--moj_radio_item': {
      const qs = buildAudioContentQueryString()
      const path = `/${language}/jsonapi/prison/${establishmentName}/node/moj_radio_item/${uuid}?${qs}`
      const response = await jsonApiClient.getSingleByPath<CmsAudioNodeAttributes>(path)
      const content = mapAudioContent(response, language)
      return enrichMediaContent(establishmentName, content, language, jsonApiClient)
    }
    case 'node--moj_pdf_item': {
      const qs = buildPdfContentQueryString()
      const path = `/${language}/jsonapi/prison/${establishmentName}/node/moj_pdf_item/${uuid}?${qs}`
      const response = await jsonApiClient.getSingleByPath<CmsPdfNodeAttributes>(path)
      return mapPdfContent(response)
    }
    default:
      return null
  }
}

export default getContent
