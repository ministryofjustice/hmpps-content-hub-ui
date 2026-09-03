import type { Request, Response, NextFunction } from 'express'
import type { HTTPError } from 'superagent'
import logger from '../logger'
import AuditServiceSource from './services/auditServiceSource'
import { ErrorCode } from './services/auditService'

export default function createErrorHandler(production: boolean, auditServiceSource: AuditServiceSource) {
  return (error: HTTPError, req: Request, res: Response, _next: NextFunction): void => {
    const { status, message, stack } = error
    const userName = res.locals.user?.username

    logger.error(`Error handling request for '${req.originalUrl}', user '${userName}'`, error)

    if (status === 403) {
      auditServiceSource.get(req.portalType).logError(ErrorCode.FORBIDDEN, { who: userName, correlationId: req.id })
    }

    if (status === 404 || status === 403) {
      res.status(status)
      return res.render('pages/error/not-found')
    }

    res.locals.message = production ? 'Something went wrong. The error has been logged. Please try again' : message
    res.locals.status = status
    res.locals.stack = production ? null : stack

    res.status(status || 500)

    return res.render('pages/error/unhandled')
  }
}
