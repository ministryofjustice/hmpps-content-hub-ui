const PDF_TEST_CONTENT = {
  fileUrl: '/assets/images/test.pdf',
  nodeId: 'pdf-update-1',
  title: 'PDF test document',
  summary: 'Open the test PDF document.',
  publishedAt: '2026-06-01T09:00:00.000Z',
}

export const PDF_HOMEPAGE_CONTENT_RESPONSE = {
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
          data: { type: 'node--moj_pdf_item', id: PDF_TEST_CONTENT.nodeId },
        },
      },
    },
  ],
  included: [
    {
      type: 'node--moj_pdf_item',
      id: PDF_TEST_CONTENT.nodeId,
      attributes: {
        drupal_internal__nid: 301,
        title: PDF_TEST_CONTENT.title,
        field_summary: PDF_TEST_CONTENT.summary,
        path: { alias: PDF_TEST_CONTENT.fileUrl },
        published_at: PDF_TEST_CONTENT.publishedAt,
      },
      relationships: {
        field_moj_thumbnail_image: {
          data: [{ type: 'file--file', id: 'img-pdf-1' }],
        },
      },
    },
    {
      type: 'file--file',
      id: 'img-pdf-1',
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

export const PDF_HOMEPAGE_COLLECTION_RESPONSE = {
  data: [
    {
      type: 'node--moj_pdf_item',
      id: PDF_TEST_CONTENT.nodeId,
      attributes: {
        drupal_internal__nid: 301,
        title: PDF_TEST_CONTENT.title,
        field_summary: PDF_TEST_CONTENT.summary,
        path: { alias: PDF_TEST_CONTENT.fileUrl },
        published_at: PDF_TEST_CONTENT.publishedAt,
      },
      relationships: {
        field_moj_thumbnail_image: {
          data: [{ type: 'file--file', id: 'img-pdf-1' }],
        },
      },
    },
  ],
  included: [
    {
      type: 'file--file',
      id: 'img-pdf-1',
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

export default PDF_TEST_CONTENT
