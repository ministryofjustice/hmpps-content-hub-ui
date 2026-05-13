import nock from 'nock'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import JsonApiClient from './jsonApiClient'
import config from '../config'
import { InMemoryCache } from '../services/cache/inMemoryCache'

describe('JsonApiClient', () => {
  let jsonApiClient: JsonApiClient
  let mockAuthenticationClient: jest.Mocked<AuthenticationClient>

  beforeEach(() => {
    mockAuthenticationClient = {
      getToken: jest.fn().mockResolvedValue('test-system-token'),
    } as unknown as jest.Mocked<AuthenticationClient>

    jsonApiClient = new JsonApiClient(mockAuthenticationClient, aCacheWith({}))
  })

  afterEach(() => {
    nock.cleanAll()
    jest.resetAllMocks()
  })

  describe('getCollection', () => {
    beforeEach(() => {
      nock(config.apis.cmsApi.url)
        .get('/jsonapi/node/article')
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, { data: [{ type: 'node--article', id: 'article-1', attributes: { title: 'Hello Drupal' } }] })
    })

    it('should request the Drupal JSON:API collection and return the response body', async () => {
      const response = await jsonApiClient.getCollection<{ title: string }>('node/article')

      expect(response.data[0].attributes.title).toEqual('Hello Drupal')
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledTimes(1)
    })

    describe('when the result is already cached', () => {
      beforeEach(() => {
        jsonApiClient = new JsonApiClient(
          mockAuthenticationClient,
          aCacheWith({ 'getCollection:node/article': 'CACHED RESULT' }),
        )
      })

      it('does not request again', async () => {
        await jsonApiClient.getCollection<{ title: string }>('node/article')
        expect(mockAuthenticationClient.getToken).toHaveBeenCalledTimes(0)
      })

      it('returns the cached value', async () => {
        const result = await jsonApiClient.getCollection<{ title: string }>('node/article')
        expect(result).toEqual('CACHED RESULT')
      })
    })
  })

  describe('getCollectionByPath', () => {
    beforeEach(() => {
      nock(config.apis.cmsApi.url)
        .get('/en/jsonapi/prison/bullingdon/taxonomy_term?sort=name')
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, {
          data: [
            {
              type: 'taxonomy_term--topics',
              id: 'topic-1',
              attributes: { drupal_internal__tid: 1, name: 'Education' },
            },
          ],
        })
    })

    it('should request the provided path and return the response body', async () => {
      const response = await jsonApiClient.getCollectionByPath<{ drupal_internal__tid: number; name: string }>(
        '/en/jsonapi/prison/bullingdon/taxonomy_term?sort=name',
      )

      expect(response.data[0].attributes.name).toEqual('Education')
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledTimes(1)
    })

    describe('when the result is already cached', () => {
      beforeEach(() => {
        jsonApiClient = new JsonApiClient(
          mockAuthenticationClient,
          aCacheWith({
            'getCollectionByPath:/en/jsonapi/prison/bullingdon/taxonomy_term?sort=name': 'CACHED RESULT FOR TERM',
            'getCollectionByPath:/en/jsonapi/prison/bullingdon/taxonomy_term?sort=somethingElse':
              'CACHED RESULT FOR TERM (sorted by something else)',
          }),
        )
      })

      it('does not request again', async () => {
        await jsonApiClient.getCollectionByPath<{ drupal_internal__tid: number; name: string }>(
          '/en/jsonapi/prison/bullingdon/taxonomy_term?sort=name',
        )
        expect(mockAuthenticationClient.getToken).toHaveBeenCalledTimes(0)
      })

      it('returns the cached value', async () => {
        let result = await jsonApiClient.getCollectionByPath<{ drupal_internal__tid: number; name: string }>(
          '/en/jsonapi/prison/bullingdon/taxonomy_term?sort=name',
        )
        expect(result).toEqual('CACHED RESULT FOR TERM')

        result = await jsonApiClient.getCollectionByPath<{ drupal_internal__tid: number; name: string }>(
          '/en/jsonapi/prison/bullingdon/taxonomy_term?sort=somethingElse',
        )
        expect(result).toEqual('CACHED RESULT FOR TERM (sorted by something else)')
      })
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

    describe('when the result is already cached', () => {
      beforeEach(() => {
        jsonApiClient = new JsonApiClient(
          mockAuthenticationClient,
          aCacheWith({
            'getLookupByPath:/router/prison/bullingdon/translate-path?path=link/42': 'CACHED RESULT FOR TERM',
            'getLookupByPath:/router/prison/bullingdon/translate-path?path=link/43': 'CACHED RESULT FOR TERM (43)',
          }),
        )
      })

      it('does not request again', async () => {
        await jsonApiClient.getLookupByPath('/router/prison/bullingdon/translate-path?path=link/42')
        expect(mockAuthenticationClient.getToken).toHaveBeenCalledTimes(0)
      })

      it('returns the cached value', async () => {
        let result = await jsonApiClient.getLookupByPath('/router/prison/bullingdon/translate-path?path=link/42')
        expect(result).toEqual('CACHED RESULT FOR TERM')

        result = await jsonApiClient.getLookupByPath('/router/prison/bullingdon/translate-path?path=link/43')
        expect(result).toEqual('CACHED RESULT FOR TERM (43)')
      })
    })
  })

  const aCacheWith = (entries: Record<string, string>) => {
    const cache = new InMemoryCache()
    Object.entries(entries).forEach(([key, value]) => cache.cached<string>(key, async () => value))
    return cache
  }
})
