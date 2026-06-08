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
    '/node_modules/@chrisoakman/chessboardjs/dist', // chess
    '/node_modules/howler/dist', // invaders from space
    '/node_modules/stockfish.js', // chess
  ).forEach(dir => {
    router.use('/assets', express.static(path.join(process.cwd(), dir), staticResourcesConfig))
  })

  // Required for chessboard js to work
  router.use(
    '/games/img/chesspieces/wikipedia',
    express.static(path.join(process.cwd(), '/assets/images/chesspieces'), staticResourcesConfig),
  )

  // Don't cache dynamic resources
  router.use(noCache())

  return router
}
