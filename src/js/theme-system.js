/**
 * Theme System for Studio Encantador Website
 * Handles light/dark theme switching with smooth transitions
 */

export class ThemeSystem {
  constructor() {
    this.currentTheme = 'light'
    this.isTransitioning = false
    this.transitionDuration = 300
    this.debounceTimeout = null
    this.button = null
    this.mediaQuery = null

    // Bind methods to preserve context
    this.handleSystemThemeChange = this.handleSystemThemeChange.bind(this)
    this.handleButtonClick = this.handleButtonClick.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  /**
   * Initialize the theme system
   * @param {HTMLElement} toggleButton - The theme toggle button element
   */
  init(toggleButton) {
    this.button = toggleButton

    // Set up system theme detection
    this.setupSystemThemeDetection()

    // Initialize with stored preference or system theme
    const storedTheme = this.getStoredTheme()
    const initialTheme = storedTheme || this.getSystemTheme()
    this.setTheme(initialTheme, false) // Don't animate initial theme

    // Set up event listeners
    this.setupEventListeners()

    // Update button state
    this.updateButtonState()
  }

  /**
   * Set up system theme detection
   */
  setupSystemThemeDetection() {
    if (window.matchMedia) {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      this.mediaQuery.addEventListener('change', this.handleSystemThemeChange)
    }
  }

  /**
   * Handle system theme changes
   * @param {MediaQueryListEvent} event - The media query change event
   */
  handleSystemThemeChange(event) {
    // Only update if no stored preference exists
    if (!this.getStoredTheme()) {
      const systemTheme = event.matches ? 'dark' : 'light'
      this.setTheme(systemTheme)
    }
  }

  /**
   * Get the system theme preference
   * @returns {string} 'dark' or 'light'
   */
  getSystemTheme() {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark'
    }
    return 'light'
  }

  /**
   * Get stored theme preference from localStorage
   * @returns {string|null} The stored theme or null if not found
   */
  getStoredTheme() {
    try {
      return localStorage.getItem('theme-preference')
    } catch (error) {
      console.warn('Failed to access localStorage:', error)
      return null
    }
  }

  /**
   * Save theme preference to localStorage
   * @param {string} theme - The theme to store
   */
  saveTheme(theme) {
    try {
      localStorage.setItem('theme-preference', theme)
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error)
    }
  }

  /**
   * Clear stored theme preference
   */
  clearStoredTheme() {
    try {
      localStorage.removeItem('theme-preference')
    } catch (error) {
      console.warn('Failed to clear theme from localStorage:', error)
    }
  }

  /**
   * Set the current theme
   * @param {string} theme - 'light' or 'dark'
   * @param {boolean} animate - Whether to animate the transition
   */
  setTheme(theme, animate = true) {
    if (this.isTransitioning && animate) {
      return // Prevent rapid theme switching
    }

    const previousTheme = this.currentTheme
    this.currentTheme = theme

    if (animate) {
      this.startTransition()
    }

    // Apply theme changes
    const applyChanges = () => {
      if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark')
      } else {
        document.documentElement.removeAttribute('data-theme')
      }

      // Save preference
      this.saveTheme(theme)

      // Update button state
      this.updateButtonState()

      // Emit theme change event
      this.emitThemeChangeEvent(theme, previousTheme)

      // Announce to screen readers
      this.announceThemeChange(theme)

      if (animate) {
        // End transition after duration
        setTimeout(() => {
          this.endTransition()
        }, this.transitionDuration)
      }
    }

    // Use requestAnimationFrame for smooth transitions in production
    // but apply immediately in test environment
    if (
      typeof window !== 'undefined' &&
      window.requestAnimationFrame &&
      animate
    ) {
      requestAnimationFrame(applyChanges)
    } else {
      applyChanges()
    }
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light'
    this.setTheme(newTheme)
  }

  /**
   * Start theme transition
   */
  startTransition() {
    this.isTransitioning = true
    document.body.classList.add('theme-transitioning')
  }

  /**
   * End theme transition
   */
  endTransition() {
    this.isTransitioning = false
    document.body.classList.remove('theme-transitioning')
  }

  /**
   * Update button state and accessibility attributes
   */
  updateButtonState() {
    if (!this.button) return

    const nextTheme = this.currentTheme === 'light' ? 'dark' : 'light'
    this.button.setAttribute('aria-label', `Switch to ${nextTheme} theme`)

    // Update button icon or text if needed
    const icon = this.button.querySelector('.theme-icon')
    if (icon) {
      icon.setAttribute('data-theme', this.currentTheme)
    }
  }

  /**
   * Emit custom theme change event
   * @param {string} theme - The new theme
   * @param {string} previousTheme - The previous theme
   */
  emitThemeChangeEvent(theme, previousTheme) {
    const event = new CustomEvent('themechange', {
      detail: { theme, previousTheme },
    })
    document.dispatchEvent(event)
  }

  /**
   * Announce theme change to screen readers
   * @param {string} theme - The new theme
   */
  announceThemeChange(theme) {
    // Create or update announcement element
    let announcement = document.querySelector('#theme-announcement')
    if (!announcement) {
      announcement = document.createElement('div')
      announcement.id = 'theme-announcement'
      announcement.setAttribute('aria-live', 'polite')
      announcement.setAttribute('aria-atomic', 'true')
      announcement.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
      `
      document.body.appendChild(announcement)
    }

    const message =
      theme === 'dark' ? 'Dark theme activated' : 'Light theme activated'
    announcement.textContent = message
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    if (!this.button) return

    // Click events
    this.button.addEventListener('click', this.handleButtonClick)

    // Keyboard events
    this.button.addEventListener('keydown', this.handleKeyDown)
  }

  /**
   * Handle button click events with debouncing
   */
  handleButtonClick() {
    this.debouncedToggle()
  }

  /**
   * Handle keyboard events
   * @param {KeyboardEvent} event - The keyboard event
   */
  handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      this.debouncedToggle()
    }
  }

  /**
   * Debounced theme toggle to prevent rapid switching
   */
  debouncedToggle() {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout)
    }

    // In test environment, execute immediately for the first call
    if (!this.debounceTimeout) {
      this.toggleTheme()
    }

    this.debounceTimeout = setTimeout(() => {
      // Clear the timeout reference
      this.debounceTimeout = null
    }, 50) // 50ms debounce
  }

  /**
   * Clean up event listeners and resources
   */
  destroy() {
    if (this.button) {
      this.button.removeEventListener('click', this.handleButtonClick)
      this.button.removeEventListener('keydown', this.handleKeyDown)
    }

    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener(
        'change',
        this.handleSystemThemeChange
      )
    }

    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout)
    }

    // Remove announcement element
    const announcement = document.querySelector('#theme-announcement')
    if (announcement) {
      announcement.remove()
    }
  }

  /**
   * Get current theme
   * @returns {string} Current theme ('light' or 'dark')
   */
  getCurrentTheme() {
    return this.currentTheme
  }

  /**
   * Check if theme is transitioning
   * @returns {boolean} True if transitioning
   */
  isThemeTransitioning() {
    return this.isTransitioning
  }
}

// Auto-initialize if DOM is ready and theme toggle button exists
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.querySelector('.theme-toggle')
  if (themeToggle) {
    const themeSystem = new ThemeSystem()
    themeSystem.init(themeToggle)

    // Make theme system globally available for debugging
    window.themeSystem = themeSystem
  }
})

// Export for module usage
export default ThemeSystem
