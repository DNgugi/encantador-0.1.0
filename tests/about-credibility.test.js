// About Section Credibility Building Tests
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
                'Former McKinsey consultant with 8+ years experience in Hong Kong market analysis and digital transformation. Specializes in strategic planning, process optimization, and AI-enhanced business intelligence.',
              certifications: [
                'MBA from HKUST',
                'Certified Management Consultant',
                'AI Strategy Certification',
              ],
              experience:
                'Led 50+ transformation projects across Asia-Pacific region',
              achievements: 'Recognized expert in Hong Kong business ecosystem',
            },
            {
              name: 'Sarah Wong',
              title: 'Technical Director & Innovation Lead',
              background:
                'Full-stack developer and team building specialist with expertise in modern web technologies and organizational psychology. Passionate about creating digital solutions that enhance human collaboration.',
              certifications: [
                'Computer Science Degree',
                'Certified Scrum Master',
                'Team Dynamics Certification',
              ],
              experience: 'Built 100+ web applications for Hong Kong SMEs',
              achievements:
                'Pioneer in AI-enhanced team building methodologies',
            },
          ],
        },
        credibility: {
          title: 'Why Choose Studio Encantador',
          elements: [
            'Deep Hong Kong market knowledge and cultural expertise',
            'AI-enhanced consulting methodologies for data-driven insights',
            'Proven track record in business transformation and growth',
            'Bilingual team with international and local experience',
          ],
          metrics: [
            { label: 'Years Combined Experience', value: '15+' },
            { label: 'Projects Completed', value: '150+' },
            { label: 'Client Satisfaction', value: '98%' },
            { label: 'Hong Kong Market Focus', value: '100%' },
          ],
          testimonials: [
            {
              quote:
                'Studio Encantador transformed our business operations with their innovative approach.',
              author: 'Previous Client',
              company: 'Hong Kong Tech Startup',
            },
          ],
        },
      },
    }),
  },
}))

describe('About Section Credibility Building - TDD Implementation', () => {
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

  describe('Credibility Content Rendering - Failing Tests', () => {
    it('should display credibility metrics with proper formatting', async () => {
      const { createAboutComponent } = await import(
        '../src/js/about-component.js'
      )
      aboutComponent = createAboutComponent(aboutContainer)
      aboutComponent.render()

      const metricsSection = document.querySelector('.credibility-metrics')
      expect(metricsSection).toBeTruthy()

      const metricItems = document.querySelectorAll('.credibility-metric')
      expect(metricItems.length).toBeGreaterThan(0)

      // Check for specific metrics
      const experienceMetric = document.querySelector(
        '[data-metric="experience"]'
      )
      const projectsMetric = document.querySelector('[data-metric="projects"]')
      const satisfactionMetric = document.querySelector(
        '[data-metric="satisfaction"]'
      )

      expect(experienceMetric).toBeTruthy()
      expect(projectsMetric).toBeTruthy()
      expect(satisfactionMetric).toBeTruthy()
    })

    it('should display founder experience and achievements prominently', async () => {
      const { createAboutComponent } = await import(
        '../src/js/about-component.js'
      )
      aboutComponent = createAboutComponent(aboutContainer)
      aboutComponent.render()

      const founderCards = document.querySelectorAll('.founder-profile-card')

      founderCards.forEach(card => {
        const experienceSection = card.querySelector('.founder-experience')
        const achievementsSection = card.querySelector('.founder-achievements')

        expect(experienceSection).toBeTruthy()
        expect(achievementsSection).toBeTruthy()

        // Check content includes specific experience details
        expect(experienceSection.textContent).toMatch(/\d+\+/i)
      })
    })

    it('should highlight Hong Kong market expertise', async () => {
      const { createAboutComponent } = await import(
        '../src/js/about-component.js'
      )
      aboutComponent = createAboutComponent(aboutContainer)
      aboutComponent.render()

      const credibilityItems = document.querySelectorAll('.credibility-item')
      const credibilityText = Array.from(credibilityItems)
        .map(item => item.textContent)
        .join(' ')

      expect(credibilityText).toMatch(/Hong Kong/i)
      expect(credibilityText).toMatch(/(market|local|regional|cultural)/i)
    })

    it('should display professional certifications with visual emphasis', async () => {
      const { createAboutComponent } = await import(
        '../src/js/about-component.js'
      )
      aboutComponent = createAboutComponent(aboutContainer)
      aboutComponent.render()

      const certificationSections = document.querySelectorAll(
        '.founder-certifications'
      )

      certificationSections.forEach(section => {
        const certificationBadges = section.querySelectorAll(
          '.certification-badge'
        )
        expect(certificationBadges.length).toBeGreaterThan(0)

        // Check for visual styling
        certificationBadges.forEach(badge => {
          expect(badge.classList.contains('certification-badge')).toBe(true)
        })
      })
    })

    it('should include client testimonials or success indicators', async () => {
      const { createAboutComponent } = await import(
        '../src/js/about-component.js'
      )
      aboutComponent = createAboutComponent(aboutContainer)
      aboutComponent.render()

      const testimonialsSection = document.querySelector(
        '.credibility-testimonials'
      )
      expect(testimonialsSection).toBeTruthy()

      const testimonialItems = document.querySelectorAll('.testimonial-item')
      expect(testimonialItems.length).toBeGreaterThan(0)
    })
  })

  describe('Founder Profile Display - Failing Tests', () => {
    it('should display founder photos with professional styling', async () => {
      const { createAboutComponent } = await import(
        '../src/js/about-component.js'
      )
      aboutComponent = createAboutComponent(aboutContainer)
      aboutComponent.render()

      const founderPhotos = document.querySelectorAll('.founder-photo')
      expect(founderPhotos.length).toBe(2) // Two founders

      founderPhotos.forEach(photo => {
        expect(photo.tagName.toLowerCase()).toBe('img')
        expect(photo.getAttribute('alt')).toBeTruthy()
        expect(photo.classList.contains('founder-photo')).toBe(true)
      })
    })

    it('should display founder titles with proper hierarchy', async () => {
      const { createAboutComponent } = await import(
        '../src/js/about-component.js'
      )
      aboutComponent = createAboutComponent(aboutContainer)
      aboutComponent.render()

      const founderTitles = document.querySelectorAll('.founder-title')

      founderTitles.forEach(title => {
        expect(title.textContent).toMatch(/(Director|Lead|Manager)/i)
        expect(title.classList.contains('founder-title')).toBe(true)
      })
    })

    it('should show founder expertise areas clearly', async () => {
      const { createAboutComponent } = await import(
        '../src/js/about-component.js'
      )
      aboutComponent = createAboutComponent(aboutContainer)
      aboutComponent.render()

      const expertiseAreas = document.querySelectorAll('.founder-expertise')
      expect(expertiseAreas.length).toBe(2)

      const alexExpertise = document.querySelector(
        '[data-founder="alex-chen"] .founder-expertise'
      )
      const sarahExpertise = document.querySelector(
        '[data-founder="sarah-wong"] .founder-expertise'
      )

      expect(alexExpertise.textContent).toMatch(
        /(strategy|consulting|business)/i
      )
      expect(sarahExpertise.textContent).toMatch(
        /(technical|development|innovation)/i
      )
    })

    it('should balance confidence without overstating capabilities', async () => {
      const { createAboutComponent } = await import(
        '../src/js/about-component.js'
      )
      aboutComponent = createAboutComponent(aboutContainer)
      aboutComponent.render()

      const founderDescriptions = document.querySelectorAll(
        '.founder-background'
      )

      founderDescriptions.forEach(description => {
        const text = description.textContent.toLowerCase()

        // Should not use overly promotional language
        expect(text).not.toMatch(
          /(best|greatest|ultimate|perfect|revolutionary)/i
        )

        // Should use professional, measured language
        expect(text).toMatch(/(experience|expertise|specializes|passionate)/i)
      })
    })
  })

  describe('Credibility System Presentation - Failing Tests', () => {
    it('should use visual hierarchy to emphasize key credentials', async () => {
      const { createAboutComponent } = await import(
        '../src/js/about-component.js'
      )
      aboutComponent = createAboutComponent(aboutContainer)
      aboutComponent.render()

      const keyCredentials = document.querySelectorAll('.key-credential')
      expect(keyCredentials.length).toBeGreaterThan(0)

      keyCredentials.forEach(credential => {
        const computedStyle = window.getComputedStyle(credential)
        // Should have visual emphasis (larger font, different color, etc.)
        expect(credential.classList.contains('key-credential')).toBe(true)
      })
    })

    it('should display trust indicators with appropriate styling', async () => {
      const { createAboutComponent } = await import(
        '../src/js/about-component.js'
      )
      aboutComponent = createAboutComponent(aboutContainer)
      aboutComponent.render()

      const trustIndicators = document.querySelectorAll('.trust-indicator')
      expect(trustIndicators.length).toBeGreaterThan(0)

      trustIndicators.forEach(indicator => {
        expect(indicator.classList.contains('trust-indicator')).toBe(true)

        // Should have icon or visual element
        const icon = indicator.querySelector('.trust-icon')
        expect(icon).toBeTruthy()
      })
    })

    it('should organize credibility elements in logical groups', async () => {
      const { createAboutComponent } = await import(
        '../src/js/about-component.js'
      )
      aboutComponent = createAboutComponent(aboutContainer)
      aboutComponent.render()

      const credibilityGroups = document.querySelectorAll('.credibility-group')
      expect(credibilityGroups.length).toBeGreaterThan(1)

      // Should have different types of credibility
      const experienceGroup = document.querySelector(
        '.credibility-group[data-type="experience"]'
      )
      const expertiseGroup = document.querySelector(
        '.credibility-group[data-type="expertise"]'
      )
      const resultsGroup = document.querySelector(
        '.credibility-group[data-type="results"]'
      )

      expect(experienceGroup).toBeTruthy()
      expect(expertiseGroup).toBeTruthy()
      expect(resultsGroup).toBeTruthy()
    })

    it('should maintain professional tone throughout credibility content', async () => {
      const { createAboutComponent } = await import(
        '../src/js/about-component.js'
      )
      aboutComponent = createAboutComponent(aboutContainer)
      aboutComponent.render()

      const allCredibilityText = document
        .querySelector('.about-credibility')
        .textContent.toLowerCase()

      // Should use professional language
      expect(allCredibilityText).toMatch(
        /(expertise|experience|proven|certified|qualified)/i
      )

      // Should avoid overly promotional language
      expect(allCredibilityText).not.toMatch(
        /(amazing|incredible|unbelievable|revolutionary|game-changing)/i
      )
    })
  })
})
