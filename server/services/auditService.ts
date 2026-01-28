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
  GAME_2048 = 'GAME_2048',
  GAME_FADING_SNAKE = 'GAME_FADING_SNAKE',
  GAME_SN4KE = 'GAME_SN4KE',
  GAME_ANAGRAMICA = 'GAME_ANAGRAMICA',
  GAME_ANAGRAMICA_SCORE = 'GAME_ANAGRAMICA_SCORE',
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
