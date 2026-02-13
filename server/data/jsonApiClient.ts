import { RestClient, asSystem } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import logger from '../../logger'

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

export default class JsonApiClient extends RestClient {
  private readonly basePath = '/jsonapi'

  constructor(authenticationClient: AuthenticationClient) {
    super('Drupal JSON:API', config.apis.cmsApi, logger, authenticationClient)
  }

  private buildPath(resourcePath: string) {
    const trimmedPath = resourcePath.replace(/^\/+/, '')
    return `${this.basePath}/${trimmedPath}`
  }

  private normalizePath(path: string) {
    return path.startsWith('/') ? path : `/${path}`
  }

  getCollection<TAttributes, TRelationships extends JsonApiRelationships = JsonApiRelationships>(resourcePath: string) {
    return this.get<JsonApiCollectionResponse<TAttributes, TRelationships>>(
      { path: this.buildPath(resourcePath) },
      asSystem(),
    )
  }

  getCollectionByPath<TAttributes, TRelationships extends JsonApiRelationships = JsonApiRelationships>(path: string) {
    return this.get<JsonApiCollectionResponse<TAttributes, TRelationships>>(
      { path: this.normalizePath(path) },
      asSystem(),
    )
  }

  getSingle<TAttributes, TRelationships extends JsonApiRelationships = JsonApiRelationships>(resourcePath: string) {
    return this.get<JsonApiSingleResponse<TAttributes, TRelationships>>(
      { path: this.buildPath(resourcePath) },
      asSystem(),
    )
  }

  getSingleByPath<TAttributes, TRelationships extends JsonApiRelationships = JsonApiRelationships>(path: string) {
    return this.get<JsonApiSingleResponse<TAttributes, TRelationships>>({ path: this.normalizePath(path) }, asSystem())
  }
}
