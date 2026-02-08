import { Establishment } from '../../../@types/establishment'
import { IdToken } from '../../../@types/launchpad'
import { LaunchpadUser } from '../../../interfaces/hmppsUser'

export default (idToken: string, refreshToken: string, accessToken: string): LaunchpadUser => {
  const idTokenJson = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString()) as IdToken

  const establishment: Establishment = {
    displayName: idTokenJson.establishment.display_name,
    code: idTokenJson.establishment.agency_id,
    name: idTokenJson.establishment.name,
    youth: idTokenJson.establishment.youth,
  }

  return {
    idToken: idTokenJson,
    username: idTokenJson.name,
    authSource: 'launchpad',
    userId: null,
    userRoles: null,
    name: idTokenJson.name,
    displayName: idTokenJson.name,
    refreshToken,
    accessToken,
    token: idToken,
    establishment,
  }
}
