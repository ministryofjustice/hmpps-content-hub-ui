import { CmsUrgentBanner } from '../types'
import mapUrgentBanner from './mapUrgentBanner'

describe('map urgent banner', () => {
  const item = {
    type: 'node--page',
    id: 'node-1',
    attributes: {
      drupal_internal__nid: 1,
      title: 'title',
      created: 'created',
      changed: 'changed',
      unpublish_on: '2020-01-01T00:00:00',
    },
    relationships: {
      field_more_info_page: { data: { type: 'file--file', id: 'more-info' } },
    },
  }
  const included = [
    {
      type: 'file--file',
      id: 'more-info',
      attributes: { path: { alias: 'urgent-banner-path' } },
    },
  ]

  it('maps an urgent banner', () => {
    const expectedResult: CmsUrgentBanner = {
      title: 'title',
      moreInfoLink: 'urgent-banner-path',
      unpublishOn: 1577836800000,
    }

    expect(mapUrgentBanner(item, included)).toEqual(expectedResult)
  })

  it('maps an urgent banner without the link or unpublish date when fields not present', () => {
    const expectedResult: CmsUrgentBanner = {
      title: 'title',
      moreInfoLink: null,
      unpublishOn: null,
    }

    item.attributes.unpublish_on = null

    expect(mapUrgentBanner(item, null)).toEqual(expectedResult)
  })
})
