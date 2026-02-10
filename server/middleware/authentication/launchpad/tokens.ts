import { Establishment, IdToken, RefreshToken } from '../../../@types/launchpad'
import { LaunchpadUser } from '../../../interfaces/hmppsUser'

export const userFromTokens = (idToken: string, refreshToken: string, accessToken: string): LaunchpadUser => {
  const idTokenJson = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString()) as IdToken

  const establishment: Establishment = {
    displayName: idTokenJson.establishment.display_name,
    code: idTokenJson.establishment.agency_id,
    name: idTokenJson.establishment.name,
    youth: idTokenJson.establishment.youth,
  }

  return {
    idToken: idTokenJson,
    displayName: idTokenJson.name,
    refreshToken,
    accessToken,
    establishment,
    // To comply with HmppsUser
    authSource: 'launchpad',
    name: idTokenJson.name,
    username: idTokenJson.name,
    token: idToken,
    userId: idTokenJson.sub,
    userRoles: [],
  }
}

export const tokenHasNotExpired = (token: IdToken | RefreshToken, epoch: number): boolean => token.exp >= epoch
