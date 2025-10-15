import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/dom'
import { HeaderComponent } from '../src/js/header-component.js'

describe('Header Component', () => {
  let container
  let headerComponent

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = ''
    container = document.createElement('div')
    document.body.appendChild(container)

    // Create header component instance
    headerComponent = new HeaderComponent(container)

    // Reset mocks
    vi.clearAllMocks()
  })

  describe('Header Component Rendering', () => {
    it('should render header with logo', () => {
      const header = screen.getByTestId('header')
      const logo = screen.getByTestId('logo')
      const logoSvg = screen.getByTestId('logo-svg')

      expect(header).toBeInTheDocument()
      expect(logo).toBeInTheDocument()
      expect(logoSvg).toBeInTheDocument()
    })

    it('should render navigation menu with correct items', () => {
      const navigation = screen.getByTestId('navigation')
      const servicesLink = screen.getByTestId('nav-services')
      const aboutLink = screen.getByTestId('nav-about')
      const portfolioLink = screen.getByTestId('nav-portfolio')
      const contactLink = screen.getByTestId('nav-contact')

      expect(navigation).toBeInTheDocument()
      expect(servicesLink).toBeInTheDocument()
      expect(aboutLink).toBeInTheDocument()
      expect(portfolioLink).toBeInTheDocument()
      expect(contactLink).toBeInTheDocument()
    })

    it('should render language switcher component', () => {
      const languageSwitcher = screen.getByTestId('language-switcher')
      const enBtn = screen.getByTestId('lang-en')
      const zhHkBtn = screen.getByTestId('lang-zh-hk')
      const zhCnBtn = screen.getByTestId('lang-zh-cn')

      expect(languageSwitcher).toBeInTheDocument()
      expect(enBtn).toBeInTheDocument()
      expect(zhHkBtn).toBeInTheDocument()
      expect(zhCnBtn).toBeInTheDocument()
      expect(enBtn).toHaveClass('active')
    })

    it('should render theme toggle button', () => {
      const themeToggle = screen.getByTestId('theme-toggle')
      const themeIcon = screen.getByTestId('theme-icon')

      expect(themeToggle).toBeInTheDocument()
      expect(themeIcon).toBeInTheDocument()
      expect(themeToggle).toHaveAttribute('aria-label', 'Toggle theme')
    })
  })

  describe('Mobile Navigation Toggle', () => {
    it('should render mobile menu toggle button', () => {
      const mobileToggle = screen.getByTestId('mobile-menu-toggle')
      const hamburgerLines = container.querySelectorAll('.hamburger-line')

      expect(mobileToggle).toBeInTheDocument()
      expect(hamburgerLines).toHaveLength(3)
      expect(mobileToggle).toHaveAttribute('aria-label', 'Toggle mobile menu')
    })

    it('should toggle mobile menu visibility when clicked', async () => {
      const mobileToggle = screen.getByTestId('mobile-menu-toggle')
      const mobileNav = screen.getByTestId('mobile-nav')

      // Initially mobile nav should be hidden
      expect(mobileNav).not.toHaveClass('mobile-nav--open')

      // Click to open
      fireEvent.click(mobileToggle)

      await waitFor(() => {
        expect(mobileNav).toHaveClass('mobile-nav--open')
      })

      // Click to close
      fireEvent.click(mobileToggle)

      await waitFor(() => {
        expect(mobileNav).not.toHaveClass('mobile-nav--open')
      })
    })

    it('should update hamburger icon when mobile menu is toggled', async () => {
      const mobileToggle = screen.getByTestId('mobile-menu-toggle')

      // Initially should not have active class
      expect(mobileToggle).not.toHaveClass('mobile-menu-toggle--active')

      fireEvent.click(mobileToggle)

      await waitFor(() => {
        expect(mobileToggle).toHaveClass('mobile-menu-toggle--active')
      })
    })
  })

  describe('Responsive Behavior', () => {
    it('should hide desktop navigation on mobile screens', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(max-width: 768px)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      })

      const desktopNav = screen.getByTestId('navigation')
      const mobileToggle = screen.getByTestId('mobile-menu-toggle')

      // On mobile, desktop nav should be hidden and mobile toggle visible
      expect(desktopNav).toHaveClass('desktop-nav')
      expect(mobileToggle).toBeInTheDocument()
    })

    it('should show desktop navigation on larger screens', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(min-width: 769px)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      })

      const desktopNav = screen.getByTestId('navigation')
      const mobileToggle = screen.getByTestId('mobile-menu-toggle')

      expect(desktopNav).toBeInTheDocument()
      expect(mobileToggle).toBeInTheDocument()
    })

    it('should adapt header layout for different screen sizes', () => {
      const header = screen.getByTestId('header')
      const headerContainer = header.querySelector('.header__container')

      expect(headerContainer).toBeInTheDocument()
      expect(headerContainer).toHaveClass('header__container')
    })
  })

  describe('Header Component Interactions', () => {
    it('should handle language switching from header', async () => {
      const enBtn = screen.getByTestId('lang-en')
      const zhHkBtn = screen.getByTestId('lang-zh-hk')

      // Mock language change event
      const mockLanguageChange = vi.fn()
      document.addEventListener('languageChanged', mockLanguageChange)

      fireEvent.click(zhHkBtn)

      await waitFor(() => {
        expect(zhHkBtn).toHaveClass('active')
        expect(enBtn).not.toHaveClass('active')
      })
    })

    it('should handle theme toggle from header', async () => {
      const themeToggle = screen.getByTestId('theme-toggle')
      const themeIcon = screen.getByTestId('theme-icon')

      // Initially should show sun icon (light mode)
      expect(themeIcon).toHaveClass('sun-icon')

      fireEvent.click(themeToggle)

      await waitFor(() => {
        expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
      })
    })

    it('should close mobile menu when navigation link is clicked', async () => {
      const mobileToggle = screen.getByTestId('mobile-menu-toggle')
      const mobileNav = screen.getByTestId('mobile-nav')
      const navLinks = screen.getAllByTestId('nav-link')

      // Open mobile menu first
      fireEvent.click(mobileToggle)

      await waitFor(() => {
        expect(mobileNav).toHaveClass('mobile-nav--open')
      })

      // Click on a navigation link
      fireEvent.click(navLinks[0])

      await waitFor(() => {
        expect(mobileNav).not.toHaveClass('mobile-nav--open')
      })
    })
  })
})
