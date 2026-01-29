import { Router, Request, Response, NextFunction } from 'express'
import type { Services } from '../services'
import { Page } from '../services/auditService'

export default function gamesRoutes({ auditService }: Services): Router {
  const router = Router()

  router.get('/games/2048', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditService.logPageView(Page.GAME_2048, {
        who: res.locals.user?.username,
        correlationId: req.id,
      })

      throw new Error('2048 game route is functional - pending implementation')
    } catch (error) {
      next(error)
    }
  })

  router.get('/games/fadingsnake', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditService.logPageView(Page.GAME_FADING_SNAKE, {
        who: res.locals.user?.username,
        correlationId: req.id,
      })

      throw new Error('Fading Snake game route is functional - pending implementation')
    } catch (error) {
      next(error)
    }
  })

  router.get('/games/sn4ke', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditService.logPageView(Page.GAME_SN4KE, {
        who: res.locals.user?.username,
        correlationId: req.id,
      })

      throw new Error('Sn4ke game route is functional - pending implementation')
    } catch (error) {
      next(error)
    }
  })

  router.get('/games/anagramica', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditService.logPageView(Page.GAME_ANAGRAMICA, {
        who: res.locals.user?.username,
        correlationId: req.id,
      })

      throw new Error('Anagramica game route is functional - pending implementation')
    } catch (error) {
      next(error)
    }
  })

  router.post('/games/anagramica', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditService.logPageView(Page.GAME_ANAGRAMICA_SCORE, {
        who: res.locals.user?.username,
        correlationId: req.id,
      })

      throw new Error('Anagramica scoring route is functional - pending implementation')
    } catch (error) {
      next(error)
    }
  })

  router.get('/games/chess', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditService.logPageView(Page.GAME_CHESS, {
        who: res.locals.user?.username,
        correlationId: req.id,
      })

      throw new Error('Chess game route is functional - pending implementation')
    } catch (error) {
      next(error)
    }
  })

  router.get('/games/sudoku', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditService.logPageView(Page.GAME_SUDOKU, {
        who: res.locals.user?.username,
        correlationId: req.id,
      })

      throw new Error('Sudoku game route is functional - pending implementation')
    } catch (error) {
      next(error)
    }
  })

  router.get('/games/neontroids', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditService.logPageView(Page.GAME_NEONTROIDS, {
        who: res.locals.user?.username,
        correlationId: req.id,
      })

      throw new Error('Neontroids game route is functional - pending implementation')
    } catch (error) {
      next(error)
    }
  })

  router.get('/games/mimstris', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditService.logPageView(Page.GAME_MIMSTRIS, {
        who: res.locals.user?.username,
        correlationId: req.id,
      })

      throw new Error('Mimstris game route is functional - pending implementation')
    } catch (error) {
      next(error)
    }
  })

  router.get('/games/invadersfromspace', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditService.logPageView(Page.GAME_INVADERS_FROM_SPACE, {
        who: res.locals.user?.username,
        correlationId: req.id,
      })

      throw new Error('Invaders from Space game route is functional - pending implementation')
    } catch (error) {
      next(error)
    }
  })

  router.get('/games/crossword', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditService.logPageView(Page.GAME_CROSSWORD, {
        who: res.locals.user?.username,
        correlationId: req.id,
      })

      throw new Error('Crossword game route is functional - pending implementation')
    } catch (error) {
      next(error)
    }
  })

  router.get('/games/christmas-crossword', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditService.logPageView(Page.GAME_CHRISTMAS_CROSSWORD, {
        who: res.locals.user?.username,
        correlationId: req.id,
      })

      throw new Error('Christmas Crossword game route is functional - pending implementation')
    } catch (error) {
      next(error)
    }
  })

  router.get('/games/solitaire', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditService.logPageView(Page.GAME_SOLITAIRE, {
        who: res.locals.user?.username,
        correlationId: req.id,
      })

      throw new Error('Solitaire game route is functional - pending implementation')
    } catch (error) {
      next(error)
    }
  })

  router.get('/games/smashout', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditService.logPageView(Page.GAME_SMASHOUT, {
        who: res.locals.user?.username,
        correlationId: req.id,
      })

      throw new Error('Smashout game route is functional - pending implementation')
    } catch (error) {
      next(error)
    }
  })

  return router
}
