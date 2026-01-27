import express from 'express'
import i18next from 'i18next-http-middleware'
import i18n from '../i18n'

export default function setUpI18n(): express.RequestHandler[] {
  return [
    i18next.handle(i18n),
    (req, res, next) => {
      res.locals.t = req.t
      res.locals.i18n = req.i18n
      res.locals.language = req.language || 'en'
      next()
    },
  ]
}
