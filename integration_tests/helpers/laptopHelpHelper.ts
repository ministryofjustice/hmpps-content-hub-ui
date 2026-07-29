import cmsApi from '../mockApis/cmsApi'
import {
  LAPTOP_HELP_BREADCRUMBS,
  LAPTOP_HELP_DESCRIPTION,
  LAPTOP_HELP_NID,
  LAPTOP_HELP_TITLE,
  LAPTOP_HELP_UUID,
} from '../fixtures/laptopHelpPageData'

export const stubLaptopHelpPage = async () => {
  await Promise.all([
    cmsApi.stubContentLookupByNid({ nid: LAPTOP_HELP_NID, uuid: LAPTOP_HELP_UUID }),
    cmsApi.stubPageContentByUuid({
      uuid: LAPTOP_HELP_UUID,
      nid: LAPTOP_HELP_NID,
      title: LAPTOP_HELP_TITLE,
      description: LAPTOP_HELP_DESCRIPTION,
      breadcrumbs: LAPTOP_HELP_BREADCRUMBS,
    }),
  ])
}
