import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

const PDF_CONTENT_FIELDS = ['field_moj_pdf']

const buildPdfContentQueryString = () =>
  new DrupalJsonApiParams()
    .addFields('node--moj_pdf_item', PDF_CONTENT_FIELDS)
    .addInclude(['field_moj_pdf'])
    .getQueryString()

export default buildPdfContentQueryString
