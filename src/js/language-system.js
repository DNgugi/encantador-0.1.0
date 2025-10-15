/**
 * Language Detection and Switching System for Studio Encantador
 * Supports English, Traditional Chinese (Hong Kong), and Simplified Chinese
 */

export class LanguageDetector {
  constructor() {
    this.supportedLanguages = ['en', 'zh-hk', 'zh-cn']
    this.storageKey = 'studio-encantador-language'
  }

  /**
   * Detect browser language preference
   * @returns {string} Detected language code
   */
  detectBrowserLanguage() {
    // Check navigator.languages array first (more comprehensive)
    if (navigator.languages && navigator.languages.length > 0) {
      for (const lang of navigator.languages) {
        const normalizedLang = this.normalizeLanguageCode(lang)
        if (this.supportedLanguages.includes(normalizedLang)) {
          return normalizedLang
        }
      }
    }

    // Fallback to navigator.language
    const browserLang = navigator.language || navigator.userLanguage
    const normalizedLang = this.normalizeLanguageCode(browserLang)

    return this.supportedLanguages.includes(normalizedLang)
      ? normalizedLang
      : 'en'
  }

  /**
   * Normalize language codes to our supported format
   * @param {string} langCode - Browser language code
   * @returns {string} Normalized language code
   */
  normalizeLanguageCode(langCode) {
    if (!langCode) return 'en'

    const lower = langCode.toLowerCase()

    // Handle Hong Kong Traditional Chinese
    if (lower.includes('zh-hk') || lower.includes('zh_hk')) {
      return 'zh-hk'
    }

    // Handle Mainland China Simplified Chinese
    if (
      lower.includes('zh-cn') ||
      lower.includes('zh_cn') ||
      lower.includes('zh-hans')
    ) {
      return 'zh-cn'
    }

    // Handle general Chinese (default to Traditional for Hong Kong market)
    if (lower.startsWith('zh')) {
      return 'zh-hk'
    }

    // Handle English variants
    if (lower.startsWith('en')) {
      return 'en'
    }

    return 'en' // Default fallback
  }

  /**
   * Save language preference to localStorage
   * @param {string} language - Language code to save
   */
  saveLanguagePreference(language) {
    if (this.supportedLanguages.includes(language)) {
      localStorage.setItem(this.storageKey, language)
    }
  }

  /**
   * Get stored language preference from localStorage
   * @returns {string|null} Stored language code or null
   */
  getStoredLanguagePreference() {
    return localStorage.getItem(this.storageKey)
  }

  /**
   * Get preferred language (stored preference takes priority over browser detection)
   * @returns {string} Preferred language code
   */
  getPreferredLanguage() {
    const storedLang = this.getStoredLanguagePreference()
    if (storedLang && this.supportedLanguages.includes(storedLang)) {
      return storedLang
    }

    return this.detectBrowserLanguage()
  }
}

export class LanguageSwitcher {
  constructor() {
    this.currentLanguage = 'en'
    this.previousLanguage = 'en'
    this.languageDetector = new LanguageDetector()
    this.transitionDuration = 300 // milliseconds
  }

  /**
   * Update URL structure for different languages
   * @param {string} language - Target language code
   */
  updateURL(language) {
    let newPath = ''
    const currentPath = window.location.pathname

    // Remove existing language prefix from path
    const pathWithoutLang = currentPath.replace(/^\/(zh-hk|zh-cn)/, '') || '/'

    // Add language prefix for non-English languages
    if (language === 'zh-hk') {
      newPath = '/zh-hk' + (pathWithoutLang === '/' ? '/' : pathWithoutLang)
    } else if (language === 'zh-cn') {
      newPath = '/zh-cn' + (pathWithoutLang === '/' ? '/' : pathWithoutLang)
    } else {
      // English uses root path
      newPath = pathWithoutLang
    }

    // Update browser history
    window.history.pushState({ language }, '', newPath)
  }

  /**
   * Extract language from current URL
   * @returns {string} Language code from URL
   */
  getLanguageFromURL() {
    const path = window.location.pathname

    if (path.startsWith('/zh-hk')) {
      return 'zh-hk'
    } else if (path.startsWith('/zh-cn')) {
      return 'zh-cn'
    }

    return 'en'
  }

  /**
   * Switch to a new language with smooth transitions
   * @param {string} targetLanguage - Target language code
   * @param {Function} contentUpdateCallback - Callback to update content
   */
  async switchLanguage(targetLanguage, contentUpdateCallback) {
    if (targetLanguage === this.currentLanguage) {
      return // No change needed
    }

    // Store previous language
    this.previousLanguage = this.currentLanguage

    // Add transition class to body for smooth animations
    document.body.classList.add('language-transitioning')

    try {
      // Update URL structure
      this.updateURL(targetLanguage)

      // Update document language
      this.updateDocumentLanguage(targetLanguage)

      // Update active button state
      this.updateActiveLanguageButton(targetLanguage)

      // Save preference
      this.languageDetector.saveLanguagePreference(targetLanguage)

      // Update current language
      this.currentLanguage = targetLanguage

      // Call content update callback if provided
      if (
        contentUpdateCallback &&
        typeof contentUpdateCallback === 'function'
      ) {
        await contentUpdateCallback(targetLanguage)
      }

      // Emit language change event
      this.emitLanguageChangeEvent(targetLanguage)
    } finally {
      // Remove transition class after animation completes
      setTimeout(() => {
        document.body.classList.remove('language-transitioning')
      }, this.transitionDuration)
    }
  }

  /**
   * Update document language attribute
   * @param {string} language - Language code
   */
  updateDocumentLanguage(language) {
    document.documentElement.lang = language
  }

  /**
   * Update active language button visual state
   * @param {string} activeLanguage - Currently active language
   */
  updateActiveLanguageButton(activeLanguage) {
    // Remove active class from all buttons
    const allButtons = document.querySelectorAll('.lang-btn')
    allButtons.forEach(btn => btn.classList.remove('active'))

    // Add active class to current language button
    const activeButton = document.querySelector(
      `[data-lang="${activeLanguage}"]`
    )
    if (activeButton) {
      activeButton.classList.add('active')
    }
  }

  /**
   * Emit custom language change event
   * @param {string} newLanguage - New language code
   */
  emitLanguageChangeEvent(newLanguage) {
    const event = new CustomEvent('languageChanged', {
      detail: {
        language: newLanguage,
        previousLanguage: this.previousLanguage,
      },
    })
    document.dispatchEvent(event)
  }

  /**
   * Initialize language switcher component with event listeners
   * @returns {HTMLElement} Language switcher component
   */
  initializeComponent() {
    const languageSwitcher = document.querySelector('.language-switcher')

    if (!languageSwitcher) {
      console.warn('Language switcher component not found in DOM')
      return null
    }

    // Add click event listeners to language buttons
    const languageButtons = languageSwitcher.querySelectorAll('.lang-btn')

    languageButtons.forEach(button => {
      button.addEventListener('click', event => {
        event.preventDefault()

        const targetLanguage = button.getAttribute('data-lang')

        // Prevent switching to already active language
        if (targetLanguage === this.currentLanguage) {
          return
        }

        // Switch language with content update callback
        this.switchLanguage(targetLanguage, lang => {
          // This callback will be used by the translation system
          // For now, just resolve immediately
          return Promise.resolve()
        })
      })
    })

    return languageSwitcher
  }

  /**
   * Initialize the language system on page load
   */
  initialize() {
    // Detect current language from URL or preferences
    const urlLanguage = this.getLanguageFromURL()
    const preferredLanguage = this.languageDetector.getPreferredLanguage()

    // Use URL language if present, otherwise use preferred language
    const initialLanguage =
      urlLanguage !== 'en' ? urlLanguage : preferredLanguage

    // Set current language
    this.currentLanguage = initialLanguage

    // Update document language
    this.updateDocumentLanguage(initialLanguage)

    // Update active button if component exists
    this.updateActiveLanguageButton(initialLanguage)

    // Initialize component event listeners
    this.initializeComponent()

    return initialLanguage
  }
}

// Export singleton instances for global use
export const languageDetector = new LanguageDetector()
export const languageSwitcher = new LanguageSwitcher()
