import { RestClient, asSystem } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import logger from '../../logger'
import { Cache } from '../services/cache'

export type JsonApiLinkObject = {
  href: string
  meta?: Record<string, unknown>
}

export type JsonApiLink = string | JsonApiLinkObject

export type JsonApiLinks = Record<string, JsonApiLink>

export type JsonApiMeta = Record<string, unknown>

export interface JsonApiResourceIdentifier {
  type: string
  id: string
}

export interface JsonApiRelationship {
  data: JsonApiResourceIdentifier | JsonApiResourceIdentifier[] | null
  links?: JsonApiLinks
  meta?: JsonApiMeta
}

export type JsonApiRelationships = Record<string, JsonApiRelationship>

export interface JsonApiResource<
  TAttributes = Record<string, unknown>,
  TRelationships extends JsonApiRelationships = JsonApiRelationships,
> {
  type: string
  id: string
  attributes: TAttributes
  relationships?: TRelationships
  links?: JsonApiLinks
  meta?: JsonApiMeta
}

export interface JsonApiCollectionResponse<
  TAttributes = Record<string, unknown>,
  TRelationships extends JsonApiRelationships = JsonApiRelationships,
> {
  data: Array<JsonApiResource<TAttributes, TRelationships>>
  links?: JsonApiLinks
  meta?: JsonApiMeta
  included?: Array<JsonApiResource>
}

export interface JsonApiSingleResponse<
  TAttributes = Record<string, unknown>,
  TRelationships extends JsonApiRelationships = JsonApiRelationships,
> {
  data: JsonApiResource<TAttributes, TRelationships>
  links?: JsonApiLinks
  meta?: JsonApiMeta
  included?: Array<JsonApiResource>
}

export interface JsonApiLookupResponse {
  resolved?: string
  isExternal?: boolean
  isHomePath?: boolean
  entity: JsonApiLookupEntity
  label?: string
  jsonapi?: Record<string, string>
  meta?: JsonApiMeta
}

interface JsonApiLookupEntity {
  canonical: string
  type: string
  bundle: string
  id: string
  uuid: string
}

export default class JsonApiClient extends RestClient {
  private readonly basePath = '/jsonapi'

  private readonly cache: Cache

  constructor(authenticationClient: AuthenticationClient, cache: Cache) {
    super('Drupal JSON:API', config.apis.cmsApi, logger, authenticationClient)
    this.cache = cache
  }

  private buildPath(resourcePath: string) {
    const trimmedPath = resourcePath.replace(/^\/+/, '')
    return `${this.basePath}/${trimmedPath}`
  }

  private normalizePath(path: string) {
    return path.startsWith('/') ? path : `/${path}`
  }

  getCollection<TAttributes, TRelationships extends JsonApiRelationships = JsonApiRelationships>(resourcePath: string) {
    return this.cache.cached(`getCollection:${encodeURI(resourcePath)}`, () => {
      return this.get<JsonApiCollectionResponse<TAttributes, TRelationships>>(
        { path: this.buildPath(resourcePath) },
        asSystem(),
      )
    })
  }

  getCollectionByPath<TAttributes, TRelationships extends JsonApiRelationships = JsonApiRelationships>(path: string) {
    return this.cache.cached(`getCollectionByPath:${encodeURI(path)}`, () => {
      return this.get<JsonApiCollectionResponse<TAttributes, TRelationships>>(
        { path: this.normalizePath(path) },
        asSystem(),
      )
    })
  }

  getSingle<TAttributes, TRelationships extends JsonApiRelationships = JsonApiRelationships>(resourcePath: string) {
    return this.cache.cached(`getSingle:${encodeURI(resourcePath)}`, () => {
      return this.get<JsonApiSingleResponse<TAttributes, TRelationships>>(
        { path: this.buildPath(resourcePath) },
        asSystem(),
      )
    })
  }

  getSingleByPath<TAttributes, TRelationships extends JsonApiRelationships = JsonApiRelationships>(path: string) {
    return this.cache.cached(`getSingleByPath:${encodeURI(path)}`, () => {
      return this.get<JsonApiSingleResponse<TAttributes, TRelationships>>(
        { path: this.normalizePath(path) },
        asSystem(),
      )
    })
  }

  getLookupByPath(path: string) {
    return this.cache.cached(`getLookupByPath:${encodeURI(path)}`, () => {
      return this.get<JsonApiLookupResponse>({ path: this.normalizePath(path) }, asSystem())
    })
  }
}
