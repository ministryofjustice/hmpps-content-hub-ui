import { JsonApiCollectionResponse } from '../../../data/jsonApiClient'
import { CMSContentNodeAttributes, UpdatesContent } from '../types'
import mapContentTile from './mapContentTile'
import mapContentToTiles from './mapContentToTiles'

const mapUpdatesContent = (response: JsonApiCollectionResponse<CMSContentNodeAttributes>): UpdatesContent => {
  return {
    largeUpdateTileDefault: mapContentTile(response.data[0], response.included, 'large'),
    updatesContent: mapContentToTiles(response),
    isLastPage: !response.links.next,
  }
}

export default mapUpdatesContent
