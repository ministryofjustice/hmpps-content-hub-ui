import i18n from './index'
import { translate, getServerTranslation, translationExists } from './helpers'

describe('i18n Configuration', () => {
  beforeAll(async () => {
    await i18n.loadNamespaces(['common', 'pages', 'features', 'errors'])
  })

  describe('Translation Loading', () => {
    it('should load English translations', () => {
      expect(i18n.t('common:topBar.title', { lng: 'en' })).toBe('Content Hub')
    })

    it('should load Welsh translations', () => {
      expect(i18n.t('common:topBar.title', { lng: 'cy' })).toBe('Hwb Cynnwys')
    })

    it('should handle nested translation keys', () => {
      expect(i18n.t('common:pageNavigation.home', { lng: 'en' })).toBe('Home')
      expect(i18n.t('common:pageNavigation.home', { lng: 'cy' })).toBe('Hafan')
    })
  })

  describe('Interpolation', () => {
    it('should interpolate values in English', () => {
      const result = i18n.t('pages:search.noResults', { lng: 'en', term: 'test' })
      expect(result).toBe('No results found for "test"')
    })

    it('should interpolate values in Welsh', () => {
      const result = i18n.t('pages:search.noResults', { lng: 'cy', term: 'prawf' })
      expect(result).toBe('Dim canlyniadau ar gyfer "prawf"')
    })
  })

  describe('Fallback Behavior', () => {
    it('should fallback to English for missing translations', () => {
      const result = i18n.t('common:topBar.title', { lng: 'fr' })
      expect(result).toBe('Content Hub')
    })

    it('should return key for completely missing translations', () => {
      const result = i18n.t('common:nonExistentKey', { lng: 'en' })
      expect(result).toBe('nonExistentKey')
    })
  })

  describe('Helper Functions', () => {
    it('should get server translation function', () => {
      const t = getServerTranslation('en')
      expect(t('common:pageNavigation.back')).toBe('Back')
    })

    it('should translate using helper', () => {
      const result = translate('pages:search.title', { lng: 'en' })
      expect(result).toBe('Search')
    })

    it('should check if translation exists', () => {
      expect(translationExists('common:topBar.title')).toBe(true)
      expect(translationExists('common:nonExistent')).toBe(false)
    })
  })

  describe('Namespace Support', () => {
    it('should load common namespace', () => {
      expect(i18n.t('common:pageNavigation.home', { lng: 'en' })).toBe('Home')
    })

    it('should load pages namespace', () => {
      expect(i18n.t('pages:home.featured', { lng: 'en' })).toBe('Featured')
    })

    it('should load features namespace', () => {
      expect(i18n.t('features:contentTile.watch', { lng: 'en' })).toBe('Watch')
    })

    it('should load errors namespace', () => {
      expect(i18n.t('errors:error.pageNotFound', { lng: 'en' })).toBe('Page not found')
    })

    it('should load all namespaces in English', () => {
      expect(i18n.t('common:topBar.title', { lng: 'en' })).toBe('Content Hub')
      expect(i18n.t('pages:search.title', { lng: 'en' })).toBe('Search')
      expect(i18n.t('features:showMore.enabled', { lng: 'en' })).toBe('Show more')
      expect(i18n.t('errors:error.somethingWentWrong', { lng: 'en' })).toBe('Something went wrong')
    })

    it('should load all namespaces in Welsh', () => {
      expect(i18n.t('common:topBar.title', { lng: 'cy' })).toBe('Hwb Cynnwys')
      expect(i18n.t('pages:search.title', { lng: 'cy' })).toBe('Chwilio')
      expect(i18n.t('features:showMore.enabled', { lng: 'cy' })).toBe('Dangos mwy')
      expect(i18n.t('errors:error.pageNotFound', { lng: 'cy' })).toBe('Tudalen heb ei chanfod')
    })
  })

  describe('Language Configuration', () => {
    it('should support English language', () => {
      expect(i18n.languages).toContain('en')
    })

    it('should support Welsh language', () => {
      i18n.changeLanguage('cy')
      expect(['en', 'cy']).toContain(i18n.language)
    })

    it('should have English as fallback language', () => {
      expect(i18n.options.fallbackLng).toEqual(['en'])
    })
  })
})
