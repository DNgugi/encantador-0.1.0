// Hero Section Component Tests
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
      hero: {
        headline: 'Transform Your Business with Expert Consulting',
        subheadline:
          "Hong Kong's boutique consulting agency specializing in Business Strategy, Web Development, and Team Building",
        cta: {
          primary: 'Get Started',
          secondary: 'Learn More',
        },
      },
    }),
  },
}))

// Import after mocking
const { createHeroComponent } = await import('../src/js/hero-component.js')

describe('Hero Section Component', () => {
  let heroContainer
  let heroComponent

  beforeEach(() => {
    // Create a fresh container for each test
    heroContainer = document.createElement('main')
    heroContainer.id = 'hero-container'
    document.body.appendChild(heroContainer)

    // Create and render the hero component
    heroComponent = createHeroComponent(heroContainer)
    heroComponent.render()
  })

  afterEach(() => {
    // Clean up after each test
    if (heroComponent) {
      heroComponent.destroy()
    }
    if (heroContainer && heroContainer.parentNode) {
      heroContainer.parentNode.removeChild(heroContainer)
    }
  })

  describe('Hero Section Layout', () => {
    it('should render hero section with split-content layout', () => {
      const heroElement = document.querySelector('.hero-split-layout')
      expect(heroElement).toBeTruthy()
      expect(heroElement.classList.contains('hero-split-layout')).toBe(true)
    })

    it('should have text content area and illustration area', () => {
      const textArea = document.querySelector('.hero-text-content')
      const illustrationArea = document.querySelector('.hero-illustration')

      expect(textArea).toBeTruthy()
      expect(illustrationArea).toBeTruthy()
    })

    it('should display headline and subheadline', () => {
      const headline = document.querySelector('.hero-headline')
      const subheadline = document.querySelector('.hero-subheadline')

      expect(headline).toBeTruthy()
      expect(subheadline).toBeTruthy()
      expect(headline.textContent).toContain('Transform Your Business')
      expect(subheadline.textContent).toContain(
        "Hong Kong's boutique consulting"
      )
    })

    it('should render call-to-action buttons', () => {
      const primaryCTA = document.querySelector('.hero-cta-primary')
      const secondaryCTA = document.querySelector('.hero-cta-secondary')

      expect(primaryCTA).toBeTruthy()
      expect(secondaryCTA).toBeTruthy()
    })
  })

  describe('Responsive Behavior', () => {
    it('should stack content vertically on mobile devices', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      // Trigger responsive behavior
      heroComponent.setupResponsiveBehavior()

      const heroContainer = document.querySelector('.hero-container')
      expect(heroContainer.style.flexDirection).toBe('column')
    })

    it('should maintain horizontal layout on desktop', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      })

      // Trigger responsive behavior
      heroComponent.setupResponsiveBehavior()

      const heroContainer = document.querySelector('.hero-container')
      expect(heroContainer.style.flexDirection).toBe('row')
    })

    it('should adjust text alignment for mobile', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      // Trigger responsive behavior
      heroComponent.setupResponsiveBehavior()

      const textContent = document.querySelector('.hero-text-content')
      expect(textContent.style.textAlign).toBe('center')
    })
  })

  describe('Call-to-Action Button Interactions', () => {
    it('should handle primary CTA button click', () => {
      const primaryCTA = document.querySelector('.hero-cta-primary')
      const clickHandler = vi.fn()

      primaryCTA.addEventListener('click', clickHandler)
      primaryCTA.click()

      expect(clickHandler).toHaveBeenCalled()
    })

    it('should apply hover effects to CTA buttons', () => {
      const primaryCTA = document.querySelector('.hero-cta-primary')

      // Simulate hover
      const mouseEnterEvent = new Event('mouseenter')
      primaryCTA.dispatchEvent(mouseEnterEvent)

      expect(primaryCTA.classList.contains('hover-active')).toBe(true)
    })

    it('should remove hover effects when mouse leaves', () => {
      const primaryCTA = document.querySelector('.hero-cta-primary')

      // Simulate hover and then leave
      const mouseEnterEvent = new Event('mouseenter')
      const mouseLeaveEvent = new Event('mouseleave')

      primaryCTA.dispatchEvent(mouseEnterEvent)
      primaryCTA.dispatchEvent(mouseLeaveEvent)

      expect(primaryCTA.classList.contains('hover-active')).toBe(false)
    })

    it('should have proper accessibility attributes', () => {
      const primaryCTA = document.querySelector('.hero-cta-primary')
      const secondaryCTA = document.querySelector('.hero-cta-secondary')

      expect(primaryCTA.getAttribute('role')).toBe('button')
      expect(primaryCTA.getAttribute('aria-label')).toBeTruthy()
      expect(secondaryCTA.getAttribute('role')).toBe('button')
      expect(secondaryCTA.getAttribute('aria-label')).toBeTruthy()
    })
  })

  describe('Performance Optimization', () => {
    it('should lazy load hero illustration', () => {
      const illustration = document.querySelector('.hero-illustration svg')
      expect(illustration.getAttribute('loading')).toBe('lazy')
    })

    it('should use efficient CSS animations', () => {
      const heroSection = document.querySelector('.hero-split-layout')
      expect(heroSection.style.willChange).toBe('transform')
    })
  })
})
