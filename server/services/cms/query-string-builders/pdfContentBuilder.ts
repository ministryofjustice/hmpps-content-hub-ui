import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { PDF_CONTENT_FIELDS } from '../constants'

const buildPdfContentQueryString = () =>
  new DrupalJsonApiParams()
    .addFields('node--moj_pdf_item', PDF_CONTENT_FIELDS)
    .addInclude(['field_moj_pdf'])
    .getQueryString()

export default buildPdfContentQueryString
