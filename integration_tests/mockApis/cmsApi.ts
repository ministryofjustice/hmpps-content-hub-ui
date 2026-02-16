import type { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'
import { defaultTopicsResponse } from '../fixtures/cmsTopics'
import { defaultPrimaryNavigationResponse } from '../fixtures/cmsPrimaryNavigation'

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
        urlPattern: '/en/jsonapi/prison/bullingdon/taxonomy_term.*',
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
        urlPattern: '/en/jsonapi/prison/bullingdon/primary_navigation.*',
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: body,
      },
    }),
}
