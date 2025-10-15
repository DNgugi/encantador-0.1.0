/**
 * Translation Management System for Studio Encantador
 * Handles loading, caching, and applying translations for multi-language support
 */

export class TranslationLoader {
  constructor() {
    this.cache = new Map()
    this.baseUrl = '/src/translations'
  }

  /**
   * Load translations for a specific language
   * @param {string} language - Language code (en, zh-hk, zh-cn)
   * @returns {Promise<Object>} Translation object
   */
  async loadTranslations(language) {
    // Check cache first
    if (this.cache.has(language)) {
      return this.cache.get(language)
    }

    try {
      const response = await fetch(`${this.baseUrl}/${language}.json`)

      if (!response.ok) {
        console.warn(
          `Failed to load translations for ${language}: ${response.status}`
        )
        return {}
      }

      const translations = await response.json()

      // Cache the translations
      this.cache.set(language, translations)

      return translations
    } catch (error) {
      console.error(`Error loading translations for ${language}:`, error)
      return {}
    }
  }

  /**
   * Load translations with fallback to English
   * @param {string} language - Target language code
   * @returns {Promise<Object>} Translation object
   */
  async loadTranslationsWithFallback(language) {
    // Try to load the target language
    let translations = await this.loadTranslations(language)

    // If target language failed and it's not English, fallback to English
    if (Object.keys(translations).length === 0 && language !== 'en') {
      console.warn(`Falling back to English translations for ${language}`)
      translations = await this.loadTranslations('en')
    }

    return translations
  }

  /**
   * Clear translation cache
   * @param {string} [language] - Specific language to clear, or all if not specified
   */
  clearCache(language = null) {
    if (language) {
      this.cache.delete(language)
    } else {
      this.cache.clear()
    }
  }

  /**
   * Check if translations are cached for a language
   * @param {string} language - Language code
   * @returns {boolean} Whether translations are cached
   */
  isCached(language) {
    return this.cache.has(language)
  }
}

export class TranslationManager {
  constructor(loader = null) {
    this.loader = loader || new TranslationLoader()
    this.translations = {}
    this.currentLanguage = 'en'
    this.missingKeys = new Set()
  }

  /**
   * Get translation by key with optional variable interpolation
   * @param {string} key - Translation key (supports dot notation)
   * @param {Object} [variables] - Variables for interpolation
   * @returns {string} Translated text
   */
  t(key, variables = {}) {
    let translation = this.getNestedValue(this.translations, key)

    // If translation not found, track as missing and return key
    if (translation === undefined || translation === null) {
      this.trackMissingKey(key)
      return key
    }

    // Handle variable interpolation
    if (variables && Object.keys(variables).length > 0) {
      translation = this.interpolateVariables(translation, variables)
    }

    return translation
  }

  /**
   * Get nested value from object using dot notation
   * @param {Object} obj - Object to search in
   * @param {string} path - Dot notation path (e.g., 'services.consulting')
   * @returns {*} Value at path or undefined
   */
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined
    }, obj)
  }

  /**
   * Interpolate variables in translation string
   * @param {string} text - Text with placeholders like {variable}
   * @param {Object} variables - Variables to interpolate
   * @returns {string} Text with variables replaced
   */
  interpolateVariables(text, variables) {
    return text.replace(/\{(\w+)\}/g, (match, key) => {
      const value = variables[key]
      return value !== null && value !== undefined ? String(value) : match
    })
  }

  /**
   * Track missing translation key
   * @param {string} key - Missing translation key
   */
  trackMissingKey(key) {
    if (!this.missingKeys.has(key)) {
      this.missingKeys.add(key)

      // Emit missing translation event
      const event = new CustomEvent('missingTranslation', {
        detail: {
          key,
          language: this.currentLanguage,
        },
      })
      document.dispatchEvent(event)
    }
  }

  /**
   * Get array of missing translation keys
   * @returns {string[]} Array of missing keys
   */
  getMissingKeys() {
    return Array.from(this.missingKeys)
  }

  /**
   * Clear missing keys tracking
   */
  clearMissingKeys() {
    this.missingKeys.clear()
  }

  /**
   * Update DOM elements with translations
   */
  updateDOM() {
    // Update elements with data-translate attribute
    const translateElements = document.querySelectorAll('[data-translate]')
    translateElements.forEach(element => {
      const key = element.getAttribute('data-translate')
      const varsAttr = element.getAttribute('data-translate-vars')

      let variables = {}
      if (varsAttr) {
        try {
          variables = JSON.parse(varsAttr)
        } catch (error) {
          console.warn('Invalid JSON in data-translate-vars:', varsAttr)
        }
      }

      element.textContent = this.t(key, variables)
    })

    // Update elements with data-translate-placeholder attribute
    const placeholderElements = document.querySelectorAll(
      '[data-translate-placeholder]'
    )
    placeholderElements.forEach(element => {
      const key = element.getAttribute('data-translate-placeholder')
      element.placeholder = this.t(key)
    })

    // Update elements with data-translate-title attribute
    const titleElements = document.querySelectorAll('[data-translate-title]')
    titleElements.forEach(element => {
      const key = element.getAttribute('data-translate-title')
      element.title = this.t(key)
    })

    // Update elements with data-translate-aria-label attribute
    const ariaLabelElements = document.querySelectorAll(
      '[data-translate-aria-label]'
    )
    ariaLabelElements.forEach(element => {
      const key = element.getAttribute('data-translate-aria-label')
      element.setAttribute('aria-label', this.t(key))
    })
  }

  /**
   * Switch to a new language and update DOM
   * @param {string} language - Target language code
   * @returns {Promise<void>}
   */
  async switchLanguage(language) {
    try {
      // Load translations for the new language
      const translations =
        await this.loader.loadTranslationsWithFallback(language)

      // Update current state
      this.translations = translations
      this.currentLanguage = language

      // Clear missing keys for new language
      this.clearMissingKeys()

      // Update DOM with new translations
      this.updateDOM()

      // Emit translations loaded event
      const event = new CustomEvent('translationsLoaded', {
        detail: {
          language,
          translations,
        },
      })
      document.dispatchEvent(event)
    } catch (error) {
      console.error(`Failed to load translations for ${language}:`, error)
      // Keep current translations on error
      this.translations = {}
    }
  }

  /**
   * Initialize translation system with a language
   * @param {string} [language='en'] - Initial language
   * @returns {Promise<void>}
   */
  async initialize(language = 'en') {
    await this.switchLanguage(language)
  }

  /**
   * Get current language
   * @returns {string} Current language code
   */
  getCurrentLanguage() {
    return this.currentLanguage
  }

  /**
   * Get all loaded translations
   * @returns {Object} Current translations object
   */
  getTranslations() {
    return { ...this.translations }
  }

  /**
   * Check if a translation key exists
   * @param {string} key - Translation key to check
   * @returns {boolean} Whether the key exists
   */
  hasTranslation(key) {
    return this.getNestedValue(this.translations, key) !== undefined
  }

  /**
   * Get translation statistics
   * @returns {Object} Statistics about loaded translations
   */
  getStats() {
    const flattenKeys = (obj, prefix = '') => {
      let keys = []
      for (const key in obj) {
        const fullKey = prefix ? `${prefix}.${key}` : key
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          keys = keys.concat(flattenKeys(obj[key], fullKey))
        } else {
          keys.push(fullKey)
        }
      }
      return keys
    }

    const totalKeys = flattenKeys(this.translations).length
    const missingKeysCount = this.missingKeys.size

    return {
      language: this.currentLanguage,
      totalKeys,
      missingKeysCount,
      missingKeys: this.getMissingKeys(),
      loadedAt: new Date().toISOString(),
    }
  }
}

// Export singleton instances for global use
export const translationLoader = new TranslationLoader()
export const translationManager = new TranslationManager(translationLoader)
