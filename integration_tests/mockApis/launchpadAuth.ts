import jwt from 'jsonwebtoken'
import { stubFor, getMatchingRequests } from './wiremock'
import { Establishment, IdToken } from '../../server/@types/launchpad'
import config from '../../server/config'

export interface LaunchpadUserToken {
  name: string
  establishmentCode: string
}

function createRefreshOrAccessToken(type: 'refresh' | 'access', userToken: LaunchpadUserToken) {
  const payload = {
    name: userToken.name,
    exp: new Date().getTime() + 9999,
    scopes: [
      'user.basic.read',
      'user.establishment.read',
      'user.booking.read',
      'user.clients.read',
      'user.clients.delete',
    ],
    iss: 'http://localhost:9091/launchpadauth',
    [type === 'refresh' ? 'jti' : 'ati']: 'a610a10-cca6-41db-985f-e87efb303aaf',
  }
  return jwt.sign(payload, 'secret')
}

function createIdToken(userToken: LaunchpadUserToken) {
  const establishment: Establishment =
    config.establishments.find(({ code }) => code === userToken.establishmentCode) || config.establishments[0]

  const payload: IdToken = {
    name: userToken.name,
    given_name: '',
    family_name: '',
    iat: new Date().getTime(),
    aud: 'clientid',
    sub: 'A-BOOKING-ID',
    exp: new Date().getTime() + 9999,
    booking: {
      id: 'A-BOOKING-ID',
    },
    establishment: {
      id: establishment.code,
      agency_id: establishment.code,
      name: establishment.name,
      display_name: establishment.displayName,
      youth: establishment.youth,
    },
    iss: 'http://localhost:9091/launchpadauth',
  }
  return jwt.sign(payload, 'secret')
}

export default {
  getSignInUrl: (): Promise<string> =>
    getMatchingRequests({
      method: 'GET',
      urlPath: '/launchpadauth/v1/oauth2/authorize',
    }).then(data => {
      const { requests } = data.body
      const stateValue = requests[requests.length - 1].queryParams.state.values[0]
      return `/sign-in/callback?code=codexxxx&state=${encodeURIComponent(stateValue)}`
    }),

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
        urlPattern: '/launchpadauth/health/ping',
      },
      response: {
        status: 200,
      },
    }),

  stubSignInPage: () =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern:
          '/launchpadauth/v1/oauth2/authorize\\?response_type=code&client_id=clientid&redirect_uri=.+?&scope=.+?&state=.+?',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
          Location: 'http://localhost:3007/sign-in/callback?code=codexxxx&state=stateyyyy',
        },
        body: '<html lang="en"><body>Dummy Sign in page<h1>Sign in</h1></body></html>',
      },
    }),

  stubSignOutPage: () =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/launchpadauth/sign-out.*',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
        },
        body: '<html lang="en"><body>Dummy Sign in page<h1>Sign in</h1></body></html>',
      },
    }),

  token: (userToken: LaunchpadUserToken) =>
    stubFor({
      request: {
        method: 'POST',
        urlPattern: '/launchpadauth/v1/oauth2/token',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          Location: 'http://localhost:3007/sign-in/callback?code=codexxxx&state=stateyyyy',
        },
        jsonBody: {
          access_token: createRefreshOrAccessToken('access', userToken),
          refresh_token: createRefreshOrAccessToken('refresh', userToken),
          id_token: createIdToken(userToken),
          token_type: 'Bearer',
          expires_in: 9999,
        },
      },
    }),
}
