import { ContentTile } from '../../../@types/content'
import { JsonApiCollectionResponse } from '../../../data/jsonApiClient'
import { CMSContentNodeAttributes, CmsPaginatedContent } from '../types'
import mapContentToTiles from './mapContentToTiles'

const mapPaginatedContent = (
  response: JsonApiCollectionResponse<CMSContentNodeAttributes>,
): CmsPaginatedContent<ContentTile> => {
  return {
    data: mapContentToTiles(response),
    isLastPage: !response.links.next,
  }
}

export default mapPaginatedContent
