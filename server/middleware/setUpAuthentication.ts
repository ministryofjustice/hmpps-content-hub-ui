import passport from 'passport'
import flash from 'connect-flash'
import { Router } from 'express'
import { HmppsUser } from '../interfaces/hmppsUser'
import authStrategyFor from './authentication/authStrategyFor'
import { prisonerAuth } from './authentication/prisoner-auth/prisonerAuthStrategy'
import { hmppsAuthPassportStrategy } from './authentication/hmpps-auth/hmppsAuthStrategy'

passport.serializeUser((user, done) => {
  // Not used but required for Passport
  done(null, user)
})

passport.deserializeUser((user, done) => {
  // Not used but required for Passport
  done(null, user as Express.User)
})

passport.use('hmpps-auth', hmppsAuthPassportStrategy)
passport.use('prisoner-auth', prisonerAuth.passportStrategy())

export default function setupAuthentication() {
  const router = Router()

  router.use(passport.initialize())
  router.use(passport.session())
  router.use(flash())

  router.use((req, res, next) => {
    req.authStrategy = authStrategyFor(req)
    next()
  })

  router.get('/autherror', (req, res) => {
    res.status(401)
    return res.render('autherror')
  })

  router.get('/sign-in', (req, res, next) => passport.authenticate(req.authStrategy.name)(req, res, next))

  router.get('/sign-in/callback', (req, res, next) =>
    passport.authenticate(req.authStrategy.name, {
      successReturnToOrRedirect: req.session.returnTo || '/',
      failureRedirect: '/autherror',
    })(req, res, next),
  )

  router.use('/sign-out', (req, res, next) => {
    const authSignOutUrl = req.authStrategy.signOutUrl()

    if (req.user) {
      req.logout(err => {
        if (err) return next(err)
        return req.session.destroy(() => res.redirect(authSignOutUrl))
      })
    } else res.redirect(authSignOutUrl)
  })

  router.use(async (req, res, next) => {
    return req.authStrategy.checkAuthentication(req, res, next)
  })

  router.use((req, res, next) => {
    res.locals.user = req.user as HmppsUser
    next()
  })

  return router
}
