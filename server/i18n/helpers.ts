import i18n from '.'

export function getServerTranslation(lng = 'en') {
  return i18n.getFixedT(lng)
}

export function translate(key: string, options?: Record<string, unknown> | { lng?: string }) {
  return i18n.t(key, options)
}

export function translationExists(key: string, lng?: string) {
  return i18n.exists(key, { lng })
}

export default i18n
