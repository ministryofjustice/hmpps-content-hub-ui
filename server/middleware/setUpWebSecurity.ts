import crypto from 'crypto'
import express, { Router, Request, Response, NextFunction } from 'express'
import helmet from 'helmet'
import { IncomingMessage, ServerResponse } from 'http'
import config from '../config'

export default function setUpWebSecurity(): Router {
  const router = express.Router()

  // Secure code best practice - see:
  // 1. https://expressjs.com/en/advanced/best-practice-security.html,
  // 2. https://www.npmjs.com/package/helmet
  router.use((_req: Request, res: Response, next: NextFunction) => {
    res.locals.cspNonce = crypto.randomBytes(16).toString('hex')
    next()
  })
  router.use(
    helmet({
      contentSecurityPolicy: {
        directives: DEFAULT_CSP_DIRECTIVES,
      },
      crossOriginEmbedderPolicy: false,
      referrerPolicy: { policy: ['no-referrer', 'same-origin'] },
    }),
  )
  return router
}

const s3Address = `${config.s3.bucket}.s3.${config.s3.region}.amazonaws.com`
const mediaSources = ["'self'", s3Address, config.nprStream]

export const DEFAULT_CSP_DIRECTIVES = {
  defaultSrc: ["'self'"],
  // This nonce allows us to use scripts with the use of the `cspNonce` local, e.g (in a Nunjucks template):
  // <script nonce="{{ cspNonce }}">
  // or
  // <link href="http://example.com/" rel="stylesheet" nonce="{{ cspNonce }}">
  // This ensures only scripts we trust are loaded, and not anything injected into the
  // page by an attacker.
  scriptSrc: ["'self'", (_req: IncomingMessage, res: ServerResponse) => `'nonce-${(res as Response).locals.cspNonce}'`],
  styleSrc: [
    "'self'",
    "'unsafe-inline'",
    (_req: IncomingMessage, res: ServerResponse) => `'nonce-${(res as Response).locals.cspNonce}'`,
  ],
  fontSrc: ["'self'", 'data:'],
  imgSrc: ["'self'", s3Address],
  mediaSrc: mediaSources,
  formAction: [`'self' ${config.apis.hmppsAuth.externalUrl}`],
  ...(config.production ? {} : { upgradeInsecureRequests: null }),
}
