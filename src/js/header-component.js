/**
 * Header Component
 * Manages the main navigation header with responsive behavior,
 * mobile menu toggle, language switching, and theme toggle
 */

export class HeaderComponent {
  constructor(container) {
    this.container = container
    this.mobileMenuOpen = false
    this.currentLanguage = 'en'
    this.currentTheme = 'light'

    this.init()
  }

  init() {
    this.render()
    this.bindEvents()
    this.setupResponsiveHandlers()
  }

  render() {
    this.container.innerHTML = `
      <header class="header" data-testid="header">
        <div class="header__container">
          <!-- Logo -->
          <div class="header__logo" data-testid="logo">
            <a href="/" class="logo-link" aria-label="Studio Encantador - Home">
              <svg class="logo-icon" data-testid="logo-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <circle cx="17.5" cy="17.5" r="3.5"/>
              </svg>
              <span class="logo-text">Studio Encantador</span>
            </a>
          </div>

          <!-- Desktop Navigation -->
          <nav class="header__nav desktop-nav" data-testid="navigation">
            <ul class="nav__list">
              <li class="nav__item">
                <a href="#services" class="nav__link" data-testid="nav-services">Services</a>
              </li>
              <li class="nav__item">
                <a href="#about" class="nav__link" data-testid="nav-about">About</a>
              </li>
              <li class="nav__item">
                <a href="#portfolio" class="nav__link" data-testid="nav-portfolio">Portfolio</a>
              </li>
              <li class="nav__item">
                <a href="#contact" class="nav__link" data-testid="nav-contact">Contact</a>
              </li>
            </ul>
          </nav>

          <!-- Header Controls -->
          <div class="header__controls">
            <!-- Language Switcher -->
            <div class="language-switcher" data-testid="language-switcher">
              <button class="lang-btn active" data-lang="en" data-testid="lang-en" aria-label="Switch to English" title="English">
                EN
              </button>
              <button class="lang-btn" data-lang="zh-hk" data-testid="lang-zh-hk" aria-label="切換至繁體中文" title="繁體中文">
                繁
              </button>
              <button class="lang-btn" data-lang="zh-cn" data-testid="lang-zh-cn" aria-label="切换至简体中文" title="简体中文">
                简
              </button>
            </div>

            <!-- Theme Toggle -->
            <button class="theme-toggle" data-testid="theme-toggle" aria-label="Toggle theme">
              <svg class="theme-icon sun-icon" data-testid="theme-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="2"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>

            <!-- Mobile Menu Toggle -->
            <button class="mobile-menu-toggle" data-testid="mobile-menu-toggle" aria-label="Toggle mobile menu">
              <span class="hamburger-line"></span>
              <span class="hamburger-line"></span>
              <span class="hamburger-line"></span>
            </button>
          </div>
        </div>

        <!-- Mobile Navigation -->
        <nav class="header__nav mobile-nav" data-testid="mobile-nav">
          <ul class="nav__list">
            <li class="nav__item">
              <a href="#services" class="nav__link" data-testid="nav-link">Services</a>
            </li>
            <li class="nav__item">
              <a href="#about" class="nav__link" data-testid="nav-link">About</a>
            </li>
            <li class="nav__item">
              <a href="#portfolio" class="nav__link" data-testid="nav-link">Portfolio</a>
            </li>
            <li class="nav__item">
              <a href="#contact" class="nav__link" data-testid="nav-link">Contact</a>
            </li>
          </ul>
        </nav>
      </header>
    `
  }

  bindEvents() {
    // Mobile menu toggle
    const mobileToggle = this.container.querySelector('.mobile-menu-toggle')
    if (mobileToggle) {
      mobileToggle.addEventListener('click', e => {
        e.preventDefault()
        e.stopPropagation()
        console.log('Mobile menu toggle clicked')
        this.toggleMobileMenu()
      })
    } else {
      console.warn('Mobile menu toggle button not found')
    }

    // Language switcher
    const langButtons = this.container.querySelectorAll('.lang-btn')
    langButtons.forEach(btn => {
      btn.addEventListener('click', e =>
        this.switchLanguage(e.target.dataset.lang)
      )
    })

    // Theme toggle
    const themeToggle = this.container.querySelector('.theme-toggle')
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme())
    }

    // Close mobile menu when nav link is clicked
    const mobileNavLinks = this.container.querySelectorAll(
      '.mobile-nav .nav__link'
    )
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMobileMenu())
    })

    // Close mobile menu when clicking outside
    document.addEventListener('click', e => {
      if (this.mobileMenuOpen && !this.container.contains(e.target)) {
        this.closeMobileMenu()
      }
    })
  }

  setupResponsiveHandlers() {
    // Handle responsive behavior
    const mediaQuery = window.matchMedia('(max-width: 768px)')

    const handleResponsiveChange = e => {
      if (!e.matches && this.mobileMenuOpen) {
        // Close mobile menu when switching to desktop
        this.closeMobileMenu()
      }
    }

    mediaQuery.addEventListener('change', handleResponsiveChange)

    // Initial check
    handleResponsiveChange(mediaQuery)
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen
    console.log('Toggle mobile menu:', this.mobileMenuOpen)

    const mobileNav = this.container.querySelector('.mobile-nav')
    const mobileToggle = this.container.querySelector('.mobile-menu-toggle')

    if (!mobileNav) {
      console.error('Mobile nav not found')
      return
    }

    if (!mobileToggle) {
      console.error('Mobile toggle not found')
      return
    }

    if (this.mobileMenuOpen) {
      mobileNav.classList.add('mobile-nav--open')
      mobileToggle.classList.add('mobile-menu-toggle--active')
      document.body.classList.add('mobile-menu-open')
      console.log('Mobile menu opened')
    } else {
      mobileNav.classList.remove('mobile-nav--open')
      mobileToggle.classList.remove('mobile-menu-toggle--active')
      document.body.classList.remove('mobile-menu-open')
      console.log('Mobile menu closed')
    }

    // Dispatch custom event
    this.container.dispatchEvent(
      new CustomEvent('mobileMenuToggled', {
        detail: { isOpen: this.mobileMenuOpen },
      })
    )
  }

  closeMobileMenu() {
    if (this.mobileMenuOpen) {
      this.mobileMenuOpen = false

      const mobileNav = this.container.querySelector('.mobile-nav')
      const mobileToggle = this.container.querySelector('.mobile-menu-toggle')

      mobileNav.classList.remove('mobile-nav--open')
      mobileToggle.classList.remove('mobile-menu-toggle--active')
      document.body.classList.remove('mobile-menu-open')

      // Dispatch custom event
      this.container.dispatchEvent(new CustomEvent('mobileMenuClosed'))
    }
  }

  switchLanguage(language) {
    if (language === this.currentLanguage) return

    this.currentLanguage = language

    // Update active language button
    const langButtons = this.container.querySelectorAll('.lang-btn')
    langButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === language)
    })

    // Dispatch language change event
    document.dispatchEvent(
      new CustomEvent('languageChanged', {
        detail: { language },
      })
    )
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light'

    // Update document theme
    document.documentElement.setAttribute('data-theme', this.currentTheme)

    // Update theme icon
    const themeIcon = this.container.querySelector('.theme-icon')
    if (themeIcon) {
      themeIcon.classList.toggle('sun-icon', this.currentTheme === 'light')
      themeIcon.classList.toggle('moon-icon', this.currentTheme === 'dark')

      if (this.currentTheme === 'dark') {
        themeIcon.innerHTML = `
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/>
        `
      } else {
        themeIcon.innerHTML = `
          <circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="2"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2"/>
        `
      }
    }

    // Store theme preference
    localStorage.setItem('theme', this.currentTheme)

    // Dispatch theme change event
    document.dispatchEvent(
      new CustomEvent('themeChanged', {
        detail: { theme: this.currentTheme },
      })
    )
  }

  // Initialize theme from localStorage or system preference
  initializeTheme() {
    const savedTheme = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches

    this.currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light')
    document.documentElement.setAttribute('data-theme', this.currentTheme)

    // Update theme icon
    const themeIcon = this.container.querySelector('.theme-icon')
    if (themeIcon) {
      themeIcon.classList.toggle('sun-icon', this.currentTheme === 'light')
      themeIcon.classList.toggle('moon-icon', this.currentTheme === 'dark')
    }
  }

  destroy() {
    // Clean up event listeners
    const mobileToggle = this.container.querySelector('.mobile-menu-toggle')
    const langButtons = this.container.querySelectorAll('.lang-btn')
    const themeToggle = this.container.querySelector('.theme-toggle')
    const mobileNavLinks = this.container.querySelectorAll(
      '.mobile-nav .nav__link'
    )

    // Remove event listeners (in a real implementation, we'd store references)
    // For now, we'll just clear the container
    this.container.innerHTML = ''
  }
}

// Export a factory function for easier testing
export function createHeaderComponent(container) {
  return new HeaderComponent(container)
}
