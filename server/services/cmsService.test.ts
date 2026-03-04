import JsonApiClient, { JsonApiCollectionResponse, JsonApiSingleResponse } from '../data/jsonApiClient'
import CmsService from './cmsService'
import { CmsPrimaryNavigationAttributes, CmsTag, CmsTopicAttributes, CmsTopicPage } from './cms/types'

jest.mock('../data/jsonApiClient')

describe('CmsService', () => {
  const jsonApiClient = new JsonApiClient(null) as jest.Mocked<JsonApiClient>
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
      '/en/jsonapi/prison/bullingdon/taxonomy_term?fields%5Btaxonomy_term--topics%5D=drupal_internal__tid%2Cname&filter%5Bvid.meta.drupal_internal__target_id%5D=topics&sort=name&page%5Blimit%5D=100',
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
      '/en/jsonapi/prison/bullingdon/taxonomy_term?fields%5Btaxonomy_term--topics%5D=name%2Cdescription%2Cdrupal_internal__tid&filter%5Bvid.meta.drupal_internal__target_id%5D=topics&filter%5Bdrupal_internal__tid%5D=42&page%5Blimit%5D=1',
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
      '/en/jsonapi/prison/bullingdon/taxonomy_term?fields%5Btaxonomy_term--topics%5D=drupal_internal__tid%2Cname%2Cdescription&fields%5Btaxonomy_term--series%5D=drupal_internal__tid%2Cname%2Cdescription&fields%5Btaxonomy_term--moj_categories%5D=drupal_internal__tid%2Cname%2Cdescription&filter%5Bdrupal_internal__tid%5D=99&page%5Blimit%5D=1',
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
