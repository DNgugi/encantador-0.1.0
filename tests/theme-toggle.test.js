import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { ThemeSystem } from '../src/js/theme-system.js'

describe('Theme Toggle Functionality', () => {
  let themeToggle
  let rootElement
  let styleElement

  beforeEach(() => {
    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    }
    global.localStorage = localStorageMock

    // Mock window.matchMedia for system theme detection
    global.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    // Inject CSS styles
    const cssText = `
      :root {
        --primary: #c41e3a;
        --secondary: #2d8659;
        --accent: #e6c200;
        --highlight: #a8336b;
        --background: #f8f8ff;
        --surface: #ffffff;
        --text-primary: #1a1a1a;
        --text-secondary: #666666;
        --animation-duration-normal: 0.3s;
        --animation-easing-smooth: cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      [data-theme='dark'] {
        --primary: #e63946;
        --secondary: #52b788;
        --accent: #d4a574;
        --highlight: #d63384;
        --background: #0f172a;
        --surface: #1e293b;
        --text-primary: #f1f5f9;
        --text-secondary: #cbd5e1;
      }
      
      * {
        transition: 
          background-color var(--animation-duration-normal) var(--animation-easing-smooth),
          color var(--animation-duration-normal) var(--animation-easing-smooth),
          border-color var(--animation-duration-normal) var(--animation-easing-smooth);
      }
    `

    styleElement = document.createElement('style')
    styleElement.textContent = cssText
    document.head.appendChild(styleElement)

    // Create theme toggle button
    themeToggle = document.createElement('button')
    themeToggle.className = 'theme-toggle'
    themeToggle.setAttribute('aria-label', 'Toggle theme')
    document.body.appendChild(themeToggle)

    rootElement = document.documentElement
    rootElement.removeAttribute('data-theme')
  })

  afterEach(() => {
    if (themeToggle && themeToggle.parentNode) {
      themeToggle.parentNode.removeChild(themeToggle)
    }
    if (styleElement && styleElement.parentNode) {
      styleElement.parentNode.removeChild(styleElement)
    }
    rootElement.removeAttribute('data-theme')
    vi.clearAllMocks()
  })

  describe('System Theme Detection', () => {
    it('should detect system dark theme preference', () => {
      // Mock system dark theme
      global.matchMedia = vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }))

      const themeSystem = new ThemeSystem()

      expect(themeSystem.getSystemTheme()).toBe('dark')
    })

    it('should detect system light theme preference', () => {
      // Mock system light theme
      global.matchMedia = vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: light)',
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }))

      const themeSystem = new ThemeSystem()

      expect(themeSystem.getSystemTheme()).toBe('light')
    })

    it('should default to light theme when system preference is not available', () => {
      // Mock no system preference
      global.matchMedia = vi.fn().mockImplementation(() => ({
        matches: false,
        media: '',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }))

      const themeSystem = new ThemeSystem()

      expect(themeSystem.getSystemTheme()).toBe('light')
    })
  })

  describe('Theme Persistence in localStorage', () => {
    it('should save theme preference to localStorage', () => {
      const themeSystem = new ThemeSystem()

      themeSystem.setTheme('dark', false) // Disable animation for synchronous test

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'theme-preference',
        'dark'
      )
    })

    it('should load theme preference from localStorage', () => {
      localStorage.getItem.mockReturnValue('dark')

      const themeSystem = new ThemeSystem()

      expect(themeSystem.getStoredTheme()).toBe('dark')
    })

    it('should return null when no theme is stored', () => {
      localStorage.getItem.mockReturnValue(null)

      const themeSystem = new ThemeSystem()

      expect(themeSystem.getStoredTheme()).toBe(null)
    })

    it('should clear theme preference from localStorage', () => {
      const themeSystem = new ThemeSystem()

      themeSystem.clearStoredTheme()

      expect(localStorage.removeItem).toHaveBeenCalledWith('theme-preference')
    })
  })

  describe('Theme Toggle Interactions', () => {
    it('should toggle from light to dark theme', () => {
      const themeSystem = new ThemeSystem()

      // Start with light theme
      themeSystem.setTheme('light', false)
      expect(rootElement.getAttribute('data-theme')).toBe(null)

      // Toggle to dark
      themeSystem.setTheme('dark', false)
      expect(rootElement.getAttribute('data-theme')).toBe('dark')
    })

    it('should toggle from dark to light theme', () => {
      const themeSystem = new ThemeSystem()

      // Start with dark theme
      themeSystem.setTheme('dark', false)
      expect(rootElement.getAttribute('data-theme')).toBe('dark')

      // Toggle to light
      themeSystem.setTheme('light', false)
      expect(rootElement.getAttribute('data-theme')).toBe(null)
    })

    it('should handle button click events', () => {
      const themeSystem = new ThemeSystem()
      themeSystem.init(themeToggle)

      // Simulate button click
      themeToggle.click()

      // Should toggle theme
      expect(rootElement.getAttribute('data-theme')).toBe('dark')
    })

    it('should update button aria-label on theme change', () => {
      // Mock system light theme for this test
      global.matchMedia = vi.fn().mockImplementation(query => ({
        matches: false, // Light theme
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }))

      const themeSystem = new ThemeSystem()
      themeSystem.init(themeToggle)

      // Start with light theme - button should say "Switch to dark theme"
      expect(themeToggle.getAttribute('aria-label')).toContain('dark')

      // Toggle to dark theme
      themeSystem.setTheme('dark', false)
      expect(themeToggle.getAttribute('aria-label')).toContain('light')
    })
  })

  describe('Theme Initialization', () => {
    it('should initialize with stored theme preference', () => {
      localStorage.getItem.mockReturnValue('dark')

      const themeSystem = new ThemeSystem()
      themeSystem.init(themeToggle)

      expect(rootElement.getAttribute('data-theme')).toBe('dark')
    })

    it('should initialize with system theme when no stored preference', () => {
      localStorage.getItem.mockReturnValue(null)
      global.matchMedia = vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }))

      const themeSystem = new ThemeSystem()
      themeSystem.init(themeToggle)

      expect(rootElement.getAttribute('data-theme')).toBe('dark')
    })

    it('should listen for system theme changes', () => {
      const mockAddEventListener = vi.fn()
      global.matchMedia = vi.fn().mockImplementation(() => ({
        matches: false,
        media: '',
        addEventListener: mockAddEventListener,
        removeEventListener: vi.fn(),
      }))

      const themeSystem = new ThemeSystem()
      themeSystem.init(themeToggle)

      expect(mockAddEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      )
    })
  })

  describe('Smooth Transition Effects', () => {
    it('should add transition class during theme change', async () => {
      const themeSystem = new ThemeSystem()
      themeSystem.init(themeToggle)

      // Toggle theme
      themeSystem.toggleTheme()

      // Should add transitioning class
      expect(document.body.classList.contains('theme-transitioning')).toBe(true)

      // Wait for transition to complete
      await new Promise(resolve => setTimeout(resolve, 350))

      // Should remove transitioning class
      expect(document.body.classList.contains('theme-transitioning')).toBe(
        false
      )
    })

    it('should prevent rapid theme switching during transition', () => {
      const themeSystem = new ThemeSystem()
      themeSystem.init(themeToggle)

      // Start first toggle
      themeSystem.toggleTheme()
      const firstTheme = rootElement.getAttribute('data-theme')

      // Try to toggle again immediately
      themeSystem.toggleTheme()
      const secondTheme = rootElement.getAttribute('data-theme')

      // Theme should not change during transition
      expect(secondTheme).toBe(firstTheme)
    })

    it('should emit theme change events', () => {
      const themeSystem = new ThemeSystem()

      const eventListener = vi.fn()
      document.addEventListener('themechange', eventListener)

      themeSystem.setTheme('dark', false) // Disable animation for synchronous test

      expect(eventListener).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { theme: 'dark', previousTheme: 'light' },
        })
      )

      document.removeEventListener('themechange', eventListener)
    })
  })

  describe('Accessibility Features', () => {
    it('should support keyboard navigation', () => {
      const themeSystem = new ThemeSystem()
      themeSystem.init(themeToggle)

      // Simulate Enter key press
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' })
      themeToggle.dispatchEvent(enterEvent)

      expect(rootElement.getAttribute('data-theme')).toBe('dark')
    })

    it('should support Space key activation', () => {
      const themeSystem = new ThemeSystem()
      themeSystem.init(themeToggle)

      // Simulate Space key press
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ' })
      themeToggle.dispatchEvent(spaceEvent)

      expect(rootElement.getAttribute('data-theme')).toBe('dark')
    })

    it('should announce theme changes to screen readers', () => {
      const themeSystem = new ThemeSystem()
      themeSystem.init(themeToggle)

      themeSystem.toggleTheme()

      // Check for aria-live announcement
      const announcement = document.querySelector('[aria-live="polite"]')
      expect(announcement).toBeTruthy()
      expect(announcement.textContent).toContain('Dark theme activated')
    })
  })

  describe('Performance Optimizations', () => {
    it('should debounce rapid theme changes', async () => {
      const themeSystem = new ThemeSystem()
      themeSystem.init(themeToggle)

      const setThemeSpy = vi.spyOn(themeSystem, 'setTheme')

      // Rapid clicks
      themeToggle.click()
      themeToggle.click()
      themeToggle.click()

      // Should only call setTheme once due to debouncing
      expect(setThemeSpy).toHaveBeenCalledTimes(1)
    })

    it('should use requestAnimationFrame for smooth transitions', () => {
      const rafSpy = vi.spyOn(window, 'requestAnimationFrame')

      const themeSystem = new ThemeSystem()
      themeSystem.init(themeToggle)

      themeSystem.toggleTheme()

      expect(rafSpy).toHaveBeenCalled()

      rafSpy.mockRestore()
    })
  })
})
