export const AUDIO_TEST_NID = 3301
export const AUDIO_TEST_UUID = 'audio-update-uuid-3301'
export const AUDIO_TEST_TITLE = 'Audio test content'
export const AUDIO_TEST_PROGRAMME_CODE = 'RADIO_3301'
export const AUDIO_TEST_MEDIA_URL = '/assets/audio/test.mp3'

const AUDIO_TEST_NODE_ID = 'audio-update-1'
const AUDIO_TEST_SUMMARY = 'Listen to the test audio item.'
const AUDIO_TEST_PUBLISHED_AT = '2026-06-02T09:00:00.000Z'

export const AUDIO_HOMEPAGE_CONTENT_RESPONSE = {
  data: [
    {
      type: 'node--homepage',
      id: 'home-1',
      attributes: {
        title: 'Homepage',
      },
      relationships: {
        field_featured_tiles: { data: [] },
        field_key_info_tiles: { data: [] },
        field_large_update_tile: {
          data: { type: 'node--moj_radio_item', id: AUDIO_TEST_NODE_ID },
        },
      },
    },
  ],
  included: [
    {
      type: 'node--moj_radio_item',
      id: AUDIO_TEST_NODE_ID,
      attributes: {
        drupal_internal__nid: AUDIO_TEST_NID,
        title: AUDIO_TEST_TITLE,
        field_summary: AUDIO_TEST_SUMMARY,
        path: { alias: `/content/${AUDIO_TEST_NID}` },
        published_at: AUDIO_TEST_PUBLISHED_AT,
      },
      relationships: {
        field_moj_thumbnail_image: {
          data: [{ type: 'file--file', id: 'img-audio-1' }],
        },
      },
    },
    {
      type: 'file--file',
      id: 'img-audio-1',
      attributes: {
        image_style_uri: {
          tile_small: '/assets/images/content_image_placeholder_logo.png',
          tile_large: '/assets/images/content_image_placeholder_logo.png',
        },
      },
    },
  ],
  links: {},
}

export const AUDIO_HOMEPAGE_COLLECTION_RESPONSE = {
  data: [
    {
      type: 'node--moj_radio_item',
      id: AUDIO_TEST_NODE_ID,
      attributes: {
        drupal_internal__nid: AUDIO_TEST_NID,
        title: AUDIO_TEST_TITLE,
        field_summary: AUDIO_TEST_SUMMARY,
        path: { alias: `/content/${AUDIO_TEST_NID}` },
        published_at: AUDIO_TEST_PUBLISHED_AT,
      },
      relationships: {
        field_moj_thumbnail_image: {
          data: [{ type: 'file--file', id: 'img-audio-1' }],
        },
      },
    },
  ],
  included: [
    {
      type: 'file--file',
      id: 'img-audio-1',
      attributes: {
        image_style_uri: {
          tile_small: '/assets/images/content_image_placeholder_logo.png',
          tile_large: '/assets/images/content_image_placeholder_logo.png',
        },
      },
    },
  ],
  links: {},
}
