import HmppsAuditClient, { AuditEvent } from '../data/hmppsAuditClient'

export enum Page {
  EXAMPLE_PAGE = 'EXAMPLE_PAGE',
  HOMEPAGE = 'HOMEPAGE',
  TOPICS = 'TOPICS',
  TAG = 'TAG',
  TAG_JSON = 'TAG_JSON',
  CONTENT = 'CONTENT',
  SEARCH = 'SEARCH',
  SEARCH_SUGGEST = 'SEARCH_SUGGEST',
  RECENTLY_ADDED = 'RECENTLY_ADDED',
  RECENTLY_ADDED_JSON = 'RECENTLY_ADDED_JSON',
  UPDATES = 'UPDATES',
  UPDATES_JSON = 'UPDATES_JSON',
  NPR = 'NPR',
  LINK = 'LINK',
}

export interface PageViewEventDetails {
  who: string
  subjectId?: string
  subjectType?: string
  correlationId?: string
  details?: object
}

export default class AuditService {
  constructor(private readonly hmppsAuditClient: HmppsAuditClient) {}

  async logAuditEvent(event: AuditEvent) {
    await this.hmppsAuditClient.sendMessage(event)
  }

  async logPageView(page: Page, eventDetails: PageViewEventDetails) {
    const event: AuditEvent = {
      ...eventDetails,
      what: `PAGE_VIEW_${page}`,
    }
    await this.hmppsAuditClient.sendMessage(event)
  }
}
