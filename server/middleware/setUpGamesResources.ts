import path from 'path'
import compression from 'compression'
import express, { Router } from 'express'
import noCache from 'nocache'

import config from '../config'

export default function setUpGamesResources(): Router {
  const router = express.Router()

  router.use(compression())

  //  Static Resources Configuration
  const staticResourcesConfig = { maxAge: config.staticResourceCacheDuration, redirect: false }

  Array.of(
    '/assets/js/games',
    '/node_modules/@chrisoakman/chessboardjs/dist', // chess
    '/node_modules/howler/dist', // invaders from space
    '/node_modules/stockfish.js', // chess
  ).forEach(dir => {
    router.use('/assets', express.static(path.join(process.cwd(), dir), staticResourcesConfig))
  })

  // Required for chessboard js to work
  Array.of('/assets/images/chesspieces').forEach(dir => {
    router.use('/games/img/chesspieces/wikipedia', express.static(path.join(process.cwd(), dir), staticResourcesConfig))
  })

  // Don't cache dynamic resources
  router.use(noCache())

  return router
}
