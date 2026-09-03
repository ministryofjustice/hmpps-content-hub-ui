import HmppsAuditClient, { AuditEvent } from '../data/hmppsAuditClient'

export enum Page {
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
  GAME_2048 = 'GAME_2048',
  GAME_FADING_SNAKE = 'GAME_FADING_SNAKE',
  GAME_SN4KE = 'GAME_SN4KE',
  GAME_ANAGRAMICA = 'GAME_ANAGRAMICA',
  GAME_CHESS = 'GAME_CHESS',
  GAME_SUDOKU = 'GAME_SUDOKU',
  GAME_NEONTROIDS = 'GAME_NEONTROIDS',
  GAME_MIMSTRIS = 'GAME_MIMSTRIS',
  GAME_INVADERS_FROM_SPACE = 'GAME_INVADERS_FROM_SPACE',
  GAME_CROSSWORD = 'GAME_CROSSWORD',
  GAME_CHRISTMAS_CROSSWORD = 'GAME_CHRISTMAS_CROSSWORD',
  GAME_SOLITAIRE = 'GAME_SOLITAIRE',
  GAME_SMASHOUT = 'GAME_SMASHOUT',
  FEEDBACK = 'FEEDBACK',
  HELP = 'HELP',
  NOT_FOUND = 'NOT_FOUND',
  STAFF_PORTAL_UNAUTHORIZED = 'STAFF_PORTAL_UNAUTHORIZED',
  STAFF_CHANGE_PRISON = 'STAFF_CHANGE_PRISON',
}

export enum ErrorCode {
  'FORBIDDEN' = '403_FORBIDDEN',
}

interface EventDetails {
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

  async logPageView(page: Page, eventDetails: EventDetails) {
    await this.logAuditWithWhat(`PAGE_VIEW_${page}`, eventDetails)
  }

  async logError(error: ErrorCode, eventDetails: EventDetails) {
    await this.logAuditWithWhat(`ERROR_${error}`, eventDetails)
  }

  private async logAuditWithWhat(what: string, eventDetails: EventDetails) {
    const event: AuditEvent = { ...eventDetails, what }
    await this.logAuditEvent(event)
  }
}
