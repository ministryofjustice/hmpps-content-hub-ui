import { JsonApiSingleResponse } from '../../../data/jsonApiClient'
import { CmsAudioContent, CmsAudioNodeAttributes } from '../types'
import mapAudioContent from './mapAudioContent'

describe('map audio content', () => {
  const response: JsonApiSingleResponse<CmsAudioNodeAttributes> = {
    data: {
      type: 'taxonomy_term--series',
      id: 'audio-1',
      attributes: {
        drupal_internal__nid: 1,
        title: 'audio-content',
        created: 'created-date',
        field_description: { processed: 'processed-field-description' },
        field_moj_programme_code: 'programme-code',
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
        field_moj_thumbnail_image: { data: { type: 'file--file', id: 'audio-thumbnail' } },
        field_moj_audio: { data: { type: 'file--file', id: 'file-audio' } },
        field_moj_top_level_categories: { data: { type: 'file--file', id: 'top-level-categories' } },
        field_moj_series: { data: { type: 'file--file', id: 'series' } },
        field_topics: { data: { type: 'file--file', id: 'topics' } },
      },
    },
    included: [
      {
        type: 'file--file',
        id: 'audio-thumbnail',
        attributes: { image_style_uri: { tile_small: 'audio-file-image' } },
      },
      {
        type: 'file--file',
        id: 'file-audio',
        attributes: { uri: { url: 'audio-url' } },
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

  const minimalResponse: JsonApiSingleResponse<CmsAudioNodeAttributes> = {
    data: {
      type: 'taxonomy_term--series',
      id: 'audio-1',
      attributes: {
        drupal_internal__nid: 1,
        title: 'audio-content',
      },
      relationships: {},
    },
    included: [],
  }

  it('maps audio content', () => {
    const expectedResult: CmsAudioContent = {
      id: 1,
      title: 'audio-content',
      breadcrumbs: [
        { text: 'Home', href: '/' },
        { text: 'Series', href: '/taxonomy/term/77' },
      ],
      categories: { id: 10, name: 'top-level-category' },
      topics: [{ id: 30, name: 'topic-name' }],
      excludeFeedback: true,
      contentType: 'radio',
      uuid: 'audio-1',
      created: 'created-date',
      description: 'processed-field-description',
      media: 'audio-url',
      image: 'audio-file-image',
      programmeCode: 'programme-code',
      episodeId: 1001,
      seasonId: 1,
      seriesId: 20,
      seriesPath: 'series-path',
      seriesName: 'series-name',
      seriesSortValue: 1,
    }

    expect(mapAudioContent(response, 'en')).toEqual(expectedResult)
  })

  it('falls back to expected values when necessary', () => {
    const expectedResult: CmsAudioContent = {
      id: 1,
      title: 'audio-content',
      breadcrumbs: [],
      categories: null,
      topics: [],
      excludeFeedback: false,
      contentType: 'radio',
      uuid: 'audio-1',
      created: null,
      description: null,
      media: null,
      image: null,
      programmeCode: null,
      episodeId: null,
      seasonId: null,
      seriesId: null,
      seriesPath: null,
      seriesName: null,
      seriesSortValue: null,
    }

    expect(mapAudioContent(minimalResponse, 'en')).toEqual(expectedResult)
  })
})
