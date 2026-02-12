import superagent from 'superagent'
import {
  IdTokenEstablishment,
  Establishment,
  IdToken,
  RefreshToken,
  UpdatedTokensResponse,
} from '../../../@types/launchpad'
import config from '../../../config'
import { LaunchpadUser } from '../../../interfaces/hmppsUser'
import generateOauthClientToken from '../../../utils/clientCredentials'
import { TimeSpan } from '../../../utils/timeSpans'

export const userFromTokens = (idToken: string, refreshToken: string, accessToken: string): LaunchpadUser => {
  const { establishment, name, sub } = tokenFromJwt<IdToken>(idToken)

  return {
    idToken,
    refreshToken,
    accessToken,
    establishment: establishmentFrom(establishment),
    displayName: name,
    // To comply with HmppsUser
    authSource: 'launchpad',
    name,
    username: name,
    token: idToken,
    userId: sub,
    userRoles: [],
  }
}

export const getUpdatedTokens = (refreshToken: string): Promise<UpdatedTokensResponse> => {
  const url = `${config.apis.launchpadAuth.externalUrl}/v1/oauth2/token`
  const authHeaderValue = generateOauthClientToken(
    config.apis.launchpadAuth.apiClientId,
    config.apis.launchpadAuth.apiClientSecret,
  )

  const refreshedTokens: Promise<UpdatedTokensResponse> = new Promise((resolve, reject) => {
    superagent
      .post(url)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', authHeaderValue)
      .query({ refresh_token: refreshToken, grant_type: 'refresh_token' })
      .end((err, res) => {
        if (err) {
          reject(err) // Reject the promise in case of an error
        } else {
          resolve(res.body) // Resolve the promise with the response body
        }
      })
  })

  return refreshedTokens
}

export const tokenHasNotExpired = (token: string, expiresAt: TimeSpan): boolean => {
  const decodedToken = tokenFromJwt<RefreshToken>(token)
  return decodedToken.exp >= expiresAt.seconds
}

const establishmentFrom = (apiEstablishment: IdTokenEstablishment): Establishment => {
  return config.establishments.find(({ code }) => code === apiEstablishment.agency_id)
}

const tokenFromJwt = <T>(token: string): T => JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
