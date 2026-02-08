import type { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

export default {
  stubPing: (httpStatus = 200): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/component-api/health/ping',
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: { status: httpStatus === 200 ? 'UP' : 'DOWN' },
      },
    }),

  stubComponents: (httpStatus = 200): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/component-api/components.*',
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          header: {
            html: `
              <header data-qa="connect-dps-common-header">
                <div data-qa="header-user-name">A. Testuser</div>
                <div data-qa="header-phase-banner">This is a new service</div>
                <a href="/sign-out">Sign out</a>
                <a href="/account/details" data-qa="manageDetails">Manage your details</a>
              </header>
            `,
            css: [],
            javascript: [],
          },
          footer: {
            html: '<footer data-qa="connect-dps-common-footer"></footer>',
            css: [],
            javascript: [],
          },
        },
      },
    }),
}
