// Service Content Tests
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

// Mock IntersectionObserver
global.IntersectionObserver = vi
  .fn()
  .mockImplementation((callback, options) => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
    root: null,
    rootMargin: '',
    thresholds: [],
  }))

// Mock the translation system with comprehensive service content
vi.mock('../src/js/translation-system.js', () => ({
  translationManager: {
    getTranslations: () => ({
      services: {
        title: 'Our Services',
        subtitle: 'Comprehensive business solutions for Hong Kong companies',
        consulting: {
          title: 'Business Consulting',
          description:
            'Strategic guidance to transform your business operations and drive growth in the Hong Kong market. Our AI-enhanced methodologies provide deeper insights while maintaining focus on human expertise and practical solutions.',
          features: [
            'Market Analysis & Strategy',
            'Process Optimization with AI insights',
            'Digital Transformation Planning',
            'Performance Analytics & Reporting',
          ],
          benefits: [
            'Increased operational efficiency by 30%',
            'Data-driven decision making',
            'Competitive advantage in Hong Kong market',
            'Sustainable growth strategies',
          ],
          methodologies: [
            'Lean Six Sigma with AI analytics',
            'Design Thinking workshops',
            'Agile transformation coaching',
            'Change management consulting',
          ],
        },
        web: {
          title: 'Web Development',
          description:
            'Modern, responsive websites and applications tailored for Hong Kong businesses. We leverage AI tools to accelerate development while ensuring every solution is crafted with human creativity and local market understanding.',
          features: [
            'Responsive Design for all devices',
            'E-commerce Solutions with AI recommendations',
            'Multi-language Support (EN/ZH-HK/ZH-CN)',
            'Performance Optimization & SEO',
          ],
          benefits: [
            'Mobile-first design for Hong Kong users',
            'Faster time-to-market with AI assistance',
            'Enhanced user experience',
            'Improved search engine visibility',
          ],
          methodologies: [
            'User-centered design process',
            'AI-assisted code generation',
            'Continuous integration/deployment',
            'Performance monitoring & optimization',
          ],
        },
        team: {
          title: 'Team Building',
          description:
            'Strengthen your team dynamics and improve collaboration with our proven methodologies. AI-powered personality assessments complement traditional team building to create more effective and harmonious work environments.',
          features: [
            'Leadership Development Programs',
            'Communication Training with AI insights',
            'Conflict Resolution Strategies',
            'Cultural Integration for diverse teams',
          ],
          benefits: [
            'Improved team productivity by 25%',
            'Better cross-cultural communication',
            'Reduced workplace conflicts',
            'Enhanced employee satisfaction',
          ],
          methodologies: [
            'AI-enhanced personality profiling',
            'Interactive workshop facilitation',
            'Ongoing coaching and support',
            'Measurable outcome tracking',
          ],
        },
      },
    }),
    switchLanguage: vi.fn(),
  },
}))

// Import after mocking - will be imported in beforeEach
let createServiceCardsComponent

describe('Service Content and Descriptions', () => {
  let serviceContainer
  let serviceComponent

  beforeEach(async () => {
    // Import the component
    const module = await import('../src/js/service-cards-component.js')
    createServiceCardsComponent = module.createServiceCardsComponent

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

  describe('Service Content Rendering in Multiple Languages', () => {
    it('should render service content in English by default', () => {
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

    it('should display comprehensive service descriptions', () => {
      const serviceCards = document.querySelectorAll('.service-card')

      serviceCards.forEach(card => {
        const description = card.querySelector('.service-description')
        expect(description).toBeTruthy()
        expect(description.textContent.length).toBeGreaterThan(100) // Substantial descriptions
      })
    })

    it('should render service features for each service', () => {
      const serviceCards = document.querySelectorAll('.service-card')

      serviceCards.forEach(card => {
        const features = card.querySelectorAll('.service-features li')
        expect(features.length).toBeGreaterThan(0)
        expect(features.length).toBeLessThanOrEqual(4) // Reasonable number of features
      })
    })

    it('should update content when language changes', async () => {
      // Mock Chinese translations
      const { translationManager } = await import(
        '../src/js/translation-system.js'
      )
      translationManager.getTranslations.mockReturnValue({
        services: {
          title: '我們的服務',
          subtitle: '為香港企業提供全面的商業解決方案',
          consulting: {
            title: '商業諮詢',
            description: '提供策略指導，協助您轉型業務營運並推動香港市場增長。',
            features: ['市場分析與策略', '流程優化', '數碼轉型', '績效分析'],
          },
          web: {
            title: '網站開發',
            description: '為香港企業量身定制的現代化響應式網站和應用程式。',
            features: [
              '響應式設計',
              '電子商務解決方案',
              '多語言支援',
              '性能優化',
            ],
          },
          team: {
            title: '團隊建設',
            description: '運用我們經過驗證的方法論，加強團隊動力並改善協作。',
            features: ['領導力發展', '溝通培訓', '衝突解決', '文化融合'],
          },
        },
      })

      // Update component content
      serviceComponent.updateContent()

      // Check that Chinese content is displayed
      const servicesTitle = document.querySelector('.services-title')
      expect(servicesTitle.textContent).toBe('我們的服務')
    })

    it('should handle missing translations gracefully', async () => {
      // Mock incomplete translations
      const { translationManager } = await import(
        '../src/js/translation-system.js'
      )
      translationManager.getTranslations.mockReturnValue({
        services: {
          consulting: {
            title: 'Business Consulting',
            // Missing description and features
          },
        },
      })

      // Re-render component
      serviceComponent.render()

      const consultingCard = document.querySelector(
        '[data-service="consulting"]'
      )
      expect(consultingCard).toBeTruthy()
      expect(consultingCard.querySelector('.service-title').textContent).toBe(
        'Business Consulting'
      )
    })
  })

  describe('AI Positioning in Service Descriptions', () => {
    it('should position AI as enhancement tool, not primary value proposition', () => {
      const serviceDescriptions = document.querySelectorAll(
        '.service-description'
      )

      serviceDescriptions.forEach(description => {
        const text = description.textContent.toLowerCase()

        // AI should be mentioned as enhancement, not the main focus
        if (text.includes('ai')) {
          expect(text).toMatch(
            /ai[- ]?(enhanced|assisted|powered|insights|tools)/
          )
          expect(text).not.toMatch(/^ai /) // Should not start with AI
          expect(text).toMatch(
            /(human|expertise|practical|solutions|creativity)/
          ) // Should emphasize human elements
        }
      })
    })

    it('should emphasize human expertise alongside AI capabilities', () => {
      const consultingDescription = document.querySelector(
        '[data-service="consulting"] .service-description'
      )
      const webDescription = document.querySelector(
        '[data-service="web"] .service-description'
      )
      const teamDescription = document.querySelector(
        '[data-service="team"] .service-description'
      )

      // Check that human expertise is emphasized
      expect(consultingDescription.textContent).toMatch(
        /(human expertise|practical solutions|strategic guidance)/
      )
      expect(webDescription.textContent).toMatch(
        /(human creativity|crafted|local market understanding)/
      )
      expect(teamDescription.textContent).toMatch(
        /(proven methodologies|traditional.*complement)/
      )
    })

    it('should show AI as supporting business outcomes, not replacing human judgment', () => {
      const serviceFeatures = document.querySelectorAll('.service-features li')

      let aiMentions = 0
      let humanFocusedFeatures = 0

      serviceFeatures.forEach(feature => {
        const text = feature.textContent.toLowerCase()
        if (text.includes('ai')) {
          aiMentions++
          // AI features should be about insights, assistance, or enhancement
          expect(text).toMatch(/(insights|assistance|enhanced|recommendations)/)
        } else {
          humanFocusedFeatures++
        }
      })

      // More features should be human-focused than AI-focused
      expect(humanFocusedFeatures).toBeGreaterThan(aiMentions)
    })

    it('should include specific Hong Kong market benefits', () => {
      const serviceCards = document.querySelectorAll('.service-card')

      serviceCards.forEach(card => {
        const description = card.querySelector('.service-description')
        expect(description.textContent).toMatch(
          /(Hong Kong|local market|regional)/
        )
      })
    })
  })

  describe('Compelling Service Descriptions for Hong Kong Market', () => {
    it('should include specific benefits and outcomes', () => {
      const consultingCard = document.querySelector(
        '[data-service="consulting"]'
      )
      const description = consultingCard.querySelector('.service-description')

      expect(description.textContent).toMatch(
        /(transform|growth|efficiency|competitive advantage)/
      )
    })

    it('should mention relevant methodologies and approaches', () => {
      const serviceCards = document.querySelectorAll('.service-card')

      serviceCards.forEach(card => {
        const features = card.querySelectorAll('.service-features li')
        let hasMethodology = false

        features.forEach(feature => {
          const text = feature.textContent.toLowerCase()
          if (
            text.includes('strategy') ||
            text.includes('optimization') ||
            text.includes('development') ||
            text.includes('training') ||
            text.includes('analysis') ||
            text.includes('support')
          ) {
            hasMethodology = true
          }
        })

        expect(hasMethodology).toBe(true)
      })
    })

    it('should focus on practical business value', () => {
      const serviceDescriptions = document.querySelectorAll(
        '.service-description'
      )

      serviceDescriptions.forEach(description => {
        const text = description.textContent.toLowerCase()
        expect(text).toMatch(
          /(business|growth|efficiency|solutions|results|outcomes|success)/
        )
      })
    })

    it('should be appropriate length for readability', () => {
      const serviceDescriptions = document.querySelectorAll(
        '.service-description'
      )

      serviceDescriptions.forEach(description => {
        const wordCount = description.textContent.split(' ').length
        expect(wordCount).toBeGreaterThan(15) // Substantial content
        expect(wordCount).toBeLessThan(50) // Not overwhelming
      })
    })
  })

  describe('Content System Maintainability', () => {
    it('should have consistent content structure across services', () => {
      const serviceCards = document.querySelectorAll('.service-card')

      serviceCards.forEach(card => {
        expect(card.querySelector('.service-title')).toBeTruthy()
        expect(card.querySelector('.service-description')).toBeTruthy()
        expect(card.querySelector('.service-features')).toBeTruthy()
      })
    })

    it('should support easy content updates', () => {
      // Test that content can be updated without breaking structure
      const originalTitle =
        document.querySelector('.services-title').textContent

      // Update content
      serviceComponent.updateContent()

      // Structure should remain intact
      expect(document.querySelector('.services-title')).toBeTruthy()
      expect(document.querySelectorAll('.service-card')).toHaveLength(3)
    })

    it('should maintain accessibility with content changes', () => {
      const serviceCards = document.querySelectorAll('.service-card')

      serviceCards.forEach(card => {
        expect(card.getAttribute('role')).toBe('article')
        expect(card.getAttribute('aria-label')).toBeTruthy()
        expect(card.getAttribute('tabindex')).toBe('0')
      })
    })
  })
})
