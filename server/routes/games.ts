import { Router, Request, Response, NextFunction } from 'express'
import type { Services } from '../services'
import { Page } from '../services/auditService'

import config from '../config'
// import toAlpha from '../..assets/js/games/anagramica/lib/helpers.js'
// import Finder from '../../assets/js/games/anagramica/lib/finder.js'

const GAMES_BREADCRUMBS = [
  { href: '/', text: 'Home' },
  { href: config.knownPages.inspireAndEntertain, text: 'Inspire and entertain' },
  { href: config.knownPages.games, text: 'Games' },
]

export default function gamesRoutes({ auditServiceSource }: Services): Router {
  const router = Router()

  router.get('/games/2048', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditServiceSource.get(req.portalType).logPageView(Page.GAME_2048, {
        who: res.locals.user?.username,
        correlationId: req.id,
      })

      res.render('pages/games/2048', {
        breadcrumbs: GAMES_BREADCRUMBS,
      })
    } catch (error) {
      next(error)
    }
  })

  router.get('/games/fadingsnake', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditServiceSource.get(req.portalType).logPageView(Page.GAME_FADING_SNAKE, {
        who: res.locals.user?.username,
        correlationId: req.id,
      })

      res.render('pages/games/fading-snake', {
        breadcrumbs: GAMES_BREADCRUMBS,
      })
    } catch (error) {
      next(error)
    }
  })

  router.get('/games/sn4ke', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditServiceSource.get(req.portalType).logPageView(Page.GAME_SN4KE, {
        who: res.locals.user?.username,
        correlationId: req.id,
      })

      res.render('pages/games/sn4ke', {
        breadcrumbs: GAMES_BREADCRUMBS,
      })
    } catch (error) {
      next(error)
    }
  })

  router.get('/games/anagramica', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditServiceSource.get(req.portalType).logPageView(Page.GAME_ANAGRAMICA, {
        who: res.locals.user?.username,
        correlationId: req.id,
      })

      res.render('pages/games/anagramica', {
        breadcrumbs: GAMES_BREADCRUMBS,
        cspNonce: res.locals.cspNonce,
      })
    } catch (error) {
      next(error)
    }
  })
  // TODO: Fix scoring

  // router.post('/games/anagramica', async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     await auditServiceSource.get(req.portalType).logPageView(Page.GAME_ANAGRAMICA_SCORE, {
  //       who: res.locals.user?.username,
  //       correlationId: req.id,
  //     })

  //     const { letters, words = [] } = req.body
  //     console.log(letters, words)
  //     const best = Finder.best(toAlpha(letters))
  //     const scores = Array.isArray(words)
  //       ? words.reduce((total, rawWord) => {
  //           const word = toAlpha(rawWord)
  //           return Object.assign(total, { [word]: Finder.find(word) })
  //         }, {})
  //       : {}
  //     return res.send({
  //       best,
  //       scores,
  //       letters,
  //     })
  //   } catch (error) {
  //     next(error)
  //   }
  // })

  router.get('/games/chess', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditServiceSource.get(req.portalType).logPageView(Page.GAME_CHESS, {
        who: res.locals.user?.username,
        correlationId: req.id,
      })

      res.render('pages/games/chess', {
        breadcrumbs: GAMES_BREADCRUMBS,
        chessGuideHref: config.knownPages.chessGuide,
        cspNonce: res.locals.cspNonce,
      })
    } catch (error) {
      next(error)
    }
  })

  router.get('/games/sudoku', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditServiceSource.get(req.portalType).logPageView(Page.GAME_SUDOKU, {
        who: res.locals.user?.username,
        correlationId: req.id,
      })

      res.render('pages/games/sudoku', {
        breadcrumbs: GAMES_BREADCRUMBS,
        cspNonce: res.locals.cspNonce,
      })
    } catch (error) {
      next(error)
    }
  })

  router.get('/games/neontroids', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditServiceSource.get(req.portalType).logPageView(Page.GAME_NEONTROIDS, {
        who: res.locals.user?.username,
        correlationId: req.id,
      })

      res.render('pages/games/neontroids', {
        cspNonce: res.locals.cspNonce,
      })
    } catch (error) {
      next(error)
    }
  })

  router.get('/games/mimstris', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditServiceSource.get(req.portalType).logPageView(Page.GAME_MIMSTRIS, {
        who: res.locals.user?.username,
        correlationId: req.id,
      })

      res.render('pages/games/mimstris', {
        breadcrumbs: GAMES_BREADCRUMBS,
        cspNonce: res.locals.cspNonce,
      })
    } catch (error) {
      next(error)
    }
  })

  router.get('/games/invadersfromspace', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditServiceSource.get(req.portalType).logPageView(Page.GAME_INVADERS_FROM_SPACE, {
        who: res.locals.user?.username,
        correlationId: req.id,
      })

      res.render('pages/games/invaders-from-space', {
        breadcrumbs: GAMES_BREADCRUMBS,
      })
    } catch (error) {
      next(error)
    }
  })

  router.get('/games/crossword', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditServiceSource.get(req.portalType).logPageView(Page.GAME_CROSSWORD, {
        who: res.locals.user?.username,
        correlationId: req.id,
      })

      res.render('pages/games/crossword', {
        breadcrumbs: GAMES_BREADCRUMBS,
        cspNonce: res.locals.cspNonce,
      })
    } catch (error) {
      next(error)
    }
  })

  router.get('/games/christmas-crossword', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditServiceSource.get(req.portalType).logPageView(Page.GAME_CHRISTMAS_CROSSWORD, {
        who: res.locals.user?.username,
        correlationId: req.id,
      })

      res.render('pages/games/christmas-crossword', {
        breadcrumbs: GAMES_BREADCRUMBS,
        cspNonce: res.locals.cspNonce,
      })
    } catch (error) {
      next(error)
    }
  })

  router.get('/games/solitaire', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditServiceSource.get(req.portalType).logPageView(Page.GAME_SOLITAIRE, {
        who: res.locals.user?.username,
        correlationId: req.id,
      })

      res.render('pages/games/solitaire', {
        breadcrumbs: GAMES_BREADCRUMBS,
        cspNonce: res.locals.cspNonce,
      })
    } catch (error) {
      next(error)
    }
  })

  router.get('/games/smashout', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditServiceSource.get(req.portalType).logPageView(Page.GAME_SMASHOUT, {
        who: res.locals.user?.username,
        correlationId: req.id,
      })

      res.render('pages/games/smashout', {
        breadcrumbs: GAMES_BREADCRUMBS,
        cspNonce: res.locals.cspNonce,
      })
    } catch (error) {
      next(error)
    }
  })

  return router
}
