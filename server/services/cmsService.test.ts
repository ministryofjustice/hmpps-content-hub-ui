import JsonApiClient, { JsonApiCollectionResponse, JsonApiSingleResponse } from '../data/jsonApiClient'
import CmsService from './cmsService'
import {
  CMSContentNodeAttributes,
  CmsHomePageRelationships,
  CmsPrimaryNavigationAttributes,
  CmsTag,
  CmsTopicAttributes,
  CmsTopicPage,
  ExploreContent,
  UpdatesContent,
} from './cms/types'
import { unixTimestamp } from './cms/queries'
import { ContentTile } from '../@types/content'

jest.mock('../data/jsonApiClient')

describe('CmsService', () => {
  const jsonApiClient = new JsonApiClient(null, null) as jest.Mocked<JsonApiClient>
  let cmsService: CmsService

  beforeEach(() => {
    cmsService = new CmsService(jsonApiClient)
  })

  it('should fetch topics and map them into topic items', async () => {
    const expectedResponse: JsonApiCollectionResponse<CmsTopicAttributes> = {
      data: [
        {
          type: 'taxonomy_term--topics',
          id: 'topic-1',
          attributes: {
            drupal_internal__tid: 42,
            name: 'Education',
          },
        },
      ],
    }

    jsonApiClient.getCollectionByPath.mockResolvedValue(expectedResponse)

    const result = await cmsService.getTopics('bullingdon', 'en')

    expect(jsonApiClient.getCollectionByPath).toHaveBeenCalledWith(
      '/en/jsonapi/prison/bullingdon/taxonomy_term?filter%5Bvid.meta.drupal_internal__target_id%5D=topics&page%5Blimit%5D=100&sort=name&fields%5Btaxonomy_term--topics%5D=drupal_internal__tid%2Cname',
    )
    expect(result).toEqual([
      {
        id: '42',
        linkText: 'Education',
        href: '/tags/42',
      },
    ])
  })

  it('should fetch primary navigation and map it into navigation items', async () => {
    const expectedResponse: JsonApiCollectionResponse<CmsPrimaryNavigationAttributes> = {
      data: [
        {
          type: 'menu_link_content--menu_link_content',
          id: 'nav-1',
          attributes: {
            title: 'Home',
            url: '/home',
          },
        },
      ],
    }

    jsonApiClient.getCollectionByPath.mockResolvedValue(expectedResponse)

    const result = await cmsService.getPrimaryNavigation('bullingdon', 'en')

    expect(jsonApiClient.getCollectionByPath).toHaveBeenCalledWith(
      '/en/jsonapi/prison/bullingdon/primary_navigation?fields%5Bmenu_link_content--menu_link_content%5D=id%2Ctitle%2Curl',
    )
    expect(result).toEqual([
      {
        text: 'Home',
        href: '/home',
      },
    ])
  })

  it('should strip language prefixes from primary navigation links', async () => {
    const expectedResponse: JsonApiCollectionResponse<CmsPrimaryNavigationAttributes> = {
      data: [
        {
          type: 'menu_link_content--menu_link_content',
          id: 'nav-1',
          attributes: {
            title: 'Topics',
            url: 'en/tags/42',
          },
        },
      ],
    }

    jsonApiClient.getCollectionByPath.mockResolvedValue(expectedResponse)

    const result = await cmsService.getPrimaryNavigation('bullingdon', 'en')

    expect(result).toEqual([
      {
        text: 'Topics',
        href: '/tags/42',
      },
    ])
  })

  it('should fetch topic page data and map it into items', async () => {
    const termResponse: JsonApiCollectionResponse<{
      name: string
      description?: string
      drupal_internal__tid: number
    }> = {
      data: [
        {
          type: 'taxonomy_term--topics',
          id: 'uuid-1',
          attributes: {
            name: 'Education',
            drupal_internal__tid: 42,
            description: 'Topic description',
          },
        },
      ],
    }

    const nodeResponse: JsonApiCollectionResponse<{
      title: string
      field_summary?: string
      path?: { alias?: string }
    }> = {
      data: [
        {
          type: 'node--page',
          id: 'node-1',
          attributes: {
            title: 'Learning skills',
            field_summary: 'Improve your skills',
            path: { alias: '/content/123' },
          },
        },
      ],
    }

    jsonApiClient.getCollectionByPath.mockResolvedValueOnce(termResponse).mockResolvedValueOnce(nodeResponse)

    const result = (await cmsService.getTopicPage('bullingdon', '42', 'en')) as CmsTopicPage

    expect(jsonApiClient.getCollectionByPath).toHaveBeenCalledWith(
      '/en/jsonapi/prison/bullingdon/taxonomy_term?filter%5Bvid.meta.drupal_internal__target_id%5D=topics&filter%5Bdrupal_internal__tid%5D=42&page%5Blimit%5D=1&fields%5Btaxonomy_term--topics%5D=name%2Cdescription%2Cdrupal_internal__tid',
    )
    expect(result.topic.title).toEqual('Education')
    expect(result.items[0].title).toEqual('Learning skills')
  })

  it('should resolve tag type by taxonomy term id', async () => {
    const termResponse: JsonApiCollectionResponse<{
      name: string
      drupal_internal__tid: number
      description?: string
    }> = {
      data: [
        {
          type: 'taxonomy_term--series',
          id: 'uuid-1',
          attributes: {
            name: 'Induction',
            drupal_internal__tid: 99,
            description: 'Series description',
          },
        },
      ],
    }

    const seriesHeaderResponse: JsonApiSingleResponse<{ name: string; description?: { processed?: string } }> = {
      data: {
        type: 'taxonomy_term--series',
        id: 'uuid-1',
        attributes: {
          name: 'Induction',
          description: { processed: 'Series description' },
        },
      },
    }

    jsonApiClient.getCollectionByPath.mockResolvedValueOnce(termResponse).mockResolvedValueOnce({ data: [] })
    jsonApiClient.getSingleByPath.mockResolvedValueOnce(seriesHeaderResponse)

    const result = (await cmsService.getTag('bullingdon', '99', 'en')) as CmsTag

    expect(jsonApiClient.getCollectionByPath).toHaveBeenCalledWith(
      '/en/jsonapi/prison/bullingdon/taxonomy_term?filter%5Bdrupal_internal__tid%5D=99&page%5Blimit%5D=1&fields%5Btaxonomy_term--topics%5D=drupal_internal__tid%2Cname%2Cdescription&fields%5Btaxonomy_term--series%5D=drupal_internal__tid%2Cname%2Cdescription&fields%5Btaxonomy_term--moj_categories%5D=drupal_internal__tid%2Cname%2Cdescription',
    )
    expect(result).toEqual({
      id: '99',
      type: 'series',
      uuid: 'uuid-1',
      name: 'Induction',
      description: 'Series description',
      breadcrumbs: [],
      seriesHeaderImageUrl: undefined,
      seriesItems: [],
    })
  })
})

describe('homepage content queries', () => {
  const jsonApiClient = new JsonApiClient(null, null) as jest.Mocked<JsonApiClient>
  let cmsService: CmsService

  const mockContent: JsonApiCollectionResponse<CMSContentNodeAttributes> = {
    data: [
      {
        type: 'taxonomy_term--topics',
        id: 'topic-1',
        attributes: {
          drupal_internal__nid: 42,
          drupal_internal__tid: 42,
          title: 'test-title',
          field_summary: 'test-field-summary',
          field_display_url: 'test-field-display-url',
        },
        relationships: {
          field_moj_thumbnail_image: { data: { type: 'file--file', id: 'thumbnail-1' } },
        },
      },
    ],
    included: [
      {
        id: 'thumbnail-1',
        type: 'file--file',
        attributes: {
          image_style_uri: {
            tile_large: 'test-large-image',
            tile_small: 'test-small-image',
          },
        },
      },
    ],
    links: { self: { href: 'test-href' }, next: { href: 'next-href' } },
  }

  const expectedContentTile: ContentTile[] = [
    {
      id: 42,
      contentType: 'topics',
      externalContent: false,
      title: 'test-title',
      summary: 'test-field-summary',
      contentUrl: '/content/42',
      displayUrl: 'test-field-display-url',
      image: { url: 'test-small-image', alt: '' },
      isNew: false,
      publishedAt: undefined,
    },
  ]

  const mockHomePageNode: JsonApiCollectionResponse<CMSContentNodeAttributes, CmsHomePageRelationships> = {
    data: [
      {
        type: 'node--homepage',
        id: 'topic-1',
        attributes: {
          drupal_internal__nid: 42,
          drupal_internal__tid: 42,
          title: 'test-homepage',
          field_summary: '',
          field_display_url: '',
        },
        relationships: {
          field_featured_tiles: { data: [{ type: 'type--featured-tiles', id: 'featured-tiles-id' }] },
          field_key_info_tiles: { data: [{ type: 'type--key-info', id: 'key-info-id' }] },
          field_large_update_tile: { data: { type: 'type--large-update', id: 'large-update-id' } },
        },
      },
    ],
    included: [
      {
        type: 'type--featured-tiles',
        id: 'featured-tiles-id',
        attributes: {
          drupal_internal__nid: 1,
          drupal_internal__tid: 1,
          title: 'featured-tiles-title',
          field_summary: 'featured-tiles-summary',
          field_display_url: 'featured-tiles-display-url',
        },
      },
      {
        type: 'type--key-info',
        id: 'key-info-id',
        attributes: {
          drupal_internal__tid: 2,
          title: 'key-info-title',
          field_summary: 'key-info-summary',
          field_display_url: 'key-info-display-url',
        },
      },
      {
        type: 'type--large-update',
        id: 'large-update-id',
        attributes: {
          drupal_internal__nid: 3,
          title: 'large-update-title',
          field_summary: 'large-update-summary',
          field_display_url: 'large-update-display-url',
        },
      },
    ],
  }

  beforeEach(() => {
    cmsService = new CmsService(jsonApiClient)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should fetch homepage content', async () => {
    jsonApiClient.getCollectionByPath.mockResolvedValue(mockHomePageNode)

    const response = await cmsService.getHomepageContent('bullingdon', 'en')

    expect(jsonApiClient.getCollectionByPath).toHaveBeenCalledWith(
      '/en/jsonapi/prison/bullingdon/node/homepage?include=field_featured_tiles.field_moj_thumbnail_image%2Cfield_featured_tiles%2Cfield_large_update_tile%2Cfield_key_info_tiles%2Cfield_key_info_tiles.field_moj_thumbnail_image%2Cfield_large_update_tile.field_moj_thumbnail_image&page%5Blimit%5D=4&fields%5Bnode--field_featured_tiles%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_summary%2Cfield_moj_series%2Cpath%2Ctype.meta.drupal_internal__target_id%2Cpublished_at&fields%5Bnode--field_key_info_tiles%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_summary%2Cfield_moj_series%2Cpath%2Ctype.meta.drupal_internal__target_id%2Cpublished_at&fields%5Bfile--file%5D=drupal_internal__fid%2Cid%2Cimage_style_uri',
    )

    // Expect relationships to be mapped to the element in the included array with corresponding type and id
    expect(response.featuredContent.data.length).toBe(1)
    expect(response.featuredContent.data[0].contentType).toBe('featured-tiles')
    expect(response.featuredContent.data[0].id).toBe(1)

    expect(response.keyInfo.data.length).toBe(1)
    expect(response.keyInfo.data[0].contentType).toBe('key-info')
    expect(response.keyInfo.data[0].id).toBe(2)

    expect(response.largeUpdateTile.contentType).toBe('large-update')
    expect(response.largeUpdateTile.id).toBe(3)
  })

  it('should fetch recently added homepage content', async () => {
    jsonApiClient.getCollectionByPath.mockResolvedValue(mockContent)

    const response = await cmsService.getRecentlyAddedHomepageContent('bullingdon', 'en')

    expect(jsonApiClient.getCollectionByPath).toHaveBeenCalledWith(
      '/en/jsonapi/prison/bullingdon/recently-added?include=field_moj_thumbnail_image&page%5Blimit%5D=8&page%5Boffset%5D=0&sort=-published_at%2Ccreated&fields%5Bnode--page%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_summary%2Cfield_moj_series%2Cpath%2Ctype.meta.drupal_internal__target_id%2Cpublished_at&fields%5Bnode--moj_video_item%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_summary%2Cfield_moj_series%2Cpath%2Ctype.meta.drupal_internal__target_id%2Cpublished_at&fields%5Bnode--moj_radio_item%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_summary%2Cfield_moj_series%2Cpath%2Ctype.meta.drupal_internal__target_id%2Cpublished_at&fields%5Bnode--moj_pdf_item%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_summary%2Cfield_moj_series%2Cpath%2Ctype.meta.drupal_internal__target_id%2Cpublished_at&fields%5Bfile--file%5D=drupal_internal__fid%2Cid%2Cimage_style_uri',
    )

    expect(response).toStrictEqual(expectedContentTile)
  })

  it('should fetch recently added content', async () => {
    jsonApiClient.getCollectionByPath.mockResolvedValue(mockContent)

    const response = await cmsService.getRecentlyAddedContent('bullingdon', 'en')
    const expectedDate = unixTimestamp(14, new Date().setHours(0, 0, 0, 0))

    expect(jsonApiClient.getCollectionByPath).toHaveBeenCalledWith(
      `/en/jsonapi/prison/bullingdon/node?filter%5Btype.meta.drupal_internal__target_id%5D%5Bcondition%5D%5Bpath%5D=type.meta.drupal_internal__target_id&filter%5Btype.meta.drupal_internal__target_id%5D%5Bcondition%5D%5Bvalue%5D%5B0%5D=page&filter%5Btype.meta.drupal_internal__target_id%5D%5Bcondition%5D%5Bvalue%5D%5B1%5D=moj_video_item&filter%5Btype.meta.drupal_internal__target_id%5D%5Bcondition%5D%5Bvalue%5D%5B2%5D=moj_radio_item&filter%5Btype.meta.drupal_internal__target_id%5D%5Bcondition%5D%5Bvalue%5D%5B3%5D=moj_pdf_item&filter%5Btype.meta.drupal_internal__target_id%5D%5Bcondition%5D%5Boperator%5D=IN&filter%5Bcreated%5D%5Bvalue%5D=${expectedDate}&filter%5Bcreated%5D%5Boperator%5D=%3E%3D&include=field_moj_thumbnail_image&page%5Blimit%5D=8&page%5Boffset%5D=0&sort=-published_at%2Ccreated&fields%5Bnode--page%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_summary%2Cfield_moj_series%2Cpath%2Ctype.meta.drupal_internal__target_id%2Cpublished_at&fields%5Bnode--moj_video_item%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_summary%2Cfield_moj_series%2Cpath%2Ctype.meta.drupal_internal__target_id%2Cpublished_at&fields%5Bnode--moj_radio_item%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_summary%2Cfield_moj_series%2Cpath%2Ctype.meta.drupal_internal__target_id%2Cpublished_at&fields%5Bnode--moj_pdf_item%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_summary%2Cfield_moj_series%2Cpath%2Ctype.meta.drupal_internal__target_id%2Cpublished_at&fields%5Bfile--file%5D=drupal_internal__fid%2Cid%2Cimage_style_uri`,
    )

    expect(response).toStrictEqual({ data: expectedContentTile, isLastPage: false })
  })

  it('should fetch explore content', async () => {
    jsonApiClient.getCollectionByPath.mockResolvedValue(mockContent)

    const response = await cmsService.getExploreContent('bullingdon', 'en')

    expect(jsonApiClient.getCollectionByPath).toHaveBeenCalledWith(
      '/en/jsonapi/prison/bullingdon/explore/node?include=field_moj_thumbnail_image&page%5Blimit%5D=4&fields%5Bnode--page%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_summary%2Cfield_moj_series%2Cpath%2Ctype.meta.drupal_internal__target_id%2Cpublished_at&fields%5Bnode--moj_video_item%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_summary%2Cfield_moj_series%2Cpath%2Ctype.meta.drupal_internal__target_id%2Cpublished_at&fields%5Bnode--moj_radio_item%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_summary%2Cfield_moj_series%2Cpath%2Ctype.meta.drupal_internal__target_id%2Cpublished_at&fields%5Bnode--moj_pdf_item%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_summary%2Cfield_moj_series%2Cpath%2Ctype.meta.drupal_internal__target_id%2Cpublished_at',
    )

    const expectedExploreContent: ExploreContent = {
      data: expectedContentTile,
      isLastPage: false,
    }

    expect(response).toStrictEqual(expectedExploreContent)
  })

  it('should fetch updates content', async () => {
    jsonApiClient.getCollectionByPath.mockResolvedValue(mockContent)

    const response = await cmsService.getUpdatesContent('bullingdon', 'en')

    const expectedUnixTimeStamp = unixTimestamp(90, new Date().setHours(0, 0, 0, 0))
    expect(jsonApiClient.getCollectionByPath).toHaveBeenCalledWith(
      `/en/jsonapi/prison/bullingdon/node?filter%5B6%5D%5Bcondition%5D%5Bpath%5D=published_at&filter%5B6%5D%5Bcondition%5D%5Bvalue%5D=${expectedUnixTimeStamp}&filter%5B6%5D%5Bcondition%5D%5Boperator%5D=%3E%3D&filter%5B6%5D%5Bcondition%5D%5BmemberOf%5D=series_group&filter%5Bparent_or_group%5D%5Bgroup%5D%5Bconjunction%5D=OR&filter%5Bcategories_group%5D%5Bgroup%5D%5Bconjunction%5D=AND&filter%5Bcategories_group%5D%5Bgroup%5D%5BmemberOf%5D=parent_or_group&filter%5Bseries_group%5D%5Bgroup%5D%5Bconjunction%5D=AND&filter%5Bseries_group%5D%5Bgroup%5D%5BmemberOf%5D=parent_or_group&filter%5Bfield_moj_top_level_categories.field_is_homepage_updates%5D%5Bcondition%5D%5Bpath%5D=field_moj_top_level_categories.field_is_homepage_updates&filter%5Bfield_moj_top_level_categories.field_is_homepage_updates%5D%5Bcondition%5D%5Bvalue%5D=1&filter%5Bfield_moj_top_level_categories.field_is_homepage_updates%5D%5Bcondition%5D%5BmemberOf%5D=categories_group&filter%5Bpublished_at%5D%5Bcondition%5D%5Bpath%5D=published_at&filter%5Bpublished_at%5D%5Bcondition%5D%5Bvalue%5D=${expectedUnixTimeStamp}&filter%5Bpublished_at%5D%5Bcondition%5D%5Boperator%5D=%3E%3D&filter%5Bpublished_at%5D%5Bcondition%5D%5BmemberOf%5D=categories_group&filter%5Bfield_moj_series.field_is_homepage_updates%5D%5Bcondition%5D%5Bpath%5D=field_moj_series.field_is_homepage_updates&filter%5Bfield_moj_series.field_is_homepage_updates%5D%5Bcondition%5D%5Bvalue%5D=1&filter%5Bfield_moj_series.field_is_homepage_updates%5D%5Bcondition%5D%5BmemberOf%5D=series_group&include=field_moj_thumbnail_image&page%5Blimit%5D=5&page%5Boffset%5D=0&sort=-published_at%2Ccreated&fields%5Bnode--page%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_summary%2Cfield_moj_series%2Cpath%2Ctype.meta.drupal_internal__target_id%2Cpublished_at&fields%5Bnode--moj_video_item%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_summary%2Cfield_moj_series%2Cpath%2Ctype.meta.drupal_internal__target_id%2Cpublished_at&fields%5Bnode--moj_radio_item%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_summary%2Cfield_moj_series%2Cpath%2Ctype.meta.drupal_internal__target_id%2Cpublished_at&fields%5Bnode--moj_pdf_item%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_summary%2Cfield_moj_series%2Cpath%2Ctype.meta.drupal_internal__target_id%2Cpublished_at&fields%5Bfile--file%5D=drupal_internal__fid%2Cid%2Cimage_style_uri`,
    )

    const expectedUpdatesContent: UpdatesContent = {
      largeUpdateTileDefault: { ...expectedContentTile[0], image: { url: 'test-large-image', alt: '' } },
      updatesContent: expectedContentTile,
      isLastPage: false,
    }

    expect(response).toStrictEqual(expectedUpdatesContent)
  })
})
