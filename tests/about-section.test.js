// About Section Component Tests
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
      about: {
        title: 'About Studio Encantador',
        subtitle: 'Hong Kong Business Consulting Excellence',
        story:
          'Founded in January 2025, Studio Encantador is a boutique consulting agency that combines human expertise with AI-enhanced methodologies to deliver exceptional results for Hong Kong businesses.',
        founders: {
          title: 'Meet Our Founders',
          profiles: [
            {
              name: 'Alex Chen',
              title: 'Managing Director & Business Strategy Lead',
              background:
                'Former McKinsey consultant with 8+ years experience in Hong Kong market analysis and digital transformation.',
              certifications: [
                'MBA from HKUST',
                'Certified Management Consultant',
                'AI Strategy Certification',
              ],
            },
            {
              name: 'Sarah Wong',
              title: 'Technical Director & Innovation Lead',
              background:
                'Full-stack developer and team building specialist with expertise in modern web technologies and organizational psychology.',
              certifications: [
                'Computer Science Degree',
                'Certified Scrum Master',
                'Team Dynamics Certification',
              ],
            },
          ],
        },
        credibility: {
          title: 'Why Choose Studio Encantador',
          elements: [
            'Deep Hong Kong market knowledge',
            'AI-enhanced consulting methodologies',
            'Proven track record in business transformation',
            'Bilingual team with cultural expertise',
          ],
        },
      },
    }),
  },
}))

describe('About Section Component - TDD Implementation', () => {
  let aboutContainer
  let aboutComponent

  beforeEach(() => {
    // Create a fresh container for each test
    aboutContainer = document.createElement('section')
    aboutContainer.id = 'about-container'
    document.body.appendChild(aboutContainer)
  })

  afterEach(() => {
    // Clean up after each test
    if (aboutComponent && aboutComponent.destroy) {
      aboutComponent.destroy()
    }
    if (aboutContainer && aboutContainer.parentNode) {
      aboutContainer.parentNode.removeChild(aboutContainer)
    }
  })

  describe('About Section Responsive Behavior - Failing Tests', () => {
    it('should render about section with split layout', async () => {
      // This test will fail until we implement the component
      const { createAboutComponent } = await import(
        '../src/js/about-component.js'
      )
      aboutComponent = createAboutComponent(aboutContainer)
      aboutComponent.render()

      const aboutElement = document.querySelector('.about-full-width-layout')
      expect(aboutElement).toBeTruthy()
      expect(aboutElement.classList.contains('about-full-width-layout')).toBe(
        true
      )
    })

    it('should have full-width content area without illustration', async () => {
      const { createAboutComponent } = await import(
        '../src/js/about-component.js'
      )
      aboutComponent = createAboutComponent(aboutContainer)
      aboutComponent.render()

      const contentArea = document.querySelector('.about-content')
      const illustrationArea = document.querySelector(
        '.about-team-illustration'
      )

      expect(contentArea).toBeTruthy()
      expect(illustrationArea).toBeFalsy() // Should not exist in new layout
    })

    it('should center content on mobile devices', async () => {
      const { createAboutComponent } = await import(
        '../src/js/about-component.js'
      )
      aboutComponent = createAboutComponent(aboutContainer)
      aboutComponent.render()

      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      // Trigger responsive behavior
      aboutComponent.setupResponsiveBehavior()

      const contentArea = document.querySelector('.about-content')
      expect(contentArea.style.textAlign).toBe('center')
    })

    it('should left-align content on desktop', async () => {
      const { createAboutComponent } = await import(
        '../src/js/about-component.js'
      )
      aboutComponent = createAboutComponent(aboutContainer)
      aboutComponent.render()

      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      })

      // Trigger responsive behavior
      aboutComponent.setupResponsiveBehavior()

      const contentArea = document.querySelector('.about-content')
      expect(contentArea.style.textAlign).toBe('left')
    })
  })

  describe('Full Width Layout - Updated Tests', () => {
    it('should not render team illustration in new layout', async () => {
      const { createAboutComponent } = await import(
        '../src/js/about-component.js'
      )
      aboutComponent = createAboutComponent(aboutContainer)
      aboutComponent.render()

      const teamSVG = document.querySelector('.about-team-illustration svg')
      expect(teamSVG).toBeFalsy() // Should not exist in new layout
    })

    it('should use full width for content area', async () => {
      const { createAboutComponent } = await import(
        '../src/js/about-component.js'
      )
      aboutComponent = createAboutComponent(aboutContainer)
      aboutComponent.render()

      const contentArea = document.querySelector('.about-content')
      expect(contentArea).toBeTruthy()

      // Content should use full width without illustration constraint
      const layoutContainer = document.querySelector('.about-full-width-layout')
      expect(layoutContainer).toBeTruthy()
    })

    it('should focus on founder profiles with stock images', async () => {
      const { createAboutComponent } = await import(
        '../src/js/about-component.js'
      )
      aboutComponent = createAboutComponent(aboutContainer)
      aboutComponent.render()

      const founderImages = document.querySelectorAll('.founder-photo')
      expect(founderImages.length).toBeGreaterThan(0)

      // Check that images use Unsplash URLs (stock images)
      founderImages.forEach(img => {
        expect(img.src).toContain('unsplash.com')
      })
    })

    it('should prioritize content readability without distractions', async () => {
      const { createAboutComponent } = await import(
        '../src/js/about-component.js'
      )
      aboutComponent = createAboutComponent(aboutContainer)
      aboutComponent.render()

      const illustrationArea = document.querySelector(
        '.about-team-illustration'
      )
      expect(illustrationArea).toBeFalsy() // No illustration to distract from content

      const contentArea = document.querySelector('.about-content')
      expect(contentArea).toBeTruthy()
    })
  })

  describe('Founder Profiles and Credibility Elements - Failing Tests', () => {
    it('should display founder profiles section', async () => {
      const { createAboutComponent } = await import(
        '../src/js/about-component.js'
      )
      aboutComponent = createAboutComponent(aboutContainer)
      aboutComponent.render()

      const foundersSection = document.querySelector('.about-founders')
      expect(foundersSection).toBeTruthy()

      const founderCards = document.querySelectorAll('.founder-profile-card')
      expect(founderCards.length).toBe(2) // Two founders
    })

    it('should display founder names and titles', async () => {
      const { createAboutComponent } = await import(
        '../src/js/about-component.js'
      )
      aboutComponent = createAboutComponent(aboutContainer)
      aboutComponent.render()

      const alexProfile = document.querySelector('[data-founder="alex-chen"]')
      const sarahProfile = document.querySelector('[data-founder="sarah-wong"]')

      expect(alexProfile).toBeTruthy()
      expect(sarahProfile).toBeTruthy()

      expect(alexProfile.textContent).toContain('Alex Chen')
      expect(sarahProfile.textContent).toContain('Sarah Wong')
    })

    it('should display founder backgrounds and experience', async () => {
      const { createAboutComponent } = await import(
        '../src/js/about-component.js'
      )
      aboutComponent = createAboutComponent(aboutContainer)
      aboutComponent.render()

      const alexBackground = document.querySelector(
        '[data-founder="alex-chen"] .founder-background'
      )
      const sarahBackground = document.querySelector(
        '[data-founder="sarah-wong"] .founder-background'
      )

      expect(alexBackground.textContent).toContain('McKinsey consultant')
      expect(sarahBackground.textContent).toContain('Full-stack developer')
    })

    it('should display certifications and credentials', async () => {
      const { createAboutComponent } = await import(
        '../src/js/about-component.js'
      )
      aboutComponent = createAboutComponent(aboutContainer)
      aboutComponent.render()

      const certificationsList = document.querySelectorAll(
        '.certification-badge'
      )
      expect(certificationsList.length).toBeGreaterThan(0)

      const certificationText = Array.from(certificationsList)
        .map(badge => badge.textContent)
        .join(' ')
      expect(certificationText).toContain('MBA from HKUST')
      expect(certificationText).toContain('Computer Science Degree')
    })

    it('should display credibility building elements', async () => {
      const { createAboutComponent } = await import(
        '../src/js/about-component.js'
      )
      aboutComponent = createAboutComponent(aboutContainer)
      aboutComponent.render()

      const credibilitySection = document.querySelector('.about-credibility')
      expect(credibilitySection).toBeTruthy()

      const credibilityItems = document.querySelectorAll('.credibility-item')
      expect(credibilityItems.length).toBe(4) // Four credibility elements
    })
  })

  describe('Performance Optimization - Failing Tests', () => {
    it('should lazy load founder profile images', async () => {
      const { createAboutComponent } = await import(
        '../src/js/about-component.js'
      )
      aboutComponent = createAboutComponent(aboutContainer)
      aboutComponent.render()

      const founderImages = document.querySelectorAll('.founder-photo')
      founderImages.forEach(img => {
        expect(img.getAttribute('loading')).toBe('lazy')
        expect(img.getAttribute('decoding')).toBe('async')
      })
    })

    it('should use optimized layout performance', async () => {
      const { createAboutComponent } = await import(
        '../src/js/about-component.js'
      )
      aboutComponent = createAboutComponent(aboutContainer)
      aboutComponent.render()

      const layoutContainer = document.querySelector('.about-full-width-layout')
      expect(layoutContainer).toBeTruthy()

      // Check that we removed the performance-heavy SVG illustration
      const illustration = document.querySelector(
        '.about-team-illustration svg'
      )
      expect(illustration).toBeFalsy()
    })

    it('should optimize founder profile images', async () => {
      const { createAboutComponent } = await import(
        '../src/js/about-component.js'
      )
      aboutComponent = createAboutComponent(aboutContainer)
      aboutComponent.render()

      const founderImages = document.querySelectorAll(
        '.founder-profile-card img'
      )
      founderImages.forEach(img => {
        expect(img.getAttribute('loading')).toBe('lazy')
        expect(img.getAttribute('decoding')).toBe('async')
      })
    })
  })
})
