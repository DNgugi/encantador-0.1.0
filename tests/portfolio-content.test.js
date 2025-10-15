// Portfolio Content Tests
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

describe('Portfolio Content and Placeholders (TDD)', () => {
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

  describe('Portfolio Content Rendering', () => {
    it('should render exactly 3 portfolio items based on founders previous work', () => {
      const portfolioItems = document.querySelectorAll('.portfolio-item')
      expect(portfolioItems).toHaveLength(3)
    })

    it('should render Digital Transformation Strategy consulting project', () => {
      const consultingProject = document.querySelector(
        '[data-id="consulting-transformation"]'
      )
      expect(consultingProject).toBeTruthy()
      expect(consultingProject.dataset.category).toBe('consulting')

      const title = consultingProject.querySelector('.portfolio-item-title')
      expect(title.textContent).toBe('Digital Transformation Strategy')
    })

    it('should render Multilingual E-commerce Platform web project', () => {
      const webProject = document.querySelector(
        '[data-id="web-multilingual-platform"]'
      )
      expect(webProject).toBeTruthy()
      expect(webProject.dataset.category).toBe('web')

      const title = webProject.querySelector('.portfolio-item-title')
      expect(title.textContent).toBe('Multilingual E-commerce Platform')
    })

    it('should render Cross-Cultural Team Integration team building project', () => {
      const teamProject = document.querySelector(
        '[data-id="team-cultural-integration"]'
      )
      expect(teamProject).toBeTruthy()
      expect(teamProject.dataset.category).toBe('team')

      const title = teamProject.querySelector('.portfolio-item-title')
      expect(title.textContent).toBe('Cross-Cultural Team Integration')
    })

    it('should display project descriptions focusing on founders methodologies', () => {
      const portfolioItems = document.querySelectorAll('.portfolio-item')

      portfolioItems.forEach(item => {
        const description = item.querySelector('.portfolio-item-description')
        expect(description).toBeTruthy()
        expect(description.textContent.length).toBeGreaterThan(50)

        // Should mention AI integration or human-centered approach
        const text = description.textContent.toLowerCase()
        const hasMethodology =
          text.includes('ai') ||
          text.includes('human') ||
          text.includes('methodology') ||
          text.includes('approach')

        if (!hasMethodology) {
          console.log('Failed description:', description.textContent)
        }
        expect(hasMethodology).toBe(true)
      })
    })

    it('should display project timelines for each portfolio item', () => {
      const portfolioItems = document.querySelectorAll('.portfolio-item')

      portfolioItems.forEach(item => {
        const timeline = item.querySelector('.portfolio-timeline')
        expect(timeline).toBeTruthy()
        expect(timeline.textContent).toMatch(/\d+\s+(month|months)/)
      })
    })

    it('should render portfolio content in multiple languages', () => {
      // Test that content structure supports multiple languages
      const portfolioItems = document.querySelectorAll('.portfolio-item')

      portfolioItems.forEach(item => {
        const title = item.querySelector('.portfolio-item-title')
        const description = item.querySelector('.portfolio-item-description')

        expect(title).toBeTruthy()
        expect(description).toBeTruthy()

        // Content should be non-empty
        expect(title.textContent.trim().length).toBeGreaterThan(0)
        expect(description.textContent.trim().length).toBeGreaterThan(0)
      })
    })
  })

  describe('Project Timelines and Key Learnings', () => {
    it('should display detailed project timelines in modal', () => {
      const portfolioItem = document.querySelector('.portfolio-item')
      portfolioItem.dispatchEvent(new Event('click'))

      const projectTimeline = document.querySelector('.project-timeline')
      expect(projectTimeline).toBeTruthy()

      const timelineContent = projectTimeline.textContent
      expect(timelineContent).toMatch(/\d+\s+(month|months)/)
    })

    it('should display key learnings that reflect founders expertise', () => {
      const portfolioItem = document.querySelector('.portfolio-item')
      portfolioItem.dispatchEvent(new Event('click'))

      const keyLearnings = document.querySelector('.key-learnings')
      expect(keyLearnings).toBeTruthy()

      const learningsText = keyLearnings.textContent.toLowerCase()

      // Should contain insights about AI, human expertise, or Hong Kong market
      const hasRelevantLearnings =
        learningsText.includes('ai') ||
        learningsText.includes('human') ||
        learningsText.includes('hong kong') ||
        learningsText.includes('cultural')
      expect(hasRelevantLearnings).toBe(true)
    })

    it('should display methodology information for each project', () => {
      const portfolioItems = document.querySelectorAll('.portfolio-item')

      // Test each project's methodology
      portfolioItems.forEach(item => {
        item.dispatchEvent(new Event('click'))

        const methodology = document.querySelector('.project-methodology')
        expect(methodology).toBeTruthy()

        const methodologyText = methodology.textContent
        expect(methodologyText.length).toBeGreaterThan(20)

        // Close modal for next iteration
        const closeButton = document.querySelector('.modal-close')
        closeButton.dispatchEvent(new Event('click'))
      })
    })

    it('should display technologies used that align with Studio Encantador services', () => {
      const portfolioItem = document.querySelector('[data-category="web"]')
      portfolioItem.dispatchEvent(new Event('click'))

      const technologies = document.querySelector('.project-technologies')
      expect(technologies).toBeTruthy()

      const techTags = technologies.querySelectorAll('.tech-tag')
      expect(techTags.length).toBeGreaterThan(0)

      // Web project should include relevant technologies
      const techTexts = Array.from(techTags).map(tag =>
        tag.textContent.toLowerCase()
      )
      const hasRelevantTech = techTexts.some(
        tech =>
          tech.includes('react') ||
          tech.includes('node') ||
          tech.includes('mongodb') ||
          tech.includes('api')
      )
      expect(hasRelevantTech).toBe(true)
    })
  })

  describe('Founders Previous Work Focus', () => {
    it('should emphasize AI as enhancement tool rather than primary value', () => {
      const consultingProject = document.querySelector(
        '[data-category="consulting"]'
      )
      consultingProject.dispatchEvent(new Event('click'))

      const description = document.querySelector('.project-description')
      const methodology = document.querySelector('.project-methodology')

      const combinedText = (
        description.textContent +
        ' ' +
        methodology.textContent
      ).toLowerCase()

      // Should mention AI but emphasize human expertise
      expect(combinedText).toContain('ai')
      const hasHumanFocus =
        combinedText.includes('human') ||
        combinedText.includes('expertise') ||
        combinedText.includes('decision')
      expect(hasHumanFocus).toBe(true)
    })

    it('should highlight Hong Kong market expertise', () => {
      const portfolioItems = document.querySelectorAll('.portfolio-item')
      let hasHongKongFocus = false

      portfolioItems.forEach(item => {
        const description = item.querySelector('.portfolio-item-description')
        if (description.textContent.toLowerCase().includes('hong kong')) {
          hasHongKongFocus = true
        }
      })

      expect(hasHongKongFocus).toBe(true)
    })

    it('should demonstrate practical business outcomes', () => {
      const portfolioItems = document.querySelectorAll('.portfolio-item')

      portfolioItems.forEach(item => {
        item.dispatchEvent(new Event('click'))

        const keyLearnings = document.querySelector('.key-learnings')
        const learningsText = keyLearnings.textContent.toLowerCase()

        // Should contain practical insights
        const hasPracticalOutcomes =
          learningsText.includes('success') ||
          learningsText.includes('effective') ||
          learningsText.includes('important') ||
          learningsText.includes('crucial')
        expect(hasPracticalOutcomes).toBe(true)

        // Close modal for next iteration
        const closeButton = document.querySelector('.modal-close')
        closeButton.dispatchEvent(new Event('click'))
      })
    })

    it('should showcase diverse service capabilities', () => {
      const categories = ['consulting', 'web', 'team']

      categories.forEach(category => {
        const categoryItems = document.querySelectorAll(
          `[data-category="${category}"]`
        )
        expect(categoryItems.length).toBeGreaterThan(0)
      })

      // Should have exactly one project per service category
      expect(
        document.querySelectorAll('[data-category="consulting"]')
      ).toHaveLength(1)
      expect(document.querySelectorAll('[data-category="web"]')).toHaveLength(1)
      expect(document.querySelectorAll('[data-category="team"]')).toHaveLength(
        1
      )
    })
  })

  describe('Content Scalability', () => {
    it('should support easy addition of new portfolio items', () => {
      // Test that the component structure supports scalability
      const portfolioGrid = document.querySelector('.portfolio-grid')
      expect(portfolioGrid).toBeTruthy()

      // Grid should be flexible for additional items
      const gridStyle = window.getComputedStyle(portfolioGrid)
      expect(gridStyle.display).toBe('grid')
    })

    it('should maintain consistent formatting across all portfolio items', () => {
      const portfolioItems = document.querySelectorAll('.portfolio-item')

      portfolioItems.forEach(item => {
        // Each item should have consistent structure
        expect(item.querySelector('.portfolio-item-image')).toBeTruthy()
        expect(item.querySelector('.portfolio-item-content')).toBeTruthy()
        expect(item.querySelector('.portfolio-item-title')).toBeTruthy()
        expect(item.querySelector('.portfolio-item-description')).toBeTruthy()
        expect(item.querySelector('.portfolio-item-meta')).toBeTruthy()
        expect(item.querySelector('.portfolio-category')).toBeTruthy()
        expect(item.querySelector('.portfolio-timeline')).toBeTruthy()
      })
    })

    it('should preserve SEO optimization for portfolio content', () => {
      const portfolioItems = document.querySelectorAll('.portfolio-item')

      portfolioItems.forEach(item => {
        const image = item.querySelector('img')
        const title = item.querySelector('.portfolio-item-title')

        // Images should have proper alt text
        expect(image.getAttribute('alt')).toBeTruthy()
        expect(image.getAttribute('alt')).toBe(title.textContent)

        // Items should have proper ARIA labels
        expect(item.getAttribute('aria-label')).toBeTruthy()
      })
    })
  })
})
