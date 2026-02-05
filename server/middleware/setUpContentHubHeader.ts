import { RequestHandler } from 'express'

export default function setUpContentHubHeader(): RequestHandler {
  return (req, res, next) => {
    res.locals.supportedLanguages = [
      { code: 'en', text: 'English' },
      { code: 'cy', text: 'Cymraeg' },
    ]

    res.locals.showSearch = true
    res.locals.searchQuery = req.query.query || ''

    next()
  }
}
