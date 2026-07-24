import { JsonApiSingleResponse } from '../../../data/jsonApiClient'
import { CmsFileAttributes, CmsPdfContent, CmsPdfNodeAttributes } from '../types'
import { findIncluded, relationshipDataArray } from '../utils'

const mapPdfContent = (response: JsonApiSingleResponse<CmsPdfNodeAttributes>): CmsPdfContent => {
  const { data, included } = response
  const pdfIdentifier = relationshipDataArray(data.relationships?.field_moj_pdf)[0]
  const pdf = findIncluded<CmsFileAttributes>(included, pdfIdentifier)

  return {
    contentType: 'pdf',
    url: pdf.attributes.uri.url,
  }
}

export default mapPdfContent
