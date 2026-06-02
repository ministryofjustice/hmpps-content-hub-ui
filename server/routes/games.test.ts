import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from './testutils/appSetup'
import AuditService, { Page } from '../services/auditService'
import AuditServiceSource from '../services/auditServiceSource'

jest.mock('../services/auditService')
jest.mock('../services/auditServiceSource')

const auditServiceSource = new AuditServiceSource(null) as jest.Mocked<AuditServiceSource>
const auditService = new AuditService(null) as jest.Mocked<AuditService>
let app: Express

beforeEach(() => {
  auditServiceSource.get.mockReturnValue(auditService)

  app = appWithAllRoutes({
    services: {
      auditServiceSource,
    },
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Games Routes', () => {
  describe('GET /games/2048', () => {
    it('should display the 2048 game', () => {
      return request(app)
        .get('/games/2048')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('2048')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.GAME_2048, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })

  describe('GET /games/fadingsnake', () => {
    it('should display the fadingsnake game', () => {
      return request(app)
        .get('/games/fadingsnake')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Fading Snake')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.GAME_FADING_SNAKE, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })

  describe('GET /games/sn4ke', () => {
    it('should display the snake game', () => {
      return request(app)
        .get('/games/sn4ke')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Sn4ke')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.GAME_SN4KE, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })

  describe('GET /games/anagramica', () => {
    it('Should display the anagramica game', () => {
      return request(app)
        .get('/games/anagramica')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Anagramica')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.GAME_ANAGRAMICA, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })

  // TODO: Fix scoring

  // describe('POST /games/anagramica', () => {
  //   it('should throw error showing route is functional', () => {
  //     return request(app)
  //       .post('/games/anagramica')
  //       .expect('Content-Type', /html/)
  //       .expect(500)
  //       .expect(res => {
  //         expect(res.text).toContain('Anagramica scoring route is functional - pending implementation')
  //         expect(auditService.logPageView).toHaveBeenCalledWith(Page.GAME_ANAGRAMICA_SCORE, {
  //           who: user.username,
  //           correlationId: expect.any(String),
  //         })
  //       })
  //   })
  // })

  describe('GET /games/chess', () => {
    it('should display chess', () => {
      return request(app)
        .get('/games/chess')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Chess')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.GAME_CHESS, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })

  describe('GET /games/sudoku', () => {
    it('should display sudoku', () => {
      return request(app)
        .get('/games/sudoku')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Sudoku')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.GAME_SUDOKU, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })

  describe('GET /games/neontroids', () => {
    it('should display neontroids', () => {
      return request(app)
        .get('/games/neontroids')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('neontroids')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.GAME_NEONTROIDS, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })

  describe('GET /games/mimstris', () => {
    it('should display the mimstris game', () => {
      return request(app)
        .get('/games/mimstris')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Mimstris')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.GAME_MIMSTRIS, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })

  describe('GET /games/invadersfromspace', () => {
    it('Should show the invaders from space game', () => {
      return request(app)
        .get('/games/invadersfromspace')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Invaders from Space')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.GAME_INVADERS_FROM_SPACE, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })

  describe('GET /games/crossword', () => {
    it('Should show the crossword game', () => {
      return request(app)
        .get('/games/crossword')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Crossword')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.GAME_CROSSWORD, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })

  describe('GET /games/christmas-crossword', () => {
    it('should throw error showing route is functional', () => {
      return request(app)
        .get('/games/christmas-crossword')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Christmas Crossword')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.GAME_CHRISTMAS_CROSSWORD, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })

  describe('GET /games/solitaire', () => {
    it('should throw error showing route is functional', () => {
      return request(app)
        .get('/games/solitaire')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Solitaire')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.GAME_SOLITAIRE, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })

  describe('GET /games/smashout', () => {
    it('Should render smashout game', () => {
      return request(app)
        .get('/games/smashout')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Smashout')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.GAME_SMASHOUT, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })
})
