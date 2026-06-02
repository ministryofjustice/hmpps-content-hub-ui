import type { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'
import { defaultTopicsResponse } from '../fixtures/cmsTopics'
import { defaultPrimaryNavigationResponse } from '../fixtures/cmsPrimaryNavigation'

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
          data: [{ type: 'node--page', id: 'content-1' }],
        },
        field_key_info_tiles: {
          data: [],
        },
        field_large_update_tile: {
          data: { type: 'node--page', id: 'content-1' },
        },
      },
    },
  ],
  included: [
    {
      type: 'node--page',
      id: 'content-1',
      attributes: {
        drupal_internal__nid: 1,
        title: 'Sample content',
        field_summary: 'Sample summary',
        path: { alias: '/content/1' },
        published_at: '2026-01-01T00:00:00.000Z',
      },
    },
  ],
  links: {},
}

const defaultHomepageCollectionResponse = {
  data: [
    {
      type: 'node--page',
      id: 'content-2',
      attributes: {
        drupal_internal__nid: 2,
        title: 'Sample collection content',
        field_summary: 'Sample summary',
        path: { alias: '/content/2' },
        published_at: '2026-01-01T00:00:00.000Z',
      },
    },
  ],
  included: [],
  links: {},
}

const defaultUrgentBannerResponse = {
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
        urlPattern: '/en/jsonapi/prison/[^/]+/taxonomy_term.*',
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
    body: Record<string, unknown> = defaultHomepageCollectionResponse,
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
    body: Record<string, unknown> = defaultHomepageCollectionResponse,
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
}
