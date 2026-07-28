import { JsonApiSingleResponse } from '../../../data/jsonApiClient'
import { CmsPageContent, CmsPageNodeAttributes } from '../types'
import mapPageContent from './mapPageContent'

describe('map video content', () => {
  const response: JsonApiSingleResponse<CmsPageNodeAttributes> = {
    data: {
      type: 'taxonomy_term--series',
      id: 'video-1',
      attributes: {
        drupal_internal__nid: 1,
        title: 'video-content',
        created: 'created-date',
        field_exclude_feedback: true,
        field_moj_stand_first: 'stand-first',
        field_main_body_content: { processed: 'processed-main-body-content' },
        breadcrumbs: [
          { title: 'Home', uri: '/' },
          { title: 'Series', uri: '/taxonomy/term/77' },
        ],
      },
      relationships: {
        field_moj_top_level_categories: { data: { type: 'file--file', id: 'top-level-categories' } },
        field_topics: { data: { type: 'file--file', id: 'topics' } },
      },
    },
    included: [
      {
        type: 'file--file',
        id: 'top-level-categories',
        attributes: { drupal_internal__tid: 10, name: 'top-level-category' },
      },
      {
        type: 'file--file',
        id: 'topics',
        attributes: { drupal_internal__tid: 30, name: 'topic-name' },
      },
    ],
  }

  const minimalResponse: JsonApiSingleResponse<CmsPageNodeAttributes> = {
    data: {
      type: 'taxonomy_term--series',
      id: 'video-1',
      attributes: {
        drupal_internal__nid: 1,
        title: 'video-content',
      },
      relationships: {},
    },
    included: [],
  }

  it('maps page content', () => {
    const expectedResult: CmsPageContent = {
      id: 1,
      title: 'video-content',
      breadcrumbs: [
        { text: 'Home', href: '/' },
        { text: 'Series', href: '/taxonomy/term/77' },
      ],
      categories: { id: 10, name: 'top-level-category' },
      topics: [{ id: 30, name: 'topic-name' }],
      excludeFeedback: true,
      contentType: 'page',
      description: 'processed-main-body-content',
      standFirst: 'stand-first',
    }

    expect(mapPageContent(response, 'en')).toEqual(expectedResult)
  })

  it('falls back to expected values when necessary', () => {
    const expectedResult: CmsPageContent = {
      id: 1,
      title: 'video-content',
      breadcrumbs: [],
      categories: null,
      topics: [],
      excludeFeedback: false,
      contentType: 'page',
      description: null,
      standFirst: null,
    }

    expect(mapPageContent(minimalResponse, 'en')).toEqual(expectedResult)
  })
})
