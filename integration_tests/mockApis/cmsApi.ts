import type { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'
import { defaultTopicsResponse } from '../fixtures/cmsTopics'
import { defaultPrimaryNavigationResponse } from '../fixtures/cmsPrimaryNavigation'

const placeholderImage = '/assets/images/content_image_placeholder_logo.png'

const createImage = (id: string) => ({
  type: 'file--file',
  id,
  attributes: {
    image_style_uri: {
      tile_small: placeholderImage,
      tile_large: placeholderImage,
    },
  },
})

const createNode = ({
  id,
  nid,
  title,
  summary,
  alias,
  publishedAt,
  imageId,
}: {
  id: string
  nid: number
  title: string
  summary: string
  alias: string
  publishedAt: string
  imageId: string
}) => ({
  type: 'node--page',
  id,
  attributes: {
    drupal_internal__nid: nid,
    title,
    field_summary: summary,
    path: { alias },
    published_at: publishedAt,
  },
  relationships: {
    field_moj_thumbnail_image: {
      data: [{ type: 'file--file', id: imageId }],
    },
  },
})

const featuredNodes = [
  createNode({
    id: 'featured-1',
    nid: 101,
    title: 'Keeping active in prison',
    summary: 'Simple ideas to stay fit and feel better.',
    alias: '/content/101',
    publishedAt: '2026-05-29T10:00:00.000Z',
    imageId: 'img-featured-1',
  }),
  createNode({
    id: 'featured-2',
    nid: 102,
    title: 'Understanding your parole journey',
    summary: 'What each stage means and what to expect.',
    alias: '/content/102',
    publishedAt: '2026-05-28T10:00:00.000Z',
    imageId: 'img-featured-2',
  }),
  createNode({
    id: 'featured-3',
    nid: 103,
    title: 'Making progress with education',
    summary: 'Courses, support and opportunities.',
    alias: '/content/103',
    publishedAt: '2026-05-27T10:00:00.000Z',
    imageId: 'img-featured-3',
  }),
  createNode({
    id: 'featured-4',
    nid: 104,
    title: 'Wellbeing support this week',
    summary: 'Resources available in your prison.',
    alias: '/content/104',
    publishedAt: '2026-05-26T10:00:00.000Z',
    imageId: 'img-featured-4',
  }),
]

const keyInfoNodes = [
  createNode({
    id: 'key-1',
    nid: 201,
    title: 'Understanding the parole process',
    summary: 'A quick overview of each step.',
    alias: '/content/201',
    publishedAt: '2026-05-28T12:00:00.000Z',
    imageId: 'img-key-1',
  }),
  createNode({
    id: 'key-2',
    nid: 202,
    title: 'Introduction to Cookham Wood',
    summary: 'What to expect when you arrive.',
    alias: '/content/202',
    publishedAt: '2026-05-27T12:00:00.000Z',
    imageId: 'img-key-2',
  }),
  createNode({
    id: 'key-3',
    nid: 203,
    title: 'Laptop guide',
    summary: 'How to use digital tools safely.',
    alias: '/content/203',
    publishedAt: '2026-05-26T12:00:00.000Z',
    imageId: 'img-key-3',
  }),
  createNode({
    id: 'key-4',
    nid: 204,
    title: 'Workshop and workplace updates',
    summary: 'Important updates about work areas.',
    alias: '/content/204',
    publishedAt: '2026-05-25T12:00:00.000Z',
    imageId: 'img-key-4',
  }),
]

const updatesNodes = [
  createNode({
    id: 'update-1',
    nid: 301,
    title: 'NTP 06-26 | Gym Orderly Vacancy',
    summary: 'Gym orderly vacancy.',
    alias: '/content/301',
    publishedAt: '2026-05-28T09:00:00.000Z',
    imageId: 'img-update-1',
  }),
  createNode({
    id: 'update-2',
    nid: 302,
    title: 'Criminon UK | Course brochure and list',
    summary: 'See the latest course brochure and list.',
    alias: '/content/302',
    publishedAt: '2026-05-27T09:00:00.000Z',
    imageId: 'img-update-2',
  }),
  createNode({
    id: 'update-3',
    nid: 303,
    title: 'DHL - Current availability issues',
    summary: 'Some product lines are temporarily unavailable.',
    alias: '/content/303',
    publishedAt: '2026-05-27T08:00:00.000Z',
    imageId: 'img-update-3',
  }),
  createNode({
    id: 'update-4',
    nid: 304,
    title: 'DHL - Back to local product list',
    summary: 'Updated local product list now available.',
    alias: '/content/304',
    publishedAt: '2026-05-27T07:00:00.000Z',
    imageId: 'img-update-4',
  }),
  createNode({
    id: 'update-5',
    nid: 305,
    title: 'DHL - Changes for week commencing 31 May 2026',
    summary: 'A round-up of changes for the coming week.',
    alias: '/content/305',
    publishedAt: '2026-05-26T09:00:00.000Z',
    imageId: 'img-update-5',
  }),
]

const recentlyAddedNodes = [
  createNode({
    id: 'recent-1',
    nid: 401,
    title: 'Getting started with learning plans',
    summary: 'How to set practical goals for learning.',
    alias: '/content/401',
    publishedAt: '2026-05-30T12:00:00.000Z',
    imageId: 'img-recent-1',
  }),
  createNode({
    id: 'recent-2',
    nid: 402,
    title: 'Peer mentoring programme updates',
    summary: 'New support sessions now available.',
    alias: '/content/402',
    publishedAt: '2026-05-29T12:00:00.000Z',
    imageId: 'img-recent-2',
  }),
  createNode({
    id: 'recent-3',
    nid: 403,
    title: 'Family contact and visits guidance',
    summary: 'Guidance on visits and communication.',
    alias: '/content/403',
    publishedAt: '2026-05-28T12:00:00.000Z',
    imageId: 'img-recent-3',
  }),
  createNode({
    id: 'recent-4',
    nid: 404,
    title: 'Sports schedule for this month',
    summary: 'Activities and times for gym sessions.',
    alias: '/content/404',
    publishedAt: '2026-05-27T12:00:00.000Z',
    imageId: 'img-recent-4',
  }),
]

const exploreNodes = [
  createNode({
    id: 'explore-1',
    nid: 501,
    title: 'Explore wellbeing resources',
    summary: 'Support for sleep, stress and motivation.',
    alias: '/content/501',
    publishedAt: '2026-05-26T11:00:00.000Z',
    imageId: 'img-explore-1',
  }),
  createNode({
    id: 'explore-2',
    nid: 502,
    title: 'Explore job and workshop pathways',
    summary: 'Understand opportunities in prison work.',
    alias: '/content/502',
    publishedAt: '2026-05-25T11:00:00.000Z',
    imageId: 'img-explore-2',
  }),
  createNode({
    id: 'explore-3',
    nid: 503,
    title: 'Explore legal and sentence support',
    summary: 'Find help on legal and sentence topics.',
    alias: '/content/503',
    publishedAt: '2026-05-24T11:00:00.000Z',
    imageId: 'img-explore-3',
  }),
  createNode({
    id: 'explore-4',
    nid: 504,
    title: 'Explore faith and community content',
    summary: 'Services and support across faiths.',
    alias: '/content/504',
    publishedAt: '2026-05-23T11:00:00.000Z',
    imageId: 'img-explore-4',
  }),
]

const imageIds = [
  'img-featured-1',
  'img-featured-2',
  'img-featured-3',
  'img-featured-4',
  'img-key-1',
  'img-key-2',
  'img-key-3',
  'img-key-4',
  'img-update-1',
  'img-update-2',
  'img-update-3',
  'img-update-4',
  'img-update-5',
  'img-recent-1',
  'img-recent-2',
  'img-recent-3',
  'img-recent-4',
  'img-explore-1',
  'img-explore-2',
  'img-explore-3',
  'img-explore-4',
]

const allImages = imageIds.map(createImage)

const defaultHomepageContentResponse = {
  data: [
    {
      type: 'node--homepage',
      id: 'home-1',
      attributes: {
        title: 'Homepage',
      },
      relationships: {
        field_featured_tiles: {
          data: featuredNodes.map(item => ({ type: item.type, id: item.id })),
        },
        field_key_info_tiles: {
          data: keyInfoNodes.map(item => ({ type: item.type, id: item.id })),
        },
        field_large_update_tile: {
          data: { type: updatesNodes[0].type, id: updatesNodes[0].id },
        },
      },
    },
  ],
  included: [...featuredNodes, ...keyInfoNodes, updatesNodes[0], ...allImages],
  links: {},
}

const defaultHomepageCollectionResponse = {
  data: updatesNodes,
  included: [...updatesNodes, ...allImages],
  links: {
    next: '/en/jsonapi/prison/mock-prison/node?page[offset]=5',
  },
}

const defaultRecentlyAddedHomepageCollectionResponse = {
  data: recentlyAddedNodes,
  included: [...recentlyAddedNodes, ...allImages],
  links: {},
}

const defaultExploreHomepageCollectionResponse = {
  data: exploreNodes,
  included: [...exploreNodes, ...allImages],
  links: {},
}

const defaultUrgentBannerResponse = {
  data: [],
  included: [],
  links: {},
}

const defaultTopicHeaderResponse = {
  data: {
    type: 'taxonomy_term--topics',
    id: 'topic-1',
    attributes: {
      drupal_internal__tid: 1,
      name: 'Appeals',
      description: { processed: '<p>Topic description</p>' },
      breadcrumbs: [{ text: 'Home', href: '/' }, { text: 'Topics', href: '/topics' }, { text: 'Appeals' }],
    },
    relationships: {
      field_moj_thumbnail_image: {
        data: [],
      },
    },
  },
  included: [],
  links: {},
}

const defaultTopicItemsResponse = {
  data: [],
  included: [],
  links: {},
}

export default {
  stubPing: (httpStatus = 200): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/jsonapi',
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: { status: httpStatus === 200 ? 'UP' : 'DOWN' },
      },
    }),

  stubTopics: (httpStatus = 200, body: Record<string, unknown> = defaultTopicsResponse): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/en/jsonapi/prison/[^/]+/taxonomy_term\\?.*filter%5Bvid.meta.drupal_internal__target_id%5D=topics.*',
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: body,
      },
    }),

  stubPrimaryNavigation: (
    httpStatus = 200,
    body: Record<string, unknown> = defaultPrimaryNavigationResponse,
  ): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/en/jsonapi/prison/[^/]+/primary_navigation.*',
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: body,
      },
    }),

  stubHomepageContent: (
    httpStatus = 200,
    body: Record<string, unknown> = defaultHomepageContentResponse,
  ): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/en/jsonapi/prison/[^/]+/node/homepage.*',
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: body,
      },
    }),

  stubHomepageCollectionQueries: (
    httpStatus = 200,
    body: Record<string, unknown> = defaultHomepageCollectionResponse,
  ): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/en/jsonapi/prison/[^/]+/node\\?.*',
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: body,
      },
    }),

  stubRecentlyAddedHomepageContent: (
    httpStatus = 200,
    body: Record<string, unknown> = defaultRecentlyAddedHomepageCollectionResponse,
  ): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/en/jsonapi/prison/[^/]+/recently-added.*',
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: body,
      },
    }),

  stubExploreHomepageContent: (
    httpStatus = 200,
    body: Record<string, unknown> = defaultExploreHomepageCollectionResponse,
  ): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/en/jsonapi/prison/[^/]+/explore/node.*',
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: body,
      },
    }),

  stubUrgentBanner: (
    httpStatus = 200,
    body: Record<string, unknown> = defaultUrgentBannerResponse,
  ): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/en/jsonapi/prison/[^/]+/node/urgent_banner.*',
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: body,
      },
    }),

  stubTopicHeader: (
    httpStatus = 200,
    body: Record<string, unknown> = defaultTopicHeaderResponse,
  ): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/en/jsonapi/prison/[^/]+/taxonomy_term/topics/[^/]+\\?.*',
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: body,
      },
    }),

  stubTopicItems: (
    httpStatus = 200,
    body: Record<string, unknown> = defaultTopicItemsResponse,
  ): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/en/jsonapi/prison/[^/]+/node\\?.*filter%5Bfield_topics.id%5D=.*',
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: body,
      },
    }),

  stubTagLookupByTid: ({
    tid,
    topicId,
    topicName,
    httpStatus = 200,
  }: {
    tid: number
    topicId: string
    topicName: string
    httpStatus?: number
  }): SuperAgentRequest =>
    stubFor({
      priority: 1,
      request: {
        method: 'GET',
        urlPathPattern: '/en/jsonapi/prison/[^/]+/taxonomy_term',
        queryParameters: {
          'filter[drupal_internal__tid]': {
            equalTo: `${tid}`,
          },
        },
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          data: [
            {
              type: 'taxonomy_term--topics',
              id: `${tid}`,
              attributes: {
                drupal_internal__tid: tid,
                name: topicName,
                description: { processed: `<p>${topicName}</p>` },
              },
            },
          ],
          included: [],
          links: {},
        },
      },
    }),

  stubTopicHeaderById: ({
    tid,
    topicId,
    topicName,
    httpStatus = 200,
  }: {
    tid: number
    topicId: string
    topicName: string
    httpStatus?: number
  }): SuperAgentRequest =>
    stubFor({
      priority: 1,
      request: {
        method: 'GET',
        urlPathPattern: `/en/jsonapi/prison/[^/]+/taxonomy_term/topics/(?:${topicId}|${tid})`,
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          data: {
            type: 'taxonomy_term--topics',
            id: `${tid}`,
            attributes: {
              drupal_internal__tid: tid,
              name: topicName,
              description: { processed: `<p>${topicName}</p>` },
              breadcrumbs: [{ text: 'Home', href: '/' }, { text: 'Topics', href: '/topics' }, { text: topicName }],
            },
            relationships: {
              field_moj_thumbnail_image: {
                data: [],
              },
            },
          },
          included: [],
          links: {},
        },
      },
    }),

  stubTopicItemsById: ({ topicId, httpStatus = 200 }: { topicId: string; httpStatus?: number }): SuperAgentRequest =>
    stubFor({
      priority: 1,
      request: {
        method: 'GET',
        urlPathPattern: '/en/jsonapi/prison/[^/]+/node',
        queryParameters: {
          'filter[field_topics.id]': {
            matches: `(?:${topicId}|${topicId.replace('topic-', '')})`,
          },
        },
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: defaultTopicItemsResponse,
      },
    }),
}
