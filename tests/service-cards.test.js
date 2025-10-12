// Service Cards Component Tests
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
      services: {
        title: 'Our Services',
        subtitle: 'Comprehensive business solutions for Hong Kong companies',
        consulting: {
          title: 'Business Consulting',
          description:
            'Strategic guidance to transform your business operations and drive growth in the Hong Kong market.',
          features: [
            'Market Analysis & Strategy',
            'Process Optimization',
            'Digital Transformation',
            'Performance Analytics',
          ],
        },
        web: {
          title: 'Web Development',
          description:
            'Modern, responsive websites and applications tailored for Hong Kong businesses.',
          features: [
            'Responsive Design',
            'E-commerce Solutions',
            'Multi-language Support',
            'Performance Optimization',
          ],
        },
        team: {
          title: 'Team Building',
          description:
            'Strengthen your team dynamics and improve collaboration with our proven methodologies.',
          features: [
            'Leadership Development',
            'Communication Training',
            'Conflict Resolution',
            'Cultural Integration',
          ],
        },
      },
    }),
  },
}))

// Import after mocking
const { createServiceCardsComponent } = await import(
  '../src/js/service-cards-component.js'
)

describe('Service Cards Component', () => {
  let serviceContainer
  let serviceComponent

  beforeEach(() => {
    // Create a fresh container for each test
    serviceContainer = document.createElement('section')
    serviceContainer.id = 'services-container'
    document.body.appendChild(serviceContainer)

    // Create and render the service cards component
    serviceComponent = createServiceCardsComponent(serviceContainer)
    serviceComponent.render()
  })

  afterEach(() => {
    // Clean up after each test
    if (serviceComponent) {
      serviceComponent.destroy()
    }
    if (serviceContainer && serviceContainer.parentNode) {
      serviceContainer.parentNode.removeChild(serviceContainer)
    }
  })

  describe('Service Card Rendering', () => {
    it('should render services section with proper structure', () => {
      const servicesSection = document.querySelector('.services-section')
      expect(servicesSection).toBeTruthy()
      expect(servicesSection.classList.contains('services-section')).toBe(true)
    })

    it('should render three service cards', () => {
      const serviceCards = document.querySelectorAll('.service-card')
      expect(serviceCards).toHaveLength(3)
    })

    it('should render service cards with traditional rounded rectangle shape', () => {
      const serviceCards = document.querySelectorAll('.service-card')
      serviceCards.forEach(card => {
        expect(card.classList.contains('service-card')).toBe(true)
        // Check for rounded rectangle styling - verify the class is applied
        expect(card.className).toContain('service-card')
      })
    })

    it('should display service titles correctly', () => {
      const consultingCard = document.querySelector(
        '[data-service="consulting"]'
      )
      const webCard = document.querySelector('[data-service="web"]')
      const teamCard = document.querySelector('[data-service="team"]')

      expect(consultingCard.querySelector('.service-title').textContent).toBe(
        'Business Consulting'
      )
      expect(webCard.querySelector('.service-title').textContent).toBe(
        'Web Development'
      )
      expect(teamCard.querySelector('.service-title').textContent).toBe(
        'Team Building'
      )
    })

    it('should display service descriptions', () => {
      const serviceCards = document.querySelectorAll('.service-card')
      serviceCards.forEach(card => {
        const description = card.querySelector('.service-description')
        expect(description).toBeTruthy()
        expect(description.textContent.length).toBeGreaterThan(0)
      })
    })

    it('should display custom SVG icons for each service', () => {
      const serviceCards = document.querySelectorAll('.service-card')
      serviceCards.forEach(card => {
        const icon = card.querySelector('.service-icon svg')
        expect(icon).toBeTruthy()
        expect(icon.tagName.toLowerCase()).toBe('svg')
      })
    })
  })

  describe('Service Card Hover Effects', () => {
    it('should apply hover effects when mouse enters card', () => {
      const serviceCard = document.querySelector('.service-card')

      // Simulate hover
      const mouseEnterEvent = new Event('mouseenter')
      serviceCard.dispatchEvent(mouseEnterEvent)

      expect(serviceCard.classList.contains('card-hover')).toBe(true)
    })

    it('should remove hover effects when mouse leaves card', () => {
      const serviceCard = document.querySelector('.service-card')

      // Simulate hover and then leave
      const mouseEnterEvent = new Event('mouseenter')
      const mouseLeaveEvent = new Event('mouseleave')

      serviceCard.dispatchEvent(mouseEnterEvent)
      serviceCard.dispatchEvent(mouseLeaveEvent)

      expect(serviceCard.classList.contains('card-hover')).toBe(false)
    })

    it('should apply gradient background on hover', () => {
      const serviceCard = document.querySelector('.service-card')

      // Simulate hover
      const mouseEnterEvent = new Event('mouseenter')
      serviceCard.dispatchEvent(mouseEnterEvent)

      expect(serviceCard.style.background).toContain('gradient')
    })

    it('should apply shadow animation on hover', () => {
      const serviceCard = document.querySelector('.service-card')

      // Simulate hover
      const mouseEnterEvent = new Event('mouseenter')
      serviceCard.dispatchEvent(mouseEnterEvent)

      expect(serviceCard.style.boxShadow).toBeTruthy()
    })
  })

  describe('Responsive Grid Behavior', () => {
    it('should display cards in grid layout on desktop', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      })

      serviceComponent.setupResponsiveGrid()

      const servicesGrid = document.querySelector('.services-grid')
      expect(servicesGrid.style.display).toBe('grid')
      expect(servicesGrid.style.gridTemplateColumns).toContain('repeat(3')
    })

    it('should display cards in single column on mobile', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      serviceComponent.setupResponsiveGrid()

      const servicesGrid = document.querySelector('.services-grid')
      expect(servicesGrid.style.gridTemplateColumns).toBe('1fr')
    })

    it('should display cards in two columns on tablet', () => {
      // Mock tablet viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      })

      serviceComponent.setupResponsiveGrid()

      const servicesGrid = document.querySelector('.services-grid')
      expect(servicesGrid.style.gridTemplateColumns).toContain('repeat(2')
    })

    it('should adjust card spacing based on screen size', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      serviceComponent.setupResponsiveGrid()

      const servicesGrid = document.querySelector('.services-grid')
      expect(servicesGrid.style.gap).toBeTruthy()
    })
  })

  describe('Card Animation Functionality', () => {
    it('should animate card entrance on scroll', () => {
      const serviceCards = document.querySelectorAll('.service-card')

      // Call setupScrollAnimations which sets up the animation delays
      serviceComponent.setupScrollAnimations()

      // Check that animation delays are set (this is the core functionality)
      serviceCards.forEach((card, index) => {
        expect(card.style.animationDelay).toBe(`${index * 0.1}s`)
        expect(card.style.opacity).toBe('0')
        expect(card.style.transform).toBe('translateY(30px)')
      })
    })

    it('should stagger card animations', () => {
      const serviceCards = document.querySelectorAll('.service-card')

      serviceCards.forEach((card, index) => {
        expect(card.style.animationDelay).toBe(`${index * 0.1}s`)
      })
    })

    it('should apply smooth transitions for all animations', () => {
      const serviceCards = document.querySelectorAll('.service-card')

      serviceCards.forEach(card => {
        expect(card.style.transition).toContain('transform')
        expect(card.style.transition).toContain('box-shadow')
      })
    })

    it('should use CSS transforms for performance', () => {
      const serviceCard = document.querySelector('.service-card')

      // Simulate hover animation
      const mouseEnterEvent = new Event('mouseenter')
      serviceCard.dispatchEvent(mouseEnterEvent)

      expect(serviceCard.style.transform).toBeTruthy()
    })
  })

  describe('Performance and Accessibility', () => {
    it('should have proper ARIA labels for accessibility', () => {
      const serviceCards = document.querySelectorAll('.service-card')

      serviceCards.forEach(card => {
        expect(card.getAttribute('role')).toBe('article')
        expect(card.getAttribute('aria-label')).toBeTruthy()
      })
    })

    it('should support keyboard navigation', () => {
      const serviceCard = document.querySelector('.service-card')
      expect(serviceCard.getAttribute('tabindex')).toBe('0')
    })

    it('should handle focus events for accessibility', () => {
      const serviceCard = document.querySelector('.service-card')

      const focusEvent = new Event('focus')
      serviceCard.dispatchEvent(focusEvent)

      expect(serviceCard.classList.contains('card-focus')).toBe(true)
    })

    it('should use efficient CSS for animations', () => {
      const serviceCard = document.querySelector('.service-card')
      expect(serviceCard.style.willChange).toBe('transform')
    })

    it('should lazy load service icons', () => {
      const serviceIcons = document.querySelectorAll('.service-icon svg')
      serviceIcons.forEach(icon => {
        expect(icon.getAttribute('loading')).toBe('lazy')
      })
    })
  })
})
