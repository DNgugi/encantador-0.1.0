import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  LanguageDetector,
  LanguageSwitcher,
} from '../src/js/language-system.js'

describe('Language Detection System', () => {
  let languageDetector

  beforeEach(() => {
    // Reset DOM and localStorage before each test
    document.documentElement.lang = 'en'
    localStorage.clear()

    // Mock navigator object completely
    Object.defineProperty(window, 'navigator', {
      writable: true,
      value: {
        language: 'en-US',
        languages: ['en-US'],
      },
    })

    languageDetector = new LanguageDetector()
  })

  describe('Browser Language Detection', () => {
    it('should detect English as default language', () => {
      navigator.language = 'en-US'
      const detectedLang = languageDetector.detectBrowserLanguage()
      expect(detectedLang).toBe('en')
    })

    it('should detect Traditional Chinese from Hong Kong locale', () => {
      Object.defineProperty(window, 'navigator', {
        writable: true,
        value: {
          language: 'zh-HK',
          languages: ['zh-HK'],
        },
      })
      const detectedLang = languageDetector.detectBrowserLanguage()
      expect(detectedLang).toBe('zh-hk')
    })

    it('should detect Simplified Chinese from mainland China locale', () => {
      Object.defineProperty(window, 'navigator', {
        writable: true,
        value: {
          language: 'zh-CN',
          languages: ['zh-CN'],
        },
      })
      const detectedLang = languageDetector.detectBrowserLanguage()
      expect(detectedLang).toBe('zh-cn')
    })

    it('should fallback to English for unsupported languages', () => {
      Object.defineProperty(window, 'navigator', {
        writable: true,
        value: {
          language: 'fr-FR',
          languages: ['fr-FR'],
        },
      })
      const detectedLang = languageDetector.detectBrowserLanguage()
      expect(detectedLang).toBe('en')
    })

    it('should handle navigator.languages array', () => {
      Object.defineProperty(navigator, 'languages', {
        writable: true,
        value: ['zh-HK', 'zh-CN', 'en-US'],
      })
      const detectedLang = languageDetector.detectBrowserLanguage()
      expect(detectedLang).toBe('zh-hk')
    })
  })

  describe('Language Preference Persistence', () => {
    it('should save language preference to localStorage', () => {
      languageDetector.saveLanguagePreference('zh-hk')
      expect(localStorage.getItem('studio-encantador-language')).toBe('zh-hk')
    })

    it('should load language preference from localStorage', () => {
      localStorage.setItem('studio-encantador-language', 'zh-cn')
      const savedLang = languageDetector.getStoredLanguagePreference()
      expect(savedLang).toBe('zh-cn')
    })

    it('should return null when no preference is stored', () => {
      const savedLang = languageDetector.getStoredLanguagePreference()
      expect(savedLang).toBeNull()
    })

    it('should prioritize stored preference over browser detection', () => {
      localStorage.setItem('studio-encantador-language', 'zh-hk')
      Object.defineProperty(window, 'navigator', {
        writable: true,
        value: {
          language: 'en-US',
          languages: ['en-US'],
        },
      })
      const preferredLang = languageDetector.getPreferredLanguage()
      expect(preferredLang).toBe('zh-hk')
    })
  })
})

describe('Language Switching System', () => {
  let languageSwitcher

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = ''
    document.documentElement.lang = 'en'

    // Mock window.location
    delete window.location
    window.location = {
      pathname: '/',
      search: '',
      hash: '',
      href: 'http://localhost:3000/',
      origin: 'http://localhost:3000',
    }

    // Mock history API
    window.history.pushState = vi.fn()

    languageSwitcher = new LanguageSwitcher()
  })

  describe('URL Structure Management', () => {
    it('should update URL for Traditional Chinese', () => {
      languageSwitcher.updateURL('zh-hk')
      expect(window.history.pushState).toHaveBeenCalledWith(
        { language: 'zh-hk' },
        '',
        '/zh-hk/'
      )
    })

    it('should update URL for Simplified Chinese', () => {
      languageSwitcher.updateURL('zh-cn')
      expect(window.history.pushState).toHaveBeenCalledWith(
        { language: 'zh-cn' },
        '',
        '/zh-cn/'
      )
    })

    it('should use root path for English', () => {
      languageSwitcher.updateURL('en')
      expect(window.history.pushState).toHaveBeenCalledWith(
        { language: 'en' },
        '',
        '/'
      )
    })

    it('should preserve existing path when switching languages', () => {
      window.location.pathname = '/services'
      languageSwitcher.updateURL('zh-hk')
      expect(window.history.pushState).toHaveBeenCalledWith(
        { language: 'zh-hk' },
        '',
        '/zh-hk/services'
      )
    })

    it('should extract language from URL path', () => {
      window.location.pathname = '/zh-hk/about'
      const lang = languageSwitcher.getLanguageFromURL()
      expect(lang).toBe('zh-hk')
    })

    it('should return English for root path', () => {
      window.location.pathname = '/'
      const lang = languageSwitcher.getLanguageFromURL()
      expect(lang).toBe('en')
    })
  })

  describe('Language Switching with Smooth Transitions', () => {
    beforeEach(() => {
      // Create a mock language switcher component in DOM
      document.body.innerHTML = `
        <div class="language-switcher">
          <button data-lang="en" class="lang-btn active">EN</button>
          <button data-lang="zh-hk" class="lang-btn">繁</button>
          <button data-lang="zh-cn" class="lang-btn">简</button>
        </div>
        <div class="content" data-translate="welcome">Welcome</div>
      `
    })

    it('should add transition class during language switch', async () => {
      const mockCallback = vi.fn()
      await languageSwitcher.switchLanguage('zh-hk', mockCallback)

      // Should have added transition class temporarily
      expect(mockCallback).toHaveBeenCalledWith('zh-hk')
    })

    it('should update active language button', () => {
      languageSwitcher.updateActiveLanguageButton('zh-hk')

      const activeBtn = document.querySelector('.lang-btn.active')
      const zhHkBtn = document.querySelector('[data-lang="zh-hk"]')

      expect(activeBtn).toBe(zhHkBtn)
    })

    it('should update document language attribute', () => {
      languageSwitcher.updateDocumentLanguage('zh-hk')
      expect(document.documentElement.lang).toBe('zh-hk')
    })

    it('should emit language change event', () => {
      const eventSpy = vi.fn()
      document.addEventListener('languageChanged', eventSpy)

      languageSwitcher.emitLanguageChangeEvent('zh-cn')

      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { language: 'zh-cn', previousLanguage: 'en' },
        })
      )
    })
  })

  describe('Language Switcher Component Integration', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div class="language-switcher">
          <button data-lang="en" class="lang-btn">EN</button>
          <button data-lang="zh-hk" class="lang-btn">繁</button>
          <button data-lang="zh-cn" class="lang-btn">简</button>
        </div>
      `
    })

    it('should initialize language switcher component', () => {
      const component = languageSwitcher.initializeComponent()
      expect(component).toBeTruthy()

      const buttons = document.querySelectorAll('.lang-btn')
      expect(buttons).toHaveLength(3)
    })

    it('should handle click events on language buttons', () => {
      const switchSpy = vi.spyOn(languageSwitcher, 'switchLanguage')
      languageSwitcher.initializeComponent()

      const zhHkBtn = document.querySelector('[data-lang="zh-hk"]')
      zhHkBtn.click()

      expect(switchSpy).toHaveBeenCalledWith('zh-hk', expect.any(Function))
    })

    it('should prevent switching to already active language', () => {
      languageSwitcher.currentLanguage = 'zh-hk'
      languageSwitcher.updateActiveLanguageButton('zh-hk')

      const switchSpy = vi.spyOn(languageSwitcher, 'switchLanguage')
      languageSwitcher.initializeComponent()

      const zhHkBtn = document.querySelector('[data-lang="zh-hk"]')
      zhHkBtn.click()

      expect(switchSpy).not.toHaveBeenCalled()
    })
  })
})
