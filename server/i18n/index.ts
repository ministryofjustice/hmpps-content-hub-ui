import i18next from 'i18next'
import Backend from 'i18next-fs-backend'
import i18nextMiddleware from 'i18next-http-middleware'
import path from 'path'
import logger from '../../logger'

const localesPath = path.join(__dirname, 'locales')

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'cy'],
    preload: ['en', 'cy'],
    detection: {
      order: ['querystring', 'cookie', 'header'],
      caches: ['cookie'],
      cookieName: 'lang',
    },
    backend: {
      loadPath: path.join(localesPath, '{{lng}}/{{ns}}.json'),
      addPath: path.join(localesPath, '{{lng}}/{{ns}}.missing.json'),
    },
    debug: process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test',
    ns: ['common', 'pages', 'features'],
    defaultNS: 'common',
    saveMissing: false,
    interpolation: {
      escapeValue: false,
    },
  })
  .then(() => {
    logger.info('i18next initialized successfully')
  })
  .catch(error => {
    logger.error(error, 'Failed to initialize i18next')
  })

export default i18next
