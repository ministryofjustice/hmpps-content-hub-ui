import { Router } from 'express'
import type { Services } from '../services'
import { Page } from '../services/auditService'
import config from '../config'

export default function staffRoutes({ auditService }: Services): Router {
  const router = Router()

  router.use(async (req, res, next) => {
    if (res.locals.isPrisonerPortal && req.path.startsWith('/staff/')) {
      await auditService.logPageView(Page.STAFF_PORTAL_UNAUTHORIZED, {
        who: res.locals.user.username,
        correlationId: req.id,
      })

      res.redirect('/404')
    } else {
      next()
    }
  })

  router.get('/staff/prisons', async (req, res, next) => {
    await auditService.logPageView(Page.STAFF_CHANGE_PRISON, { who: res.locals.user.username, correlationId: req.id })

    const { establishments } = config
    const establishmentOptions = establishments.map(({ code, displayName }) => ({ value: code, text: displayName }))
    return res.render('pages/staff/prisons/index', { establishmentOptions })
  })

  router.post('/staff/prisons', async (req, res, next) => {
    const { establishments } = config
    req.session.establishment = establishments.find(({ code }) => code === req.body.establishment)
    return res.redirect('/')
  })

  return router
}
