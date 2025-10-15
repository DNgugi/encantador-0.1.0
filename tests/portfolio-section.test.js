// Portfolio Section Component Tests
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { JSDOM } from 'jsdom'

// Mock DOM environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>')
global.document = dom.window.document
global.window = dom.window

// Mock matchMedia
global.window.matchMedia = vi.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}))

// Mock the translation system import
vi.mock('../src/js/translation-system.js', () => ({
  translationManager: {
    getTranslations: () => ({
      portfolio: {
        title: 'Our Portfolio',
        subtitle: 'Showcasing our expertise and methodologies',
        filterAll: 'All Projects',
        filterConsulting: 'Business Consulting',
        filterWeb: 'Web Development',
        filterTeam: 'Team Building',
        viewDetails: 'View Details',
        closeModal: 'Close',
        projectTimeline: 'Project Timeline',
        keyLearnings: 'Key Learnings',
        technologies: 'Technologies Used',
        methodology: 'Methodology',
      },
    }),
    getCurrentLanguage: () => 'en',
  },
}))

// Import after mocking
const { createPortfolioComponent } = await import(
  '../src/js/portfolio-component.js'
)

describe('Portfolio Grid Layout (TDD)', () => {
  let portfolioContainer
  let portfolioComponent

  beforeEach(() => {
    // Create a fresh container for each test
    portfolioContainer = document.createElement('section')
    portfolioContainer.id = 'portfolio-container'
    document.body.appendChild(portfolioContainer)

    // Create and render the portfolio component
    portfolioComponent = createPortfolioComponent(portfolioContainer)
    portfolioComponent.render()
  })

  afterEach(() => {
    // Clean up after each test
    if (portfolioComponent && portfolioComponent.destroy) {
      portfolioComponent.destroy()
    }
    if (portfolioContainer && portfolioContainer.parentNode) {
      portfolioContainer.parentNode.removeChild(portfolioContainer)
    }
  })

  describe('Portfolio Grid Responsiveness', () => {
    it('should render portfolio section with responsive grid layout', () => {
      const portfolioSection = document.querySelector('.portfolio-section')
      expect(portfolioSection).toBeTruthy()
      expect(portfolioSection.classList.contains('portfolio-section')).toBe(
        true
      )
    })

    it('should display portfolio items in 3-column grid on desktop', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      })

      portfolioComponent.setupResponsiveGrid()

      const portfolioGrid = document.querySelector('.portfolio-grid')
      expect(portfolioGrid).toBeTruthy()
      expect(portfolioGrid.style.gridTemplateColumns).toContain('repeat(3')
    })

    it('should display portfolio items in 2-column grid on tablet', () => {
      // Mock tablet viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      })

      portfolioComponent.setupResponsiveGrid()

      const portfolioGrid = document.querySelector('.portfolio-grid')
      expect(portfolioGrid).toBeTruthy()
      expect(portfolioGrid.style.gridTemplateColumns).toContain('repeat(2')
    })

    it('should display portfolio items in single column on mobile', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      portfolioComponent.setupResponsiveGrid()

      const portfolioGrid = document.querySelector('.portfolio-grid')
      expect(portfolioGrid).toBeTruthy()
      expect(portfolioGrid.style.gridTemplateColumns).toBe('1fr')
    })

    it('should maintain proper card heights across breakpoints', () => {
      const portfolioItems = document.querySelectorAll('.portfolio-item')
      portfolioItems.forEach(item => {
        const computedStyle = window.getComputedStyle(item)
        expect(computedStyle.display).toBe('flex')
        expect(computedStyle.flexDirection).toBe('column')
      })
    })
  })

  describe('Portfolio Filtering Functionality', () => {
    it('should render filter buttons for service categories', () => {
      const filterContainer = document.querySelector('.portfolio-filters')
      expect(filterContainer).toBeTruthy()

      const filterButtons = document.querySelectorAll('.filter-button')
      expect(filterButtons).toHaveLength(4) // All, Consulting, Web, Team
    })

    it('should filter portfolio items by consulting category', async () => {
      const consultingFilter = document.querySelector(
        '[data-filter="consulting"]'
      )
      expect(consultingFilter).toBeTruthy()

      // Simulate click
      const clickEvent = new Event('click')
      consultingFilter.dispatchEvent(clickEvent)

      // Wait for debounce to complete
      await new Promise(resolve => setTimeout(resolve, 200))

      const visibleItems = document.querySelectorAll(
        '.portfolio-item:not(.filtered-out)'
      )
      const consultingItems = document.querySelectorAll(
        '[data-category="consulting"]'
      )
      expect(visibleItems.length).toBe(consultingItems.length)
    })

    it('should filter portfolio items by web development category', async () => {
      const webFilter = document.querySelector('[data-filter="web"]')
      expect(webFilter).toBeTruthy()

      const clickEvent = new Event('click')
      webFilter.dispatchEvent(clickEvent)

      // Wait for debounce to complete
      await new Promise(resolve => setTimeout(resolve, 200))

      const visibleItems = document.querySelectorAll(
        '.portfolio-item:not(.filtered-out)'
      )
      const webItems = document.querySelectorAll('[data-category="web"]')
      expect(visibleItems.length).toBe(webItems.length)
    })

    it('should filter portfolio items by team building category', async () => {
      const teamFilter = document.querySelector('[data-filter="team"]')
      expect(teamFilter).toBeTruthy()

      const clickEvent = new Event('click')
      teamFilter.dispatchEvent(clickEvent)

      // Wait for debounce to complete
      await new Promise(resolve => setTimeout(resolve, 200))

      const visibleItems = document.querySelectorAll(
        '.portfolio-item:not(.filtered-out)'
      )
      const teamItems = document.querySelectorAll('[data-category="team"]')
      expect(visibleItems.length).toBe(teamItems.length)
    })

    it('should show all items when "All" filter is selected', () => {
      const allFilter = document.querySelector('[data-filter="all"]')
      expect(allFilter).toBeTruthy()

      const clickEvent = new Event('click')
      allFilter.dispatchEvent(clickEvent)

      const visibleItems = document.querySelectorAll(
        '.portfolio-item:not(.filtered-out)'
      )
      const allItems = document.querySelectorAll('.portfolio-item')
      expect(visibleItems.length).toBe(allItems.length)
    })

    it('should animate filter transitions smoothly', () => {
      const portfolioItems = document.querySelectorAll('.portfolio-item')
      portfolioItems.forEach(item => {
        expect(item.style.transition).toContain('opacity')
        expect(item.style.transition).toContain('transform')
      })
    })
  })

  describe('Modal System Interactions', () => {
    it('should open modal when portfolio item is clicked', () => {
      const portfolioItem = document.querySelector('.portfolio-item')
      expect(portfolioItem).toBeTruthy()

      const clickEvent = new Event('click')
      portfolioItem.dispatchEvent(clickEvent)

      const modal = document.querySelector('.portfolio-modal')
      expect(modal).toBeTruthy()
      expect(modal.classList.contains('modal-open')).toBe(true)
    })

    it('should close modal when close button is clicked', () => {
      // First open modal
      const portfolioItem = document.querySelector('.portfolio-item')
      portfolioItem.dispatchEvent(new Event('click'))

      const closeButton = document.querySelector('.modal-close')
      expect(closeButton).toBeTruthy()

      const clickEvent = new Event('click')
      closeButton.dispatchEvent(clickEvent)

      const modal = document.querySelector('.portfolio-modal')
      expect(modal.classList.contains('modal-open')).toBe(false)
    })

    it('should close modal when clicking outside modal content', () => {
      // First open modal
      const portfolioItem = document.querySelector('.portfolio-item')
      portfolioItem.dispatchEvent(new Event('click'))

      const modalOverlay = document.querySelector('.modal-overlay')
      expect(modalOverlay).toBeTruthy()

      const clickEvent = new Event('click')
      modalOverlay.dispatchEvent(clickEvent)

      const modal = document.querySelector('.portfolio-modal')
      expect(modal.classList.contains('modal-open')).toBe(false)
    })

    it('should close modal when Escape key is pressed', () => {
      // First open modal
      const portfolioItem = document.querySelector('.portfolio-item')
      portfolioItem.dispatchEvent(new Event('click'))

      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' })
      document.dispatchEvent(escapeEvent)

      const modal = document.querySelector('.portfolio-modal')
      expect(modal.classList.contains('modal-open')).toBe(false)
    })

    it('should display detailed case study content in modal', () => {
      const portfolioItem = document.querySelector('.portfolio-item')
      portfolioItem.dispatchEvent(new Event('click'))

      const modalContent = document.querySelector('.modal-content')
      expect(modalContent).toBeTruthy()

      const projectTitle = modalContent.querySelector('.project-title')
      const projectDescription = modalContent.querySelector(
        '.project-description'
      )
      const projectTimeline = modalContent.querySelector('.project-timeline')
      const keyLearnings = modalContent.querySelector('.key-learnings')

      expect(projectTitle).toBeTruthy()
      expect(projectDescription).toBeTruthy()
      expect(projectTimeline).toBeTruthy()
      expect(keyLearnings).toBeTruthy()
    })

    it('should prevent body scroll when modal is open', () => {
      const portfolioItem = document.querySelector('.portfolio-item')
      portfolioItem.dispatchEvent(new Event('click'))

      expect(document.body.style.overflow).toBe('hidden')
    })

    it('should restore body scroll when modal is closed', () => {
      // Open and then close modal
      const portfolioItem = document.querySelector('.portfolio-item')
      portfolioItem.dispatchEvent(new Event('click'))

      const closeButton = document.querySelector('.modal-close')
      closeButton.dispatchEvent(new Event('click'))

      expect(document.body.style.overflow).toBe('')
    })
  })

  describe('Performance Optimizations', () => {
    it('should use CSS transforms for smooth animations', () => {
      const portfolioItems = document.querySelectorAll('.portfolio-item')
      portfolioItems.forEach(item => {
        expect(item.style.willChange).toBe('transform')
      })
    })

    it('should lazy load portfolio images', () => {
      const portfolioImages = document.querySelectorAll('.portfolio-item img')
      portfolioImages.forEach(img => {
        expect(img.getAttribute('loading')).toBe('lazy')
      })
    })

    it('should use intersection observer for scroll animations', () => {
      expect(global.IntersectionObserver).toHaveBeenCalled()
    })

    it('should debounce filter operations', async () => {
      const filterButton = document.querySelector('.filter-button')

      // Simulate rapid clicks
      for (let i = 0; i < 5; i++) {
        filterButton.dispatchEvent(new Event('click'))
      }

      // Wait for debounce to complete
      await new Promise(resolve => setTimeout(resolve, 200))

      // Should only process the last click after debounce delay
      expect(filterButton.dataset.processing).toBe('false')
    })
  })
})
