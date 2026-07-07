import { ContentTile } from '../../../@types/content'
import { JsonApiCollectionResponse } from '../../../data/jsonApiClient'
import { CMSContentNodeAttributes } from '../types'
import mapContentTile from './mapContentTile'

const mapContentToTiles = (response: JsonApiCollectionResponse<CMSContentNodeAttributes>): ContentTile[] =>
  response.data.map(item => mapContentTile(item, response.included))

export default mapContentToTiles
