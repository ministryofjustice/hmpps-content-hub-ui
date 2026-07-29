import { JsonApiClient } from '../../../data'
import buildTagLookupQueryString from '../query-string-builders/tagLookupBuilder'
import { CmsTag, CmsTagTermAttributes, CmsTagTermItem } from '../types'
import { mapTagType } from '../utils'
import getCategoryContent from './getCategoryContent'
import getCategoryDetails from './getCategoryDetails'
import getCategoryMenu from './getCategoryMenu'
import getSeriesHeader from './getSeriesHeader'
import getSeriesItems from './getSeriesItems'
import getTopicHeader from './getTopicHeader'
import getTopicItems from './getTopicItems'

const getTag = async (
  establishmentName: string,
  tagId: string,
  language: string,
  jsonApiClient: JsonApiClient,
): Promise<CmsTag | null> => {
  const queryString = buildTagLookupQueryString(tagId)
  const path = `/${language}/jsonapi/prison/${establishmentName}/taxonomy_term?${queryString}`
  const response = await jsonApiClient.getCollectionByPath<CmsTagTermAttributes>(path)
  const match = response.data[0] as CmsTagTermItem | undefined
  if (!match) return null

  const tagType = mapTagType(match.type)
  if (!tagType) return null

  const baseTag: CmsTag = {
    id: `${match.attributes.drupal_internal__tid ?? match.id}`,
    uuid: match.id,
    type: tagType,
    name: match.attributes.name,
    description: match.attributes.description,
    breadcrumbs: [],
    isLastPage: true,
  }

  if (tagType === 'topic') {
    const [topicHeader, topicItems] = await Promise.all([
      getTopicHeader(establishmentName, match.id, language, jsonApiClient),
      getTopicItems(establishmentName, match.id, language, jsonApiClient),
    ])

    return {
      ...baseTag,
      name: topicHeader?.name ?? baseTag.name,
      description: topicHeader?.description ?? baseTag.description,
      breadcrumbs: topicHeader?.breadcrumbs ?? baseTag.breadcrumbs,
      topicHeaderImageUrl: topicHeader?.thumbnailUrl,
      topicItems: topicItems.data,
      isLastPage: topicItems.isLastPage,
    }
  }
  if (tagType === 'series') {
    const [seriesHeader, seriesItems] = await Promise.all([
      getSeriesHeader(establishmentName, match.id, language, jsonApiClient),
      getSeriesItems(establishmentName, match.id, language, jsonApiClient),
    ])

    return {
      ...baseTag,
      name: seriesHeader?.name ?? baseTag.name,
      description: seriesHeader?.description ?? baseTag.description,
      breadcrumbs: seriesHeader?.breadcrumbs ?? baseTag.breadcrumbs,
      seriesHeaderImageUrl: seriesHeader?.thumbnailUrl,
      seriesItems: seriesItems.data,
      isLastPage: seriesItems.isLastPage,
    }
  }

  const [categoryDetails, categoryMenu, categoryContent] = await Promise.all([
    getCategoryDetails(establishmentName, match.id, language, jsonApiClient),
    getCategoryMenu(establishmentName, match.id, language, jsonApiClient),
    getCategoryContent(establishmentName, match.id, language, jsonApiClient),
  ])
  return {
    ...baseTag,
    name: categoryDetails?.name ?? baseTag.name,
    description: categoryDetails?.description ?? baseTag.description,
    breadcrumbs: categoryDetails?.breadcrumbs ?? baseTag.breadcrumbs,
    categoryFeaturedContent: categoryDetails?.categoryFeaturedContent ?? [],
    categoryMenu,
    categoryContent: categoryContent.data,
    isLastPage: categoryContent.isLastPage,
  }
}

export default getTag
