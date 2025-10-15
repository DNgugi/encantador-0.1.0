import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  TranslationManager,
  TranslationLoader,
} from '../src/js/translation-system.js'

describe('Translation Loading System', () => {
  let translationLoader

  beforeEach(() => {
    // Reset fetch mock
    global.fetch = vi.fn()
    translationLoader = new TranslationLoader()
  })

  describe('Translation File Loading', () => {
    it('should load English translations successfully', async () => {
      const mockTranslations = {
        welcome: 'Welcome to Studio Encantador',
        description: 'Hong Kong Business Consulting Agency',
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTranslations),
      })

      const translations = await translationLoader.loadTranslations('en')
      expect(translations).toEqual(mockTranslations)
      expect(fetch).toHaveBeenCalledWith('/src/translations/en.json')
    })

    it('should load Traditional Chinese translations successfully', async () => {
      const mockTranslations = {
        welcome: '歡迎來到 Studio Encantador',
        description: '香港商業諮詢機構',
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTranslations),
      })

      const translations = await translationLoader.loadTranslations('zh-hk')
      expect(translations).toEqual(mockTranslations)
      expect(fetch).toHaveBeenCalledWith('/src/translations/zh-hk.json')
    })

    it('should load Simplified Chinese translations successfully', async () => {
      const mockTranslations = {
        welcome: '欢迎来到 Studio Encantador',
        description: '香港商业咨询机构',
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTranslations),
      })

      const translations = await translationLoader.loadTranslations('zh-cn')
      expect(translations).toEqual(mockTranslations)
      expect(fetch).toHaveBeenCalledWith('/src/translations/zh-cn.json')
    })

    it('should handle network errors gracefully', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'))

      const translations = await translationLoader.loadTranslations('en')
      expect(translations).toEqual({})
    })

    it('should handle invalid JSON responses', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON')),
      })

      const translations = await translationLoader.loadTranslations('en')
      expect(translations).toEqual({})
    })

    it('should handle 404 responses', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      const translations = await translationLoader.loadTranslations('en')
      expect(translations).toEqual({})
    })
  })

  describe('Fallback Mechanisms', () => {
    it('should fallback to English when target language fails to load', async () => {
      const englishTranslations = {
        welcome: 'Welcome to Studio Encantador',
        description: 'Hong Kong Business Consulting Agency',
      }

      // First call (zh-hk) fails
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      // Second call (en) succeeds
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(englishTranslations),
      })

      const translations =
        await translationLoader.loadTranslationsWithFallback('zh-hk')
      expect(translations).toEqual(englishTranslations)
      expect(fetch).toHaveBeenCalledTimes(2)
      expect(fetch).toHaveBeenNthCalledWith(1, '/src/translations/zh-hk.json')
      expect(fetch).toHaveBeenNthCalledWith(2, '/src/translations/en.json')
    })

    it('should return empty object when both target and fallback fail', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 404,
      })

      const translations =
        await translationLoader.loadTranslationsWithFallback('zh-hk')
      expect(translations).toEqual({})
      expect(fetch).toHaveBeenCalledTimes(2)
    })

    it('should not fallback when target language loads successfully', async () => {
      const zhHkTranslations = {
        welcome: '歡迎來到 Studio Encantador',
        description: '香港商業諮詢機構',
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(zhHkTranslations),
      })

      const translations =
        await translationLoader.loadTranslationsWithFallback('zh-hk')
      expect(translations).toEqual(zhHkTranslations)
      expect(fetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('Caching Mechanism', () => {
    it('should cache loaded translations', async () => {
      const mockTranslations = {
        welcome: 'Welcome to Studio Encantador',
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTranslations),
      })

      // First load
      await translationLoader.loadTranslations('en')

      // Second load should use cache
      const cachedTranslations = await translationLoader.loadTranslations('en')

      expect(cachedTranslations).toEqual(mockTranslations)
      expect(fetch).toHaveBeenCalledTimes(1) // Only called once due to caching
    })

    it('should clear cache when requested', async () => {
      const mockTranslations = {
        welcome: 'Welcome to Studio Encantador',
      }

      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockTranslations),
      })

      // Load and cache
      await translationLoader.loadTranslations('en')

      // Clear cache
      translationLoader.clearCache()

      // Load again should fetch from network
      await translationLoader.loadTranslations('en')

      expect(fetch).toHaveBeenCalledTimes(2)
    })

    it('should clear specific language from cache', async () => {
      const enTranslations = { welcome: 'Welcome' }
      const zhTranslations = { welcome: '歡迎' }

      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(enTranslations),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(zhTranslations),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(enTranslations),
        })

      // Load both languages
      await translationLoader.loadTranslations('en')
      await translationLoader.loadTranslations('zh-hk')

      // Clear only English
      translationLoader.clearCache('en')

      // Load English again (should fetch), Chinese should use cache
      await translationLoader.loadTranslations('en')
      await translationLoader.loadTranslations('zh-hk')

      expect(fetch).toHaveBeenCalledTimes(3) // en, zh-hk, en again
    })
  })
})

describe('Translation Management System', () => {
  let translationManager

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = ''

    // Mock TranslationLoader
    const mockLoader = {
      loadTranslationsWithFallback: vi.fn(),
    }

    translationManager = new TranslationManager(mockLoader)
  })

  describe('Translation Helper Functions', () => {
    beforeEach(() => {
      translationManager.translations = {
        welcome: 'Welcome to Studio Encantador',
        services: {
          consulting: 'Business Consulting',
          web: 'Web Development',
        },
        contact: {
          email: 'Email us at {email}',
        },
        team: {
          count: 'We have {count} team members',
        },
      }
    })

    it('should get simple translation by key', () => {
      const translation = translationManager.t('welcome')
      expect(translation).toBe('Welcome to Studio Encantador')
    })

    it('should get nested translation by dot notation', () => {
      const translation = translationManager.t('services.consulting')
      expect(translation).toBe('Business Consulting')
    })

    it('should handle missing translations gracefully', () => {
      const translation = translationManager.t('missing.key')
      expect(translation).toBe('missing.key') // Returns key as fallback
    })

    it('should interpolate variables in translations', () => {
      const translation = translationManager.t('contact.email', {
        email: 'hello@studioencantador.com',
      })
      expect(translation).toBe('Email us at hello@studioencantador.com')
    })

    it('should handle multiple variable interpolation', () => {
      const translation = translationManager.t('team.count', { count: 5 })
      expect(translation).toBe('We have 5 team members')
    })

    it('should handle missing variables in interpolation', () => {
      const translation = translationManager.t('contact.email', {})
      expect(translation).toBe('Email us at {email}') // Keeps placeholder
    })

    it('should handle null/undefined variables', () => {
      const translation = translationManager.t('contact.email', { email: null })
      expect(translation).toBe('Email us at {email}')
    })
  })

  describe('DOM Translation Updates', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div data-translate="welcome">Loading...</div>
        <div data-translate="services.consulting">Loading...</div>
        <div data-translate="contact.email" data-translate-vars='{"email":"test@example.com"}'>Loading...</div>
        <div data-translate="missing.key">Loading...</div>
        <input type="text" data-translate-placeholder="search.placeholder" placeholder="Loading...">
        <button data-translate-title="button.help" title="Loading...">Help</button>
      `

      translationManager.translations = {
        welcome: 'Welcome to Studio Encantador',
        services: {
          consulting: 'Business Consulting',
        },
        contact: {
          email: 'Email us at {email}',
        },
        search: {
          placeholder: 'Search our services...',
        },
        button: {
          help: 'Get help and support',
        },
      }
    })

    it('should update all elements with data-translate attribute', () => {
      translationManager.updateDOM()

      const welcomeEl = document.querySelector('[data-translate="welcome"]')
      const consultingEl = document.querySelector(
        '[data-translate="services.consulting"]'
      )

      expect(welcomeEl.textContent).toBe('Welcome to Studio Encantador')
      expect(consultingEl.textContent).toBe('Business Consulting')
    })

    it('should handle variable interpolation in DOM updates', () => {
      translationManager.updateDOM()

      const emailEl = document.querySelector('[data-translate="contact.email"]')
      expect(emailEl.textContent).toBe('Email us at test@example.com')
    })

    it('should handle missing translations in DOM', () => {
      translationManager.updateDOM()

      const missingEl = document.querySelector('[data-translate="missing.key"]')
      expect(missingEl.textContent).toBe('missing.key')
    })

    it('should update placeholder attributes', () => {
      translationManager.updateDOM()

      const inputEl = document.querySelector('[data-translate-placeholder]')
      expect(inputEl.placeholder).toBe('Search our services...')
    })

    it('should update title attributes', () => {
      translationManager.updateDOM()

      const buttonEl = document.querySelector('[data-translate-title]')
      expect(buttonEl.title).toBe('Get help and support')
    })

    it('should handle malformed JSON in data-translate-vars', () => {
      document.body.innerHTML = `
        <div data-translate="contact.email" data-translate-vars='invalid json'>Loading...</div>
      `

      expect(() => translationManager.updateDOM()).not.toThrow()

      const emailEl = document.querySelector('[data-translate="contact.email"]')
      expect(emailEl.textContent).toBe('Email us at {email}')
    })
  })

  describe('Language Switching Integration', () => {
    it('should load and apply new language translations', async () => {
      const mockTranslations = {
        welcome: '歡迎來到 Studio Encantador',
        services: {
          consulting: '商業諮詢',
        },
      }

      translationManager.loader.loadTranslationsWithFallback.mockResolvedValue(
        mockTranslations
      )

      document.body.innerHTML = `
        <div data-translate="welcome">Welcome</div>
        <div data-translate="services.consulting">Business Consulting</div>
      `

      await translationManager.switchLanguage('zh-hk')

      expect(
        translationManager.loader.loadTranslationsWithFallback
      ).toHaveBeenCalledWith('zh-hk')
      expect(translationManager.currentLanguage).toBe('zh-hk')
      expect(translationManager.translations).toEqual(mockTranslations)

      const welcomeEl = document.querySelector('[data-translate="welcome"]')
      const consultingEl = document.querySelector(
        '[data-translate="services.consulting"]'
      )

      expect(welcomeEl.textContent).toBe('歡迎來到 Studio Encantador')
      expect(consultingEl.textContent).toBe('商業諮詢')
    })

    it('should emit translation loaded event', async () => {
      const mockTranslations = { welcome: 'Welcome' }
      translationManager.loader.loadTranslationsWithFallback.mockResolvedValue(
        mockTranslations
      )

      const eventSpy = vi.fn()
      document.addEventListener('translationsLoaded', eventSpy)

      await translationManager.switchLanguage('en')

      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { language: 'en', translations: mockTranslations },
        })
      )
    })

    it('should handle translation loading errors gracefully', async () => {
      translationManager.loader.loadTranslationsWithFallback.mockRejectedValue(
        new Error('Load failed')
      )

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await translationManager.switchLanguage('zh-hk')

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to load translations for zh-hk:',
        expect.any(Error)
      )
      expect(translationManager.translations).toEqual({})

      consoleSpy.mockRestore()
    })
  })

  describe('Missing Translation Handling', () => {
    beforeEach(() => {
      translationManager.translations = {
        existing: {
          key: 'Existing translation',
        },
      }
      translationManager.clearMissingKeys() // Clear any previous missing keys
    })

    it('should track missing translation keys', () => {
      translationManager.t('missing.key1')
      translationManager.t('missing.key2')
      translationManager.t('existing.key') // Should not be tracked

      const missingKeys = translationManager.getMissingKeys()
      expect(missingKeys).toEqual(['missing.key1', 'missing.key2'])
    })

    it('should not duplicate missing keys', () => {
      translationManager.t('missing.key')
      translationManager.t('missing.key')
      translationManager.t('missing.key')

      const missingKeys = translationManager.getMissingKeys()
      expect(missingKeys).toEqual(['missing.key'])
    })

    it('should clear missing keys when requested', () => {
      translationManager.t('missing.key')
      translationManager.clearMissingKeys()

      const missingKeys = translationManager.getMissingKeys()
      expect(missingKeys).toEqual([])
    })

    it('should emit missing translation event', () => {
      const eventSpy = vi.fn()
      document.addEventListener('missingTranslation', eventSpy)

      translationManager.t('missing.key')

      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            key: 'missing.key',
            language: translationManager.currentLanguage,
          },
        })
      )
    })
  })
})
