import nock from 'nock'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import JsonApiClient from './jsonApiClient'
import config from '../config'

describe('JsonApiClient', () => {
  let jsonApiClient: JsonApiClient
  let mockAuthenticationClient: jest.Mocked<AuthenticationClient>

  beforeEach(() => {
    mockAuthenticationClient = {
      getToken: jest.fn().mockResolvedValue('test-system-token'),
    } as unknown as jest.Mocked<AuthenticationClient>

    jsonApiClient = new JsonApiClient(mockAuthenticationClient)
  })

  afterEach(() => {
    nock.cleanAll()
    jest.resetAllMocks()
  })

  describe('getCollection', () => {
    it('should request the Drupal JSON:API collection and return the response body', async () => {
      nock(config.apis.cmsApi.url)
        .get('/jsonapi/node/article')
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, {
          data: [
            {
              type: 'node--article',
              id: 'article-1',
              attributes: {
                title: 'Hello Drupal',
              },
            },
          ],
        })

      const response = await jsonApiClient.getCollection<{ title: string }>('node/article')

      expect(response.data[0].attributes.title).toEqual('Hello Drupal')
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledTimes(1)
    })
  })

  describe('getCollectionByPath', () => {
    it('should request the provided path and return the response body', async () => {
      nock(config.apis.cmsApi.url)
        .get('/en/jsonapi/prison/bullingdon/taxonomy_term?sort=name')
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, {
          data: [
            {
              type: 'taxonomy_term--topics',
              id: 'topic-1',
              attributes: {
                drupal_internal__tid: 1,
                name: 'Education',
              },
            },
          ],
        })

      const response = await jsonApiClient.getCollectionByPath<{ drupal_internal__tid: number; name: string }>(
        '/en/jsonapi/prison/bullingdon/taxonomy_term?sort=name',
      )

      expect(response.data[0].attributes.name).toEqual('Education')
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledTimes(1)
    })
  })

  describe('getLookupByPath', () => {
    it('should request the provided path and return the response body', async () => {
      nock(config.apis.cmsApi.url)
        .get('/router/prison/bullingdon/translate-path?path=link/42')
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, {
          entity: {
            canonical: 'json-api-url',
            type: 'node',
            bundle: 'link',
            id: '42',
            uuid: 'test-uuid',
          },
        })

      const response = await jsonApiClient.getLookupByPath('/router/prison/bullingdon/translate-path?path=link/42')

      expect(response.entity.uuid).toEqual('test-uuid')
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledTimes(1)
    })
  })
})
