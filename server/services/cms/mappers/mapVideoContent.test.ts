import { JsonApiSingleResponse } from '../../../data/jsonApiClient'
import { CmsVideoContent, CmsVideoNodeAttributes } from '../types'
import mapVideoContent from './mapVideoContent'

describe('map video content', () => {
  const response: JsonApiSingleResponse<CmsVideoNodeAttributes> = {
    data: {
      type: 'taxonomy_term--series',
      id: 'video-1',
      attributes: {
        drupal_internal__nid: 1,
        title: 'video-content',
        created: 'created-date',
        field_description: { processed: 'processed-field-description' },
        field_moj_season: 1,
        field_moj_episode: 1,
        series_sort_value: 1,
        field_exclude_feedback: true,
        breadcrumbs: [
          { title: 'Home', uri: '/' },
          { title: 'Series', uri: '/taxonomy/term/77' },
        ],
      },
      relationships: {
        field_moj_thumbnail_image: { data: { type: 'file--file', id: 'video-thumbnail' } },
        field_video: { data: { type: 'file--file', id: 'file-video' } },
        field_moj_top_level_categories: { data: { type: 'file--file', id: 'top-level-categories' } },
        field_moj_series: { data: { type: 'file--file', id: 'series' } },
        field_topics: { data: { type: 'file--file', id: 'topics' } },
      },
    },
    included: [
      {
        type: 'file--file',
        id: 'video-thumbnail',
        attributes: { image_style_uri: { tile_small: 'video-file-image' } },
      },
      {
        type: 'file--file',
        id: 'file-video',
        attributes: { uri: { url: 'video-url' } },
      },
      {
        type: 'file--file',
        id: 'top-level-categories',
        attributes: { drupal_internal__tid: 10, name: 'top-level-category' },
      },
      {
        type: 'file--file',
        id: 'series',
        attributes: { drupal_internal__tid: 20, name: 'series-name', path: { alias: 'series-path' } },
      },
      {
        type: 'file--file',
        id: 'topics',
        attributes: { drupal_internal__tid: 30, name: 'topic-name' },
      },
    ],
  }

  const minimalResponse: JsonApiSingleResponse<CmsVideoNodeAttributes> = {
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

  it('maps video content', () => {
    const expectedResult: CmsVideoContent = {
      id: 1,
      title: 'video-content',
      breadcrumbs: [
        { text: 'Home', href: '/' },
        { text: 'Series', href: '/taxonomy/term/77' },
      ],
      categories: { id: 10, name: 'top-level-category' },
      topics: [{ id: 30, name: 'topic-name' }],
      excludeFeedback: true,
      contentType: 'video',
      uuid: 'video-1',
      created: 'created-date',
      description: 'processed-field-description',
      media: 'video-url',
      image: 'video-file-image',
      episodeId: 1001,
      seasonId: 1,
      seriesId: 20,
      seriesPath: 'series-path',
      seriesName: 'series-name',
      seriesSortValue: 1,
    }

    expect(mapVideoContent(response, 'en')).toEqual(expectedResult)
  })

  it('falls back to expected values when necessary', () => {
    const expectedResult: CmsVideoContent = {
      id: 1,
      title: 'video-content',
      breadcrumbs: [],
      categories: null,
      topics: [],
      excludeFeedback: false,
      contentType: 'video',
      uuid: 'video-1',
      created: null,
      description: null,
      media: null,
      image: null,
      episodeId: null,
      seasonId: null,
      seriesId: null,
      seriesPath: null,
      seriesName: null,
      seriesSortValue: null,
    }

    expect(mapVideoContent(minimalResponse, 'en')).toEqual(expectedResult)
  })
})
