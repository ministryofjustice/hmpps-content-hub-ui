import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from './testutils/appSetup'
import AuditService, { Page } from '../services/auditService'
import i18next from '../i18n'

jest.mock('../services/auditService')

const auditService = new AuditService(null) as jest.Mocked<AuditService>

let app: Express

beforeAll(async () => {
  await i18next.isInitialized
})

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
    },
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Games Routes', () => {
  describe('GET /games/2048', () => {
    it('should throw error showing route is functional', () => {
      auditService.logPageView.mockResolvedValue(null)

      return request(app)
        .get('/games/2048')
        .expect('Content-Type', /html/)
        .expect(500)
        .expect(res => {
          expect(res.text).toContain('2048 game route is functional - pending implementation')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.GAME_2048, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })

  describe('GET /games/fadingsnake', () => {
    it('should throw error showing route is functional', () => {
      auditService.logPageView.mockResolvedValue(null)

      return request(app)
        .get('/games/fadingsnake')
        .expect('Content-Type', /html/)
        .expect(500)
        .expect(res => {
          expect(res.text).toContain('Fading Snake game route is functional - pending implementation')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.GAME_FADING_SNAKE, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })

  describe('GET /games/sn4ke', () => {
    it('should throw error showing route is functional', () => {
      auditService.logPageView.mockResolvedValue(null)

      return request(app)
        .get('/games/sn4ke')
        .expect('Content-Type', /html/)
        .expect(500)
        .expect(res => {
          expect(res.text).toContain('Sn4ke game route is functional - pending implementation')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.GAME_SN4KE, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })

  describe('GET /games/anagramica', () => {
    it('should throw error showing route is functional', () => {
      auditService.logPageView.mockResolvedValue(null)

      return request(app)
        .get('/games/anagramica')
        .expect('Content-Type', /html/)
        .expect(500)
        .expect(res => {
          expect(res.text).toContain('Anagramica game route is functional - pending implementation')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.GAME_ANAGRAMICA, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })

  describe('POST /games/anagramica', () => {
    it('should throw error showing route is functional', () => {
      auditService.logPageView.mockResolvedValue(null)

      return request(app)
        .post('/games/anagramica')
        .expect('Content-Type', /html/)
        .expect(500)
        .expect(res => {
          expect(res.text).toContain('Anagramica scoring route is functional - pending implementation')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.GAME_ANAGRAMICA_SCORE, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })

  describe('GET /games/chess', () => {
    it('should throw error showing route is functional', () => {
      auditService.logPageView.mockResolvedValue(null)

      return request(app)
        .get('/games/chess')
        .expect('Content-Type', /html/)
        .expect(500)
        .expect(res => {
          expect(res.text).toContain('Chess game route is functional - pending implementation')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.GAME_CHESS, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })

  describe('GET /games/sudoku', () => {
    it('should throw error showing route is functional', () => {
      auditService.logPageView.mockResolvedValue(null)

      return request(app)
        .get('/games/sudoku')
        .expect('Content-Type', /html/)
        .expect(500)
        .expect(res => {
          expect(res.text).toContain('Sudoku game route is functional - pending implementation')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.GAME_SUDOKU, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })

  describe('GET /games/neontroids', () => {
    it('should throw error showing route is functional', () => {
      auditService.logPageView.mockResolvedValue(null)

      return request(app)
        .get('/games/neontroids')
        .expect('Content-Type', /html/)
        .expect(500)
        .expect(res => {
          expect(res.text).toContain('Neontroids game route is functional - pending implementation')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.GAME_NEONTROIDS, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })

  describe('GET /games/mimstris', () => {
    it('should throw error showing route is functional', () => {
      auditService.logPageView.mockResolvedValue(null)

      return request(app)
        .get('/games/mimstris')
        .expect('Content-Type', /html/)
        .expect(500)
        .expect(res => {
          expect(res.text).toContain('Mimstris game route is functional - pending implementation')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.GAME_MIMSTRIS, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })

  describe('GET /games/invadersfromspace', () => {
    it('should throw error showing route is functional', () => {
      auditService.logPageView.mockResolvedValue(null)

      return request(app)
        .get('/games/invadersfromspace')
        .expect('Content-Type', /html/)
        .expect(500)
        .expect(res => {
          expect(res.text).toContain('Invaders from Space game route is functional - pending implementation')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.GAME_INVADERS_FROM_SPACE, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })

  describe('GET /games/crossword', () => {
    it('should throw error showing route is functional', () => {
      auditService.logPageView.mockResolvedValue(null)

      return request(app)
        .get('/games/crossword')
        .expect('Content-Type', /html/)
        .expect(500)
        .expect(res => {
          expect(res.text).toContain('Crossword game route is functional - pending implementation')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.GAME_CROSSWORD, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })

  describe('GET /games/christmas-crossword', () => {
    it('should throw error showing route is functional', () => {
      auditService.logPageView.mockResolvedValue(null)

      return request(app)
        .get('/games/christmas-crossword')
        .expect('Content-Type', /html/)
        .expect(500)
        .expect(res => {
          expect(res.text).toContain('Christmas Crossword game route is functional - pending implementation')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.GAME_CHRISTMAS_CROSSWORD, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })

  describe('GET /games/solitaire', () => {
    it('should throw error showing route is functional', () => {
      auditService.logPageView.mockResolvedValue(null)

      return request(app)
        .get('/games/solitaire')
        .expect('Content-Type', /html/)
        .expect(500)
        .expect(res => {
          expect(res.text).toContain('Solitaire game route is functional - pending implementation')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.GAME_SOLITAIRE, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })

  describe('GET /games/smashout', () => {
    it('should throw error showing route is functional', () => {
      auditService.logPageView.mockResolvedValue(null)

      return request(app)
        .get('/games/smashout')
        .expect('Content-Type', /html/)
        .expect(500)
        .expect(res => {
          expect(res.text).toContain('Smashout game route is functional - pending implementation')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.GAME_SMASHOUT, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })
})
