import jwt from 'jsonwebtoken'
import { stubFor, getMatchingRequests } from './wiremock'

export interface UserToken {
  name?: string
  roles?: string[]
  authSource?: 'nomis' | 'delius'
}

function createToken(userToken: UserToken) {
  const payload = {
    name: userToken.name || 'john smith',
    user_name: 'USER1',
    scope: ['read', 'write'],
    auth_source: 'nomis',
    authorities: userToken.roles,
    jti: 'a610a10-cca6-41db-985f-e87efb303aaf',
    client_id: 'clientid',
  }

  return jwt.sign(payload, 'secret', { expiresIn: '1h' })
}

function createIdToken(userToken: UserToken) {
  const payload = {
    name: userToken.name || 'john smith',
    user_name: 'USER1',
    authorities: userToken.roles,
    aud: 'clientid',
    sub: 'A-BOOKING-ID',
    iss: 'http://localhost:9091/launchpadauth',
  }

  return jwt.sign(payload, 'secret', { expiresIn: '1h' })
}

export default {
  getSignInUrl: async (): Promise<string> => {
    const data = await getMatchingRequests({
      method: 'GET',
      urlPath: '/auth/oauth/authorize',
    })

    const { requests = [] } = data.body as { requests?: Array<{ queryParams?: { state?: { values?: string[] } } }> }
    const lastRequest = requests[requests.length - 1]
    const stateValue = lastRequest?.queryParams?.state?.values?.[0]

    if (stateValue) {
      return `/sign-in/callback?code=codexxxx&state=${encodeURIComponent(stateValue)}`
    }

    throw new Error('Unable to determine HMPPS auth state')
  },

  favicon: () =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/favicon.ico',
      },
      response: {
        status: 200,
      },
    }),

  stubPing: () =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/auth/health/ping',
      },
      response: {
        status: 200,
      },
    }),

  stubSignInPage: () =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/auth/oauth/authorize\\?response_type=code&redirect_uri=.+?&state=.+?&client_id=clientid',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
          Location: 'http://staff.localhost:3007/sign-in/callback?code=codexxxx&state=stateyyyy',
        },
        body: '<html lang="en"><body>Dummy Sign in page<h1>Sign in</h1></body></html>',
      },
    }),

  stubSignOutPage: () =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/auth/sign-out.*',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
        },
        body: '<html lang="en"><body>Dummy Sign in page<h1>Sign in</h1></body></html>',
      },
    }),

  stubManageDetailsPage: () =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/auth/account-details.*',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
        },
        body: '<html><body><h1>Your account details</h1></body></html>',
      },
    }),

  token: (userToken: UserToken) =>
    stubFor({
      request: {
        method: 'POST',
        urlPattern: '/auth/oauth/token',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          Location: 'http://staff.localhost:3007/sign-in/callback?code=codexxxx&state=stateyyyy',
        },
        jsonBody: {
          access_token: createToken(userToken),
          refresh_token: createToken(userToken),
          id_token: createIdToken(userToken),
          token_type: 'bearer',
          auth_source: userToken.authSource,
          user_name: 'USER1',
          expires_in: 599,
          scope: 'read',
          internalUser: true,
        },
      },
    }),
}
