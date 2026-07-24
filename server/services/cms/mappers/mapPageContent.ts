import { JsonApiSingleResponse } from '../../../data/jsonApiClient'
import { CmsPageContent, CmsPageNodeAttributes } from '../types'
import { mapBreadcrumbs } from '../utils'
import mapContentCategory from './mapContentCategory'
import mapContentTopics from './mapContentTopics'

const mapPageContent = (response: JsonApiSingleResponse<CmsPageNodeAttributes>, language: string): CmsPageContent => {
  const { data } = response
  return {
    id: data.attributes.drupal_internal__nid!,
    title: data.attributes.title,
    contentType: 'page',
    breadcrumbs: mapBreadcrumbs(data.attributes.breadcrumbs, language),
    description: data.attributes.field_main_body_content?.processed ?? null,
    standFirst: data.attributes.field_moj_stand_first ?? null,
    categories: mapContentCategory(data.relationships, response.included),
    topics: mapContentTopics(data.relationships, response.included),
    excludeFeedback: data.attributes.field_exclude_feedback ?? false,
  }
}

export default mapPageContent
