# Implementation Plan: Automated Marketing & Sales Engine

## Project Structure Overview

```
studio-encantador-website/
├── src/
│   ├── components/
│   │   ├── chatbot/
│   │   ├── assessment/
│   │   ├── personalization/
│   │   ├── booking/
│   │   └── analytics/
│   ├── styles/
│   │   ├── components/
│   │   ├── base/
│   │   └── themes/
│   ├── js/
│   │   ├── modules/
│   │   ├── integrations/
│   │   └── utils/
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   └── translations/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/
├── config/
└── dist/
```

## Implementation Tasks

- [ ] 1. Project Foundation and Testing Infrastructure Setup
- **What**: Establish complete development environment with TDD workflow
- **Why**: Ensures code quality and proper development methodology from start
- _Requirements: All requirements foundation_

- [ ] 1.1 Initialize project structure and version control
- [ ] Open terminal in desired parent directory
- [ ] Run `mkdir studio-encantador-website && cd studio-encantador-website`
- [ ] Run `git init` to initialize version control
- [ ] Create `.gitignore`: `echo -e "node_modules/\n.DS_Store\n*.log\ndist/\n.env" > .gitignore`
- [ ] Run `npm init -y` to create package.json
- [ ] Install testing dependencies: `npm install --save-dev jest @testing-library/jest-dom @testing-library/dom jsdom`
- [ ] Install development dependencies: `npm install --save-dev eslint prettier husky lint-staged`

- [ ] 1.2 Create complete folder structure
- [ ] Create source directories: `mkdir -p src/{components/{chatbot,assessment,personalization,booking,analytics},styles/{components,base,themes},js/{modules,integrations,utils},assets/{images,icons,fonts},translations}`
- [ ] Create test directories: `mkdir -p tests/{unit,integration,e2e}`
- [ ] Create config directories: `mkdir -p {docs,config,dist}`
- [ ] Create main files: `touch src/index.html src/js/main.js src/styles/main.css`

- [ ] 1.3 Configure testing framework (RED Phase)
- [ ] Create `jest.config.js` with complete configuration:

```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  collectCoverageFrom: ['src/**/*.js', '!src/**/*.config.js'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}
```

- [ ] Create `tests/setup.js`:

```javascript
import '@testing-library/jest-dom'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock fetch
global.fetch = jest.fn()
```

- [ ] 1.4 Create package.json scripts and configuration
- [ ] Update `package.json` scripts section:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/ tests/",
    "lint:fix": "eslint src/ tests/ --fix",
    "dev": "live-server src/",
    "build": "npm run lint && npm run test && npm run build:prod",
    "build:prod": "node scripts/build.js"
  }
}
```

- [ ] Install live-server for development: `npm install --save-dev live-server`
- [ ] Run `npm test` to verify setup (should show no tests found)
- [ ] Commit initial setup: `git add . && git commit -m "Initial project setup with TDD infrastructure"`

- [ ] 2. Multi-Channel Traffic Source Detection System (TDD)
- **What**: Implement system to detect and categorize traffic sources for personalization
- **Why**: Enables personalized content delivery based on visitor origin
- _Requirements: 15.1, 15.2, 15.3_

- [ ] 2.1 Write failing tests for source detection (RED Phase)
- [ ] Create `tests/unit/source-detection.test.js`:

```javascript
import { SourceDetector } from '../../src/js/modules/source-detector.js'

describe('SourceDetector', () => {
  let detector

  beforeEach(() => {
    detector = new SourceDetector()
    // Reset URL and referrer
    delete window.location
    window.location = { search: '', href: 'https://example.com' }
    Object.defineProperty(document, 'referrer', {
      value: '',
      configurable: true,
    })
  })

  describe('UTM Parameter Detection', () => {
    test('should detect LinkedIn ads source', () => {
      window.location.search =
        '?utm_source=linkedin&utm_medium=cpc&utm_campaign=hk-leaders'
      const result = detector.detectSource()
      expect(result.source).toBe('linkedin')
      expect(result.campaign).toBe('hk-leaders')
      expect(result.medium).toBe('cpc')
    })

    test('should detect Facebook ads source', () => {
      window.location.search =
        '?utm_source=facebook&utm_medium=social&utm_campaign=transform-business'
      const result = detector.detectSource()
      expect(result.source).toBe('facebook')
      expect(result.campaign).toBe('transform-business')
    })

    test('should detect Google ads source', () => {
      window.location.search =
        '?utm_source=google&utm_medium=cpc&utm_term=hong+kong+consulting'
      const result = detector.detectSource()
      expect(result.source).toBe('google-ads')
      expect(result.term).toBe('hong+kong+consulting')
    })
  })

  describe('Referrer Detection', () => {
    test('should detect organic Google search', () => {
      Object.defineProperty(document, 'referrer', {
        value: 'https://www.google.com/search?q=business+consulting+hong+kong',
        configurable: true,
      })
      const result = detector.detectSource()
      expect(result.source).toBe('organic-search')
      expect(result.searchEngine).toBe('google')
    })

    test('should detect LinkedIn referral', () => {
      Object.defineProperty(document, 'referrer', {
        value: 'https://www.linkedin.com/feed/',
        configurable: true,
      })
      const result = detector.detectSource()
      expect(result.source).toBe('linkedin')
      expect(result.medium).toBe('referral')
    })
  })

  describe('Direct Traffic', () => {
    test('should detect direct traffic', () => {
      const result = detector.detectSource()
      expect(result.source).toBe('direct')
      expect(result.medium).toBe('none')
    })
  })

  describe('Source Persistence', () => {
    test('should store source in localStorage', () => {
      window.location.search = '?utm_source=linkedin&utm_campaign=test'
      detector.detectSource()
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'encantador_source',
        expect.stringContaining('linkedin')
      )
    })

    test('should retrieve stored source on subsequent visits', () => {
      localStorage.getItem.mockReturnValue(
        JSON.stringify({
          source: 'linkedin',
          campaign: 'previous-visit',
          timestamp: Date.now(),
        })
      )
      const result = detector.getStoredSource()
      expect(result.source).toBe('linkedin')
      expect(result.campaign).toBe('previous-visit')
    })
  })
})
```

- [ ] Run `npm test` to confirm tests fail (RED Phase)
- [ ] Commit failing tests: `git add . && git commit -m "RED: Add failing tests for source detection"`

- [ ] 2.2 Implement SourceDetector class (GREEN Phase)
- [ ] Create `src/js/modules/source-detector.js`:

```javascript
export class SourceDetector {
  constructor() {
    this.sourceMap = {
      'linkedin.com': 'linkedin',
      'facebook.com': 'facebook',
      'instagram.com': 'instagram',
      'twitter.com': 'twitter',
      'youtube.com': 'youtube',
      'tiktok.com': 'tiktok',
      'google.com': 'organic-search',
      'bing.com': 'organic-search',
      'baidu.com': 'organic-search',
    }
    this.storageKey = 'encantador_source'
  }

  detectSource() {
    const urlParams = new URLSearchParams(window.location.search)
    const referrer = document.referrer

    // Check UTM parameters first
    const utmSource = urlParams.get('utm_source')
    if (utmSource) {
      const sourceData = {
        source: this.mapUtmSource(utmSource),
        medium: urlParams.get('utm_medium') || 'unknown',
        campaign: urlParams.get('utm_campaign') || 'unknown',
        content: urlParams.get('utm_content') || null,
        term: urlParams.get('utm_term') || null,
        timestamp: Date.now(),
        type: 'utm',
      }
      this.storeSource(sourceData)
      return sourceData
    }

    // Check referrer
    if (referrer) {
      const sourceData = this.analyzeReferrer(referrer)
      this.storeSource(sourceData)
      return sourceData
    }

    // Default to direct traffic
    const sourceData = {
      source: 'direct',
      medium: 'none',
      timestamp: Date.now(),
      type: 'direct',
    }
    this.storeSource(sourceData)
    return sourceData
  }

  mapUtmSource(utmSource) {
    const sourceMapping = {
      google: 'google-ads',
      bing: 'bing-ads',
      linkedin: 'linkedin',
      facebook: 'facebook',
      instagram: 'instagram',
      twitter: 'twitter',
      youtube: 'youtube',
      tiktok: 'tiktok',
    }
    return sourceMapping[utmSource.toLowerCase()] || utmSource
  }

  analyzeReferrer(referrer) {
    try {
      const referrerUrl = new URL(referrer)
      const domain = referrerUrl.hostname.replace('www.', '')

      for (const [sourceDomain, sourceType] of Object.entries(this.sourceMap)) {
        if (domain.includes(sourceDomain)) {
          return {
            source:
              sourceType === 'organic-search' ? 'organic-search' : sourceType,
            medium: sourceType === 'organic-search' ? 'organic' : 'referral',
            referrer: referrer,
            searchEngine:
              sourceType === 'organic-search'
                ? this.getSearchEngine(domain)
                : null,
            timestamp: Date.now(),
            type: 'referrer',
          }
        }
      }

      // Unknown referrer
      return {
        source: 'referral',
        medium: 'referral',
        referrer: referrer,
        timestamp: Date.now(),
        type: 'referrer',
      }
    } catch (error) {
      console.error('Error analyzing referrer:', error)
      return {
        source: 'unknown',
        medium: 'unknown',
        timestamp: Date.now(),
        type: 'error',
      }
    }
  }

  getSearchEngine(domain) {
    if (domain.includes('google')) return 'google'
    if (domain.includes('bing')) return 'bing'
    if (domain.includes('baidu')) return 'baidu'
    return 'unknown'
  }

  storeSource(sourceData) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(sourceData))
    } catch (error) {
      console.error('Error storing source data:', error)
    }
  }

  getStoredSource() {
    try {
      const stored = localStorage.getItem(this.storageKey)
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.error('Error retrieving stored source:', error)
      return null
    }
  }

  getCurrentSource() {
    // First check for current session source
    const currentSource = this.detectSource()

    // If direct traffic, check for stored source from previous session
    if (currentSource.source === 'direct') {
      const storedSource = this.getStoredSource()
      if (storedSource && this.isSourceValid(storedSource)) {
        return storedSource
      }
    }

    return currentSource
  }

  isSourceValid(sourceData) {
    // Source is valid if less than 30 days old
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000
    return Date.now() - sourceData.timestamp < thirtyDaysMs
  }
}
```

- [ ] Run `npm test` to verify tests pass (GREEN Phase)
- [ ] Commit working implementation: `git add . && git commit -m "GREEN: Implement SourceDetector class"`

- [ ] 2.3 Refactor and optimize (REFACTOR Phase)
- [ ] Add error handling and edge cases
- [ ] Optimize performance with caching
- [ ] Add comprehensive logging for debugging
- [ ] Run `npm test` to ensure tests still pass
- [ ] Run `npm run lint` to check code quality
- [ ] Commit refactored code: `git add . && git commit -m "REFACTOR: Optimize SourceDetector performance and error handling"`

- [ ] 3. Dynamic Content Personalization Engine (TDD)
- **What**: Create system to personalize content based on traffic source
- **Why**: Increases conversion rates through targeted messaging
- _Requirements: 15.1, 15.2, 15.4_

- [ ] 3.1 Write failing tests for personalization engine (RED Phase)
- [ ] Create `tests/unit/personalization-engine.test.js`:

```javascript
import { PersonalizationEngine } from '../../src/js/modules/personalization-engine.js'
import { SourceDetector } from '../../src/js/modules/source-detector.js'

jest.mock('../../src/js/modules/source-detector.js')

describe('PersonalizationEngine', () => {
  let engine
  let mockSourceDetector

  beforeEach(() => {
    mockSourceDetector = new SourceDetector()
    engine = new PersonalizationEngine(mockSourceDetector)

    // Mock DOM elements
    document.body.innerHTML = `
      <div id="hero-headline">Default Headline</div>
      <div id="hero-subheadline">Default Subheadline</div>
      <div class="cta-button">Default CTA</div>
    `
  })

  describe('LinkedIn Traffic Personalization', () => {
    test('should personalize content for LinkedIn ads', () => {
      mockSourceDetector.getCurrentSource.mockReturnValue({
        source: 'linkedin',
        medium: 'cpc',
        campaign: 'hk-leaders',
      })

      engine.personalizeContent()

      const headline = document.getElementById('hero-headline')
      expect(headline.textContent).toBe(
        "Integrated Consulting for HK's Leaders"
      )
    })

    test('should show executive-focused CTAs for LinkedIn traffic', () => {
      mockSourceDetector.getCurrentSource.mockReturnValue({
        source: 'linkedin',
        medium: 'cpc',
      })

      engine.personalizeContent()

      const cta = document.querySelector('.cta-button')
      expect(cta.textContent).toBe('Book Executive Consultation')
    })
  })

  describe('Organic Search Personalization', () => {
    test('should personalize for web development searches', () => {
      mockSourceDetector.getCurrentSource.mockReturnValue({
        source: 'organic-search',
        searchEngine: 'google',
        referrer: 'https://google.com/search?q=web+development+hong+kong',
      })

      engine.personalizeContent()

      const headline = document.getElementById('hero-headline')
      expect(headline.textContent).toBe('Web Development that Drives Growth')
    })

    test('should personalize for business consulting searches', () => {
      mockSourceDetector.getCurrentSource.mockReturnValue({
        source: 'organic-search',
        searchEngine: 'google',
        referrer: 'https://google.com/search?q=business+consulting+hong+kong',
      })

      engine.personalizeContent()

      const headline = document.getElementById('hero-headline')
      expect(headline.textContent).toBe(
        'Strategic Consulting for Hong Kong SMEs'
      )
    })
  })

  describe('Social Media Personalization', () => {
    test('should personalize for Facebook/Instagram traffic', () => {
      mockSourceDetector.getCurrentSource.mockReturnValue({
        source: 'facebook',
        medium: 'social',
      })

      engine.personalizeContent()

      const headline = document.getElementById('hero-headline')
      expect(headline.textContent).toBe('Transform Your Hong Kong Business')
    })
  })

  describe('Default Personalization', () => {
    test('should use default content for direct traffic', () => {
      mockSourceDetector.getCurrentSource.mockReturnValue({
        source: 'direct',
        medium: 'none',
      })

      engine.personalizeContent()

      const headline = document.getElementById('hero-headline')
      expect(headline.textContent).toBe('Where Business Magic Happens')
    })
  })

  describe('Content Mapping', () => {
    test('should return correct content mapping for source', () => {
      const mapping = engine.getContentMapping('linkedin')
      expect(mapping.headline).toBe("Integrated Consulting for HK's Leaders")
      expect(mapping.cta).toBe('Book Executive Consultation')
    })

    test('should handle unknown sources gracefully', () => {
      const mapping = engine.getContentMapping('unknown-source')
      expect(mapping.headline).toBe('Where Business Magic Happens')
    })
  })
})
```

- [ ] Run `npm test` to confirm tests fail (RED Phase)
- [ ] Commit failing tests: `git add . && git commit -m "RED: Add failing tests for personalization engine"`

- [ ] 3.2 Implement PersonalizationEngine class (GREEN Phase)
- [ ] Create `src/js/modules/personalization-engine.js`:

```javascript
export class PersonalizationEngine {
  constructor(sourceDetector) {
    this.sourceDetector = sourceDetector
    this.contentMappings = {
      linkedin: {
        headline: "Integrated Consulting for HK's Leaders",
        subheadline:
          "Strategic partnerships that drive measurable results for Hong Kong's most ambitious companies",
        cta: 'Book Executive Consultation',
        description: 'Executive-focused solutions for strategic growth',
      },
      facebook: {
        headline: 'Transform Your Hong Kong Business',
        subheadline:
          'Discover how AI-enhanced consulting creates lasting change for growing companies',
        cta: 'Start Your Transformation',
        description: 'Visual storytelling of business transformation',
      },
      instagram: {
        headline: 'Transform Your Hong Kong Business',
        subheadline:
          'Behind-the-scenes look at how we help companies grow and thrive',
        cta: 'See Our Process',
        description: 'Visual storytelling with community focus',
      },
      twitter: {
        headline: 'Strategic Solutions for Growing Companies',
        subheadline:
          'Quick insights and proven strategies for Hong Kong businesses ready to scale',
        cta: 'Get Strategic Insights',
        description: 'Concise, actionable business advice',
      },
      youtube: {
        headline: 'From Strategy to Execution in One Partnership',
        subheadline:
          'Watch how we integrate consulting, digital, and culture for complete business transformation',
        cta: 'Watch Success Stories',
        description: 'Video-first educational content',
      },
      'google-ads': {
        headline: 'Proven Results for Hong Kong Mid-Market Companies',
        subheadline:
          'Integrated solutions that deliver measurable outcomes for companies ready to grow',
        cta: 'See Proven Results',
        description: 'Results-focused messaging with credibility',
      },
      'organic-search-web': {
        headline: 'Web Development that Drives Growth',
        subheadline:
          'Future-proof digital platforms that integrate seamlessly with your business strategy',
        cta: 'Explore Digital Solutions',
        description: 'Technical expertise with business focus',
      },
      'organic-search-consulting': {
        headline: 'Strategic Consulting for Hong Kong SMEs',
        subheadline:
          'AI-enhanced business strategies that deliver clarity and measurable results',
        cta: 'Get Strategic Clarity',
        description: 'Problem-solving focus for business challenges',
      },
      'organic-search-team': {
        headline: 'Culture Transformation for Hong Kong Teams',
        subheadline:
          'Build high-performing teams through strategic culture development and AI insights',
        cta: 'Transform Your Culture',
        description: 'Team building and organizational development',
      },
      'referral-accounting': {
        headline: 'Trusted by Your Financial Advisors',
        subheadline:
          'Strategic partnerships that complement your financial planning with operational excellence',
        cta: 'Explore Partnership Benefits',
        description: 'Trust-based messaging with financial integration',
      },
      'referral-chamber': {
        headline: "Supporting Hong Kong's Business Community",
        subheadline:
          "Proud member of Hong Kong's business ecosystem, helping companies grow together",
        cta: 'Join Our Community',
        description: 'Community focus with local pride',
      },
      direct: {
        headline: 'Where Business Magic Happens',
        subheadline:
          "We weave human creativity with AI brilliance to craft solutions that don't just work—they enchant",
        cta: 'Discover the Magic',
        description: 'Brand-focused enchanting messaging',
      },
    }
  }

  personalizeContent() {
    const source = this.sourceDetector.getCurrentSource()
    const contentKey = this.determineContentKey(source)
    const content = this.getContentMapping(contentKey)

    this.applyContentToDOM(content)
    this.trackPersonalization(source, contentKey)
  }

  determineContentKey(source) {
    // Handle organic search with specific intent
    if (source.source === 'organic-search' && source.referrer) {
      const searchQuery = this.extractSearchQuery(source.referrer)
      if (
        searchQuery.includes('web') ||
        searchQuery.includes('development') ||
        searchQuery.includes('website')
      ) {
        return 'organic-search-web'
      }
      if (
        searchQuery.includes('team') ||
        searchQuery.includes('culture') ||
        searchQuery.includes('building')
      ) {
        return 'organic-search-team'
      }
      if (
        searchQuery.includes('consulting') ||
        searchQuery.includes('strategy') ||
        searchQuery.includes('business')
      ) {
        return 'organic-search-consulting'
      }
    }

    // Handle referral sources
    if (source.source === 'referral' && source.referrer) {
      if (
        source.referrer.includes('accounting') ||
        source.referrer.includes('cpa')
      ) {
        return 'referral-accounting'
      }
      if (
        source.referrer.includes('chamber') ||
        source.referrer.includes('hktdc')
      ) {
        return 'referral-chamber'
      }
    }

    // Default to source name
    return source.source || 'direct'
  }

  extractSearchQuery(referrer) {
    try {
      const url = new URL(referrer)
      const query =
        url.searchParams.get('q') || url.searchParams.get('query') || ''
      return query.toLowerCase()
    } catch (error) {
      return ''
    }
  }

  getContentMapping(contentKey) {
    return this.contentMappings[contentKey] || this.contentMappings['direct']
  }

  applyContentToDOM(content) {
    // Update headline
    const headline = document.getElementById('hero-headline')
    if (headline) {
      headline.textContent = content.headline
    }

    // Update subheadline
    const subheadline = document.getElementById('hero-subheadline')
    if (subheadline) {
      subheadline.textContent = content.subheadline
    }

    // Update CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-button')
    ctaButtons.forEach(button => {
      button.textContent = content.cta
    })

    // Add source-specific CSS class for styling
    document.body.classList.add(
      `source-${this.normalizeSourceName(contentKey)}`
    )
  }

  normalizeSourceName(contentKey) {
    return contentKey.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
  }

  trackPersonalization(source, contentKey) {
    // Track personalization for analytics
    if (window.gtag) {
      window.gtag('event', 'personalization_applied', {
        source: source.source,
        content_key: contentKey,
        campaign: source.campaign || 'none',
      })
    }

    // Store for debugging
    console.log('Personalization applied:', {
      source: source.source,
      contentKey: contentKey,
      timestamp: new Date().toISOString(),
    })
  }
}
```

- [ ] Run `npm test` to verify tests pass (GREEN Phase)
- [ ] Commit working implementation: `git add . && git commit -m "GREEN: Implement PersonalizationEngine class"`

- [ ] 3.3 Refactor and add advanced features (REFACTOR Phase)
- [ ] Add A/B testing capabilities for content variations
- [ ] Implement caching for performance optimization
- [ ] Add fallback mechanisms for failed personalizations
- [ ] Run `npm test` and `npm run lint` to verify quality
- [ ] Commit refactored code: `git add . && git commit -m "REFACTOR: Add A/B testing and performance optimizations"`

- [ ] 4. AI Business Health Assessment Tool (TDD)
- **What**: Interactive assessment tool for lead generation and qualification
- **Why**: Primary lead magnet that captures emails and qualifies prospects
- _Requirements: 14.1, 14.2, 14.3, 14.4_

- [ ] 4.1 Write failing tests for assessment tool (RED Phase)
- [ ] Create `tests/unit/assessment-tool.test.js`:

```javascript
import { AssessmentTool } from '../../src/js/modules/assessment-tool.js'

describe('AssessmentTool', () => {
  let assessment
  let mockContainer

  beforeEach(() => {
    document.body.innerHTML = '<div id="assessment-container"></div>'
    mockContainer = document.getElementById('assessment-container')
    assessment = new AssessmentTool(mockContainer)
  })

  describe('Assessment Initialization', () => {
    test('should initialize with correct question structure', () => {
      expect(assessment.questions).toHaveLength(7)
      expect(assessment.currentQuestion).toBe(0)
      expect(assessment.responses).toEqual({})
    })

    test('should render first question on start', () => {
      assessment.start()
      const questionElement = mockContainer.querySelector('.question')
      expect(questionElement).toBeTruthy()
      expect(questionElement.textContent).toContain(
        'How clear is your 3-year growth strategy?'
      )
    })
  })

  describe('Question Navigation', () => {
    beforeEach(() => {
      assessment.start()
    })

    test('should advance to next question when answer selected', () => {
      const option = mockContainer.querySelector('input[type="radio"]')
      option.checked = true

      const nextButton = mockContainer.querySelector('.next-button')
      nextButton.click()

      expect(assessment.currentQuestion).toBe(1)
    })

    test('should not advance without selecting answer', () => {
      const nextButton = mockContainer.querySelector('.next-button')
      nextButton.click()

      expect(assessment.currentQuestion).toBe(0)
      expect(mockContainer.querySelector('.error-message')).toBeTruthy()
    })

    test('should show progress bar correctly', () => {
      const progressBar = mockContainer.querySelector('.progress-bar')
      expect(progressBar.style.width).toBe('14.3%') // 1/7 questions
    })
  })

  describe('Score Calculation', () => {
    test('should calculate strategic health score correctly', () => {
      assessment.responses = {
        'strategy-clarity': 4,
        'team-understanding': 3,
      }

      const strategicScore = assessment.calculateCategoryScore('strategic')
      expect(strategicScore).toBe(70) // (4+3)/2 * 20 = 70
    })

    test('should calculate overall score correctly', () => {
      assessment.responses = {
        'strategy-clarity': 4,
        'team-understanding': 4,
        'website-leads': 3,
        'digital-integration': 3,
        'team-alignment': 4,
        'team-collaboration': 4,
        'growth-planning': 3,
      }

      const overallScore = assessment.calculateOverallScore()
      expect(overallScore).toBe(71) // Average of category scores
    })
  })

  describe('Results Display', () => {
    test('should show results with correct scores', () => {
      assessment.responses = {
        'strategy-clarity': 4,
        'team-understanding': 4,
        'website-leads': 2,
        'digital-integration': 2,
        'team-alignment': 4,
        'team-collaboration': 4,
        'growth-planning': 3,
      }

      assessment.showResults()

      const resultsContainer = mockContainer.querySelector('.results-container')
      expect(resultsContainer).toBeTruthy()

      const overallScore = mockContainer.querySelector('.overall-score')
      expect(overallScore.textContent).toContain('66')
    })

    test('should show email capture form', () => {
      assessment.showResults()

      const emailForm = mockContainer.querySelector('.email-capture-form')
      expect(emailForm).toBeTruthy()

      const emailInput = mockContainer.querySelector('input[type="email"]')
      expect(emailInput).toBeTruthy()
    })
  })

  describe('Email Capture', () => {
    test('should validate email format', () => {
      assessment.showResults()

      const emailInput = mockContainer.querySelector('input[type="email"]')
      emailInput.value = 'invalid-email'

      const submitButton = mockContainer.querySelector('.submit-email')
      submitButton.click()

      expect(mockContainer.querySelector('.email-error')).toBeTruthy()
    })

    test('should submit valid email and trigger CRM integration', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })

      assessment.showResults()

      const emailInput = mockContainer.querySelector('input[type="email"]')
      emailInput.value = 'test@example.com'

      const submitButton = mockContainer.querySelector('.submit-email')
      await submitButton.click()

      expect(fetch).toHaveBeenCalledWith(
        '/api/capture-lead',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('test@example.com'),
        })
      )
    })
  })

  describe('Recommendations Engine', () => {
    test('should recommend correct bundle based on scores', () => {
      const scores = {
        strategic: 90,
        digital: 40,
        culture: 80,
      }

      const recommendation = assessment.getRecommendation(scores)
      expect(recommendation.bundle).toBe('SME Digital Leap')
      expect(recommendation.reason).toContain('digital presence')
    })

    test('should recommend integrated solution for multiple low scores', () => {
      const scores = {
        strategic: 40,
        digital: 45,
        culture: 50,
      }

      const recommendation = assessment.getRecommendation(scores)
      expect(recommendation.bundle).toBe('Corporate Culture Reset')
    })
  })
})
```

- [ ] Run `npm test` to confirm tests fail (RED Phase)
- [ ] Commit failing tests: `git add . && git commit -m "RED: Add failing tests for assessment tool"`

- [ ] 4.2 Implement AssessmentTool class (GREEN Phase)
- [ ] Create `src/js/modules/assessment-tool.js`:

```javascript
export class AssessmentTool {
  constructor(container) {
    this.container = container
    this.currentQuestion = 0
    this.responses = {}
    this.questions = [
      {
        id: 'strategy-clarity',
        category: 'strategic',
        question: 'How clear is your 3-year growth strategy?',
        options: [
          { value: 1, text: "We don't have a formal strategy" },
          { value: 2, text: 'We have basic goals but no detailed plan' },
          { value: 3, text: 'We have a strategy but it needs refinement' },
          { value: 4, text: 'We have a clear, actionable strategy' },
          {
            value: 5,
            text: 'We have a comprehensive strategy with regular reviews',
          },
        ],
      },
      {
        id: 'team-understanding',
        category: 'strategic',
        question: 'How well does your team understand business priorities?',
        options: [
          { value: 1, text: 'Most team members are unclear about priorities' },
          { value: 2, text: 'Some team members understand the basics' },
          { value: 3, text: 'Most team members understand current priorities' },
          { value: 4, text: 'Team is well-aligned on priorities and goals' },
          { value: 5, text: 'Team actively contributes to strategic planning' },
        ],
      },
      {
        id: 'website-leads',
        category: 'digital',
        question: 'How effectively does your website generate leads?',
        options: [
          { value: 1, text: 'Our website generates very few leads' },
          { value: 2, text: 'We get some inquiries but conversion is low' },
          {
            value: 3,
            text: 'Website generates decent leads but could improve',
          },
          { value: 4, text: 'Website is a strong lead generation tool' },
          {
            value: 5,
            text: 'Website consistently generates high-quality leads',
          },
        ],
      },
      {
        id: 'digital-integration',
        category: 'digital',
        question: 'How integrated are your digital marketing efforts?',
        options: [
          { value: 1, text: 'We have minimal digital marketing presence' },
          {
            value: 2,
            text: "We use some digital tools but they're disconnected",
          },
          { value: 3, text: 'Most digital efforts are coordinated' },
          { value: 4, text: 'We have well-integrated digital marketing' },
          {
            value: 5,
            text: 'All digital touchpoints work seamlessly together',
          },
        ],
      },
      {
        id: 'team-alignment',
        category: 'culture',
        question: 'How aligned is your team on company goals?',
        options: [
          { value: 1, text: 'Team members often work in different directions' },
          { value: 2, text: 'Some alignment but frequent miscommunication' },
          { value: 3, text: 'Generally aligned with occasional conflicts' },
          { value: 4, text: 'Strong alignment with clear communication' },
          { value: 5, text: 'Perfect alignment with proactive collaboration' },
        ],
      },
      {
        id: 'team-collaboration',
        category: 'culture',
        question: 'How effectively does your team collaborate remotely?',
        options: [
          { value: 1, text: 'Remote collaboration is very challenging' },
          { value: 2, text: "We manage but it's not efficient" },
          { value: 3, text: 'Remote work is functional but could improve' },
          { value: 4, text: 'Team collaborates well remotely' },
          { value: 5, text: 'Remote collaboration is seamless and productive' },
        ],
      },
      {
        id: 'growth-planning',
        category: 'strategic',
        question: 'How prepared are you for scaling your business?',
        options: [
          { value: 1, text: "We haven't planned for growth" },
          { value: 2, text: 'We have basic ideas but no concrete plans' },
          { value: 3, text: 'We have some growth plans in development' },
          { value: 4, text: 'We have solid plans for scaling' },
          {
            value: 5,
            text: "We're fully prepared with detailed scaling strategies",
          },
        ],
      },
    ]
  }

  start() {
    this.render()
  }

  render() {
    if (this.currentQuestion >= this.questions.length) {
      this.showResults()
      return
    }

    const question = this.questions[this.currentQuestion]
    const progress = ((this.currentQuestion + 1) / this.questions.length) * 100

    this.container.innerHTML = `
      <div class="assessment-container">
        <div class="progress-container">
          <div class="progress-bar" style="width: ${progress.toFixed(1)}%"></div>
          <span class="progress-text">Question ${this.currentQuestion + 1} of ${this.questions.length}</span>
        </div>
        
        <div class="question-container">
          <h3 class="question">${question.question}</h3>
          
          <div class="options-container">
            ${question.options
              .map(
                (option, index) => `
              <label class="option-label">
                <input type="radio" name="question-${question.id}" value="${option.value}" />
                <span class="option-text">${option.text}</span>
              </label>
            `
              )
              .join('')}
          </div>
          
          <div class="navigation-container">
            ${this.currentQuestion > 0 ? '<button class="prev-button">Previous</button>' : ''}
            <button class="next-button">Next</button>
          </div>
          
          <div class="error-message" style="display: none;">
            Please select an answer before continuing.
          </div>
        </div>
      </div>
    `

    this.attachEventListeners()
  }

  attachEventListeners() {
    const nextButton = this.container.querySelector('.next-button')
    const prevButton = this.container.querySelector('.prev-button')

    nextButton.addEventListener('click', () => this.nextQuestion())

    if (prevButton) {
      prevButton.addEventListener('click', () => this.prevQuestion())
    }

    // Auto-hide error message when option is selected
    const options = this.container.querySelectorAll('input[type="radio"]')
    options.forEach(option => {
      option.addEventListener('change', () => {
        this.container.querySelector('.error-message').style.display = 'none'
      })
    })
  }

  nextQuestion() {
    const selectedOption = this.container.querySelector(
      'input[type="radio"]:checked'
    )

    if (!selectedOption) {
      this.container.querySelector('.error-message').style.display = 'block'
      return
    }

    const question = this.questions[this.currentQuestion]
    this.responses[question.id] = parseInt(selectedOption.value)

    this.currentQuestion++
    this.render()
  }

  prevQuestion() {
    if (this.currentQuestion > 0) {
      this.currentQuestion--
      this.render()
    }
  }

  calculateCategoryScore(category) {
    const categoryQuestions = this.questions.filter(
      q => q.category === category
    )
    const categoryResponses = categoryQuestions.map(q => this.responses[q.id])
    const average =
      categoryResponses.reduce((sum, val) => sum + val, 0) /
      categoryResponses.length
    return Math.round(average * 20) // Convert to 0-100 scale
  }

  calculateOverallScore() {
    const strategicScore = this.calculateCategoryScore('strategic')
    const digitalScore = this.calculateCategoryScore('digital')
    const cultureScore = this.calculateCategoryScore('culture')

    return Math.round((strategicScore + digitalScore + cultureScore) / 3)
  }

  getRecommendation(scores) {
    const { strategic, digital, culture } = scores

    // Find the lowest scoring category
    const lowestScore = Math.min(strategic, digital, culture)

    if (digital === lowestScore && digital < 60) {
      return {
        bundle: 'SME Digital Leap',
        reason:
          'Your digital presence needs the most attention. Our integrated approach will transform your online effectiveness while aligning with your business strategy.',
        focus: 'Digital transformation with strategic integration',
      }
    }

    if (culture === lowestScore && culture < 60) {
      return {
        bundle: 'Corporate Culture Reset',
        reason:
          "Team alignment and collaboration are key growth blockers. Our culture transformation approach will unlock your team's potential.",
        focus: 'Culture development with strategic alignment',
      }
    }

    if (strategic === lowestScore && strategic < 60) {
      return {
        bundle: 'Startup Launchpad',
        reason:
          'Strategic clarity is essential for growth. Our comprehensive approach will create a clear roadmap for your business success.',
        focus: 'Strategic planning with execution support',
      }
    }

    // If all scores are decent, recommend integrated approach
    return {
      bundle: 'Corporate Culture Reset',
      reason:
        'Your business shows strong fundamentals. An integrated approach will optimize all areas for maximum growth potential.',
      focus: 'Comprehensive optimization across all areas',
    }
  }

  showResults() {
    const scores = {
      strategic: this.calculateCategoryScore('strategic'),
      digital: this.calculateCategoryScore('digital'),
      culture: this.calculateCategoryScore('culture'),
    }

    const overallScore = this.calculateOverallScore()
    const recommendation = this.getRecommendation(scores)

    this.container.innerHTML = `
      <div class="results-container">
        <div class="results-header">
          <h2>Your Business Health Score</h2>
          <div class="overall-score">
            <span class="score-number">${overallScore}</span>
            <span class="score-label">Overall Score</span>
          </div>
        </div>
        
        <div class="category-scores">
          <div class="score-category">
            <h4>Strategic Health</h4>
            <div class="score-bar">
              <div class="score-fill" style="width: ${scores.strategic}%"></div>
              <span class="score-value">${scores.strategic}</span>
            </div>
          </div>
          
          <div class="score-category">
            <h4>Digital Presence</h4>
            <div class="score-bar">
              <div class="score-fill" style="width: ${scores.digital}%"></div>
              <span class="score-value">${scores.digital}</span>
            </div>
          </div>
          
          <div class="score-category">
            <h4>Team Culture</h4>
            <div class="score-bar">
              <div class="score-fill" style="width: ${scores.culture}%"></div>
              <span class="score-value">${scores.culture}</span>
            </div>
          </div>
        </div>
        
        <div class="recommendation">
          <h3>Recommended Solution</h3>
          <div class="recommended-bundle">
            <h4>${recommendation.bundle}</h4>
            <p>${recommendation.reason}</p>
            <span class="focus-area">${recommendation.focus}</span>
          </div>
        </div>
        
        <div class="email-capture">
          <h3>Get Your Detailed Report</h3>
          <p>Enter your email to receive a comprehensive analysis with specific recommendations for your business.</p>
          
          <form class="email-capture-form">
            <input type="email" placeholder="Enter your business email" required />
            <input type="text" placeholder="Company name" required />
            <button type="submit" class="submit-email">Get Detailed Report</button>
          </form>
          
          <div class="email-error" style="display: none;">
            Please enter a valid email address.
          </div>
        </div>
      </div>
    `

    this.attachResultsEventListeners(scores, overallScore, recommendation)
  }

  attachResultsEventListeners(scores, overallScore, recommendation) {
    const form = this.container.querySelector('.email-capture-form')

    form.addEventListener('submit', async e => {
      e.preventDefault()

      const email = form.querySelector('input[type="email"]').value
      const company = form.querySelector('input[type="text"]').value

      if (!this.validateEmail(email)) {
        this.container.querySelector('.email-error').style.display = 'block'
        return
      }

      await this.submitLead(
        email,
        company,
        scores,
        overallScore,
        recommendation
      )
    })
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  async submitLead(email, company, scores, overallScore, recommendation) {
    try {
      const leadData = {
        email,
        company,
        assessmentResults: {
          scores,
          overallScore,
          recommendation,
          responses: this.responses,
          timestamp: new Date().toISOString(),
        },
        source: 'assessment-tool',
      }

      const response = await fetch('/api/capture-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      })

      if (response.ok) {
        this.showSuccessMessage()
        this.triggerAutomationSequence(leadData)
      } else {
        throw new Error('Failed to submit lead')
      }
    } catch (error) {
      console.error('Error submitting lead:', error)
      this.showErrorMessage()
    }
  }

  showSuccessMessage() {
    const emailCapture = this.container.querySelector('.email-capture')
    emailCapture.innerHTML = `
      <div class="success-message">
        <h3>Thank You!</h3>
        <p>Your detailed report has been sent to your email. We'll also be in touch within 24 hours to discuss your results.</p>
        <button class="book-consultation">Book Free Consultation</button>
      </div>
    `

    const bookButton = this.container.querySelector('.book-consultation')
    bookButton.addEventListener('click', () => {
      // Redirect to booking system or open calendar widget
      window.location.href = '/book-consultation'
    })
  }

  showErrorMessage() {
    this.container.querySelector('.email-error').textContent =
      'There was an error processing your request. Please try again.'
    this.container.querySelector('.email-error').style.display = 'block'
  }

  triggerAutomationSequence(leadData) {
    // Trigger immediate email sequence
    if (window.gtag) {
      window.gtag('event', 'assessment_completed', {
        overall_score: leadData.assessmentResults.overallScore,
        recommended_bundle: leadData.assessmentResults.recommendation.bundle,
      })
    }

    // Store lead data for follow-up sequences
    localStorage.setItem('assessment_lead', JSON.stringify(leadData))
  }
}
```

- [ ] Run `npm test` to verify tests pass (GREEN Phase)
- [ ] Commit working implementation: `git add . && git commit -m "GREEN: Implement AssessmentTool class"`

- [ ] 4.3 Create assessment tool styling (REFACTOR Phase)
- [ ] Create `src/styles/components/assessment-tool.css`:

```css
/* Assessment Tool Styles */
.assessment-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: var(--surface);
  border-radius: 1rem;
  box-shadow: var(--shadow-lg);
}

.progress-container {
  margin-bottom: 2rem;
  position: relative;
}

.progress-bar {
  height: 8px;
  background: var(--primary);
  border-radius: 4px;
  transition: width 0.3s ease;
  position: relative;
  overflow: hidden;
}

.progress-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.progress-text {
  display: block;
  text-align: center;
  margin-top: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.question {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  line-height: 1.4;
}

.options-container {
  margin-bottom: 2rem;
}

.option-label {
  display: block;
  padding: 1rem;
  margin-bottom: 0.75rem;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.option-label:hover {
  border-color: var(--primary);
  background: rgba(196, 30, 58, 0.05);
}

.option-label input[type='radio'] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.option-label input[type='radio']:checked + .option-text {
  color: var(--primary);
  font-weight: 600;
}

.option-label:has(input:checked) {
  border-color: var(--primary);
  background: rgba(196, 30, 58, 0.1);
}

.option-text {
  display: block;
  font-size: 1rem;
  line-height: 1.5;
  transition: color 0.3s ease;
}

.navigation-container {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.prev-button,
.next-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.prev-button {
  background: var(--surface);
  color: var(--text-secondary);
  border: 2px solid rgba(0, 0, 0, 0.1);
}

.prev-button:hover {
  background: var(--background);
  border-color: var(--text-secondary);
}

.next-button {
  background: var(--primary);
  color: white;
  margin-left: auto;
}

.next-button:hover {
  background: var(--highlight);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.error-message {
  color: var(--primary);
  font-size: 0.875rem;
  margin-top: 1rem;
  padding: 0.5rem;
  background: rgba(196, 30, 58, 0.1);
  border-radius: 0.25rem;
  border-left: 4px solid var(--primary);
}

/* Results Styles */
.results-container {
  text-align: center;
}

.results-header {
  margin-bottom: 2rem;
}

.results-header h2 {
  font-size: 2rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.overall-score {
  display: inline-block;
  padding: 1.5rem;
  background: var(--gradient-primary);
  color: white;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.score-number {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
}

.score-label {
  font-size: 0.875rem;
  opacity: 0.9;
}

.category-scores {
  margin: 2rem 0;
  text-align: left;
}

.score-category {
  margin-bottom: 1.5rem;
}

.score-category h4 {
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.score-bar {
  position: relative;
  height: 30px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  background: var(--gradient-primary);
  border-radius: 15px;
  transition: width 1s ease;
  position: relative;
}

.score-value {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-primary);
  font-weight: 600;
  font-size: 0.875rem;
}

.recommendation {
  margin: 2rem 0;
  padding: 1.5rem;
  background: rgba(196, 30, 58, 0.05);
  border-radius: 0.5rem;
  border-left: 4px solid var(--primary);
}

.recommended-bundle h4 {
  color: var(--primary);
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.focus-area {
  display: inline-block;
  background: var(--primary);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  margin-top: 0.5rem;
}

.email-capture {
  margin-top: 2rem;
  padding: 1.5rem;
  background: var(--background);
  border-radius: 0.5rem;
}

.email-capture-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
  margin: 0 auto;
}

.email-capture-form input {
  padding: 0.75rem;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  font-size: 1rem;
}

.email-capture-form input:focus {
  outline: none;
  border-color: var(--primary);
}

.submit-email {
  background: var(--primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-email:hover {
  background: var(--highlight);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.success-message {
  padding: 2rem;
  background: rgba(45, 134, 89, 0.1);
  border-radius: 0.5rem;
  border-left: 4px solid var(--secondary);
}

.book-consultation {
  background: var(--secondary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;
}

.book-consultation:hover {
  background: var(--accent);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Dark theme adjustments */
[data-theme='dark'] .assessment-container {
  background: var(--surface);
}

[data-theme='dark'] .option-label {
  border-color: rgba(255, 255, 255, 0.2);
}

[data-theme='dark'] .option-label:hover {
  background: rgba(196, 30, 58, 0.1);
}

[data-theme='dark'] .score-bar {
  background: rgba(255, 255, 255, 0.1);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .assessment-container {
    padding: 1rem;
    margin: 1rem;
  }

  .question {
    font-size: 1.25rem;
  }

  .overall-score {
    width: 100px;
    height: 100px;
  }

  .score-number {
    font-size: 2rem;
  }

  .navigation-container {
    flex-direction: column;
  }

  .prev-button {
    margin-left: 0;
  }
}
```

- [ ] Add assessment tool to main CSS: `@import 'components/assessment-tool.css';` in `src/styles/main.css`
- [ ] Run `npm test` and `npm run lint` to verify quality
- [ ] Commit styled assessment tool: `git add . && git commit -m "REFACTOR: Add comprehensive styling for assessment tool"`

- [ ] 5. AI-Powered Chatbot Integration System (TDD)
- **What**: Implement intelligent chatbot for 24/7 lead qualification
- **Why**: Automates initial visitor engagement and qualification process
- _Requirements: 13.1, 13.2, 13.3, 13.4_

- [ ] 5.1 Write failing tests for chatbot system (RED Phase)
- [ ] Create `tests/unit/chatbot-system.test.js`:

```javascript
import { ChatbotSystem } from '../../src/js/modules/chatbot-system.js'

describe('ChatbotSystem', () => {
  let chatbot
  let mockContainer

  beforeEach(() => {
    document.body.innerHTML = '<div id="chatbot-container"></div>'
    mockContainer = document.getElementById('chatbot-container')
    chatbot = new ChatbotSystem(mockContainer)
  })

  describe('Chatbot Initialization', () => {
    test('should initialize with welcome message', () => {
      chatbot.initialize()

      const widget = mockContainer.querySelector('.chatbot-widget')
      expect(widget).toBeTruthy()

      const welcomeMessage = mockContainer.querySelector('.bot-message')
      expect(welcomeMessage.textContent).toContain(
        'Welcome to Studio Encantador'
      )
    })

    test('should show qualification options', () => {
      chatbot.initialize()

      const options = mockContainer.querySelectorAll('.quick-option')
      expect(options).toHaveLength(4)
      expect(options[0].textContent).toContain('strategy to grow')
    })
  })

  describe('Conversation Flow', () => {
    beforeEach(() => {
      chatbot.initialize()
    })

    test('should handle strategy selection', () => {
      const strategyOption = mockContainer.querySelector(
        '[data-option="strategy"]'
      )
      strategyOption.click()

      expect(chatbot.currentFlow).toBe('strategy')

      const nextMessage = mockContainer.querySelector('.bot-message:last-child')
      expect(nextMessage.textContent).toContain('company size')
    })

    test('should handle website selection', () => {
      const websiteOption = mockContainer.querySelector(
        '[data-option="website"]'
      )
      websiteOption.click()

      expect(chatbot.currentFlow).toBe('website')

      const nextMessage = mockContainer.querySelector('.bot-message:last-child')
      expect(nextMessage.textContent).toContain('current website')
    })

    test('should handle integrated solution selection', () => {
      const integratedOption = mockContainer.querySelector(
        '[data-option="integrated"]'
      )
      integratedOption.click()

      expect(chatbot.currentFlow).toBe('integrated')

      const nextMessage = mockContainer.querySelector('.bot-message:last-child')
      expect(nextMessage.textContent).toContain('comprehensive approach')
    })
  })

  describe('Lead Qualification', () => {
    beforeEach(() => {
      chatbot.initialize()
    })

    test('should qualify high-value leads', () => {
      // Simulate conversation flow
      chatbot.handleUserResponse('integrated')
      chatbot.handleUserResponse('50-200') // Company size
      chatbot.handleUserResponse('500k+') // Budget

      expect(chatbot.leadScore).toBeGreaterThan(80)
      expect(chatbot.qualification.priority).toBe('high')
    })

    test('should qualify medium-value leads', () => {
      chatbot.handleUserResponse('strategy')
      chatbot.handleUserResponse('10-50')
      chatbot.handleUserResponse('100k-500k')

      expect(chatbot.leadScore).toBeGreaterThanOrEqual(50)
      expect(chatbot.leadScore).toBeLessThan(80)
      expect(chatbot.qualification.priority).toBe('medium')
    })

    test('should handle low-value leads appropriately', () => {
      chatbot.handleUserResponse('website')
      chatbot.handleUserResponse('1-10')
      chatbot.handleUserResponse('under-100k')

      expect(chatbot.leadScore).toBeLessThan(50)
      expect(chatbot.qualification.priority).toBe('low')
    })
  })

  describe('Exit Intent Detection', () => {
    test('should trigger on mouse leave', () => {
      const exitSpy = jest.spyOn(chatbot, 'handleExitIntent')

      // Simulate mouse leave event
      const mouseLeaveEvent = new Event('mouseleave')
      document.dispatchEvent(mouseLeaveEvent)

      expect(exitSpy).toHaveBeenCalled()
    })

    test('should show exit intent message', () => {
      chatbot.handleExitIntent()

      const exitMessage = mockContainer.querySelector('.exit-intent-message')
      expect(exitMessage).toBeTruthy()
      expect(exitMessage.textContent).toContain(
        'Wait! Get your free Business Health Score'
      )
    })
  })

  describe('CRM Integration', () => {
    test('should submit qualified lead to CRM', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, leadId: '123' }),
      })

      const leadData = {
        needs: ['strategy'],
        companySize: '50-200',
        budget: '500k+',
        urgency: 'immediate',
        score: 85,
      }

      await chatbot.submitToCRM(leadData)

      expect(fetch).toHaveBeenCalledWith(
        '/api/chatbot-lead',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('strategy'),
        })
      )
    })

    test('should handle CRM submission errors', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'))

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      const leadData = { score: 85 }
      await chatbot.submitToCRM(leadData)

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error submitting to CRM:',
        expect.any(Error)
      )
    })
  })

  describe('Calendar Integration', () => {
    test('should show calendar booking for high-value leads', () => {
      chatbot.qualification = { priority: 'high', score: 90 }
      chatbot.showBookingOptions()

      const calendarWidget = mockContainer.querySelector('.calendar-booking')
      expect(calendarWidget).toBeTruthy()
    })

    test('should show assessment recommendation for medium-value leads', () => {
      chatbot.qualification = { priority: 'medium', score: 65 }
      chatbot.showBookingOptions()

      const assessmentCTA = mockContainer.querySelector('.assessment-cta')
      expect(assessmentCTA).toBeTruthy()
      expect(assessmentCTA.textContent).toContain('Business Health Assessment')
    })
  })

  describe('Conversation Persistence', () => {
    test('should save conversation state', () => {
      chatbot.conversationState = {
        messages: ['Hello', 'I need help with strategy'],
        currentFlow: 'strategy',
        qualification: { score: 75 },
      }

      chatbot.saveConversationState()

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'chatbot_conversation',
        expect.stringContaining('strategy')
      )
    })

    test('should restore conversation state', () => {
      localStorage.getItem.mockReturnValue(
        JSON.stringify({
          messages: ['Previous message'],
          currentFlow: 'website',
          qualification: { score: 60 },
        })
      )

      chatbot.restoreConversationState()

      expect(chatbot.currentFlow).toBe('website')
      expect(chatbot.qualification.score).toBe(60)
    })
  })
})
```

- [ ] Run `npm test` to confirm tests fail (RED Phase)
- [ ] Commit failing tests: `git add . && git commit -m "RED: Add failing tests for chatbot system"`

- [ ] 5.2 Implement ChatbotSystem class (GREEN Phase)
- [ ] Create `src/js/modules/chatbot-system.js`:

```javascript
export class ChatbotSystem {
  constructor(container) {
    this.container = container
    this.isOpen = false
    this.currentFlow = null
    this.conversationState = {
      messages: [],
      userResponses: {},
      qualification: {},
    }
    this.leadScore = 0
    this.qualification = {}

    this.flows = {
      welcome: {
        message:
          'Welcome to Studio Encantador! To connect you with the right expert, are you looking for:',
        options: [
          {
            id: 'strategy',
            text: 'A strategy to grow your business?',
            value: 'strategy',
          },
          {
            id: 'website',
            text: 'A team to build your website?',
            value: 'website',
          },
          {
            id: 'culture',
            text: 'A way to improve company culture?',
            value: 'culture',
          },
          {
            id: 'integrated',
            text: 'All of the above (integrated solution)?',
            value: 'integrated',
          },
        ],
      },
      strategy: {
        message:
          "Great! Strategic planning is crucial for growth. What's your company size?",
        options: [
          {
            id: 'size-1-10',
            text: '1-10 employees (Startup focus)',
            value: '1-10',
          },
          {
            id: 'size-10-50',
            text: '10-50 employees (SME Digital Leap)',
            value: '10-50',
          },
          {
            id: 'size-50-200',
            text: '50-200 employees (Corporate Culture Reset)',
            value: '50-200',
          },
          {
            id: 'size-200+',
            text: '200+ employees (Enterprise consultation)',
            value: '200+',
          },
        ],
        next: 'budget',
      },
      website: {
        message:
          'Perfect! A strong digital presence is essential. Tell me about your current website situation:',
        options: [
          {
            id: 'no-website',
            text: "We don't have a website yet",
            value: 'none',
          },
          {
            id: 'basic-website',
            text: 'We have a basic website that needs improvement',
            value: 'basic',
          },
          {
            id: 'good-website',
            text: 'We have a good website but want to optimize it',
            value: 'good',
          },
          {
            id: 'ecommerce',
            text: 'We need e-commerce functionality',
            value: 'ecommerce',
          },
        ],
        next: 'company-size',
      },
      culture: {
        message:
          "Excellent choice! Team culture is the foundation of success. What's your main challenge?",
        options: [
          {
            id: 'remote-work',
            text: 'Remote work collaboration',
            value: 'remote',
          },
          {
            id: 'team-alignment',
            text: 'Team alignment and communication',
            value: 'alignment',
          },
          {
            id: 'leadership',
            text: 'Leadership development',
            value: 'leadership',
          },
          {
            id: 'growth-culture',
            text: 'Scaling culture during growth',
            value: 'scaling',
          },
        ],
        next: 'company-size',
      },
      integrated: {
        message:
          "Smart approach! Integrated solutions deliver the best results. This suggests you're ready for comprehensive transformation. What's your company size?",
        options: [
          { id: 'size-1-10', text: '1-10 employees', value: '1-10' },
          { id: 'size-10-50', text: '10-50 employees', value: '10-50' },
          { id: 'size-50-200', text: '50-200 employees', value: '50-200' },
          { id: 'size-200+', text: '200+ employees', value: '200+' },
        ],
        next: 'budget',
      },
      'company-size': {
        message: "Thanks! Now, what's your investment range for this project?",
        options: [
          {
            id: 'budget-under-100k',
            text: 'Under HK$100K',
            value: 'under-100k',
          },
          {
            id: 'budget-100k-500k',
            text: 'HK$100K - HK$500K',
            value: '100k-500k',
          },
          { id: 'budget-500k+', text: 'HK$500K+', value: '500k+' },
          {
            id: 'budget-discuss',
            text: "Let's discuss during consultation",
            value: 'discuss',
          },
        ],
        next: 'urgency',
      },
      budget: {
        message: "Perfect! What's your timeline for getting started?",
        options: [
          {
            id: 'urgent',
            text: 'Immediate (within 2 weeks)',
            value: 'immediate',
          },
          { id: 'soon', text: '1-3 months', value: '1-3months' },
          { id: 'planning', text: '3-6 months', value: '3-6months' },
          { id: 'future', text: 'Just planning ahead', value: 'planning' },
        ],
        next: 'qualification',
      },
      urgency: {
        message:
          "Excellent! Based on your responses, I can see you're serious about growth. What's your timeline?",
        options: [
          {
            id: 'urgent',
            text: 'Immediate (within 2 weeks)',
            value: 'immediate',
          },
          { id: 'soon', text: '1-3 months', value: '1-3months' },
          { id: 'planning', text: '3-6 months', value: '3-6months' },
          { id: 'future', text: 'Just planning ahead', value: 'planning' },
        ],
        next: 'qualification',
      },
    }
  }

  initialize() {
    this.createChatbotWidget()
    this.attachEventListeners()
    this.startConversation()
    this.restoreConversationState()
  }

  createChatbotWidget() {
    this.container.innerHTML = `
      <div class="chatbot-widget ${this.isOpen ? 'open' : 'closed'}">
        <div class="chatbot-header">
          <div class="chatbot-avatar">
            <img src="/assets/icons/chatbot-avatar.svg" alt="Studio Encantador Assistant" />
          </div>
          <div class="chatbot-title">
            <h4>Studio Encantador Assistant</h4>
            <span class="status-indicator">Online</span>
          </div>
          <button class="chatbot-toggle">
            <span class="toggle-icon">${this.isOpen ? '−' : '+'}</span>
          </button>
        </div>
        
        <div class="chatbot-messages">
          <div class="messages-container"></div>
        </div>
        
        <div class="chatbot-input">
          <div class="quick-options"></div>
          <div class="typing-indicator" style="display: none;">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
      
      <div class="chatbot-launcher ${this.isOpen ? 'hidden' : 'visible'}">
        <button class="launcher-button">
          <img src="/assets/icons/chat-icon.svg" alt="Chat with us" />
          <span class="notification-badge">1</span>
        </button>
      </div>
    `
  }

  attachEventListeners() {
    // Toggle chatbot
    const toggle = this.container.querySelector('.chatbot-toggle')
    const launcher = this.container.querySelector('.launcher-button')

    toggle.addEventListener('click', () => this.toggleChatbot())
    launcher.addEventListener('click', () => this.openChatbot())

    // Exit intent detection
    document.addEventListener('mouseleave', e => {
      if (e.clientY <= 0) {
        this.handleExitIntent()
      }
    })

    // Scroll detection for engagement
    let scrollTimeout
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        this.trackEngagement('scroll')
      }, 1000)
    })
  }

  toggleChatbot() {
    this.isOpen = !this.isOpen
    const widget = this.container.querySelector('.chatbot-widget')
    const launcher = this.container.querySelector('.chatbot-launcher')

    widget.classList.toggle('open', this.isOpen)
    widget.classList.toggle('closed', !this.isOpen)
    launcher.classList.toggle('hidden', this.isOpen)
    launcher.classList.toggle('visible', !this.isOpen)

    const toggleIcon = this.container.querySelector('.toggle-icon')
    toggleIcon.textContent = this.isOpen ? '−' : '+'

    if (this.isOpen && this.conversationState.messages.length === 0) {
      this.startConversation()
    }
  }

  openChatbot() {
    this.isOpen = true
    this.toggleChatbot()
  }

  startConversation() {
    this.showTypingIndicator()

    setTimeout(() => {
      this.hideTypingIndicator()
      this.addBotMessage(this.flows.welcome.message)
      this.showQuickOptions(this.flows.welcome.options)
      this.currentFlow = 'welcome'
    }, 1500)
  }

  addBotMessage(message) {
    const messagesContainer = this.container.querySelector(
      '.messages-container'
    )
    const messageElement = document.createElement('div')
    messageElement.className = 'bot-message'
    messageElement.innerHTML = `
      <div class="message-avatar">
        <img src="/assets/icons/bot-avatar.svg" alt="Bot" />
      </div>
      <div class="message-content">
        <p>${message}</p>
        <span class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    `

    messagesContainer.appendChild(messageElement)
    this.scrollToBottom()

    this.conversationState.messages.push({
      type: 'bot',
      message: message,
      timestamp: Date.now(),
    })
  }

  addUserMessage(message) {
    const messagesContainer = this.container.querySelector(
      '.messages-container'
    )
    const messageElement = document.createElement('div')
    messageElement.className = 'user-message'
    messageElement.innerHTML = `
      <div class="message-content">
        <p>${message}</p>
        <span class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    `

    messagesContainer.appendChild(messageElement)
    this.scrollToBottom()

    this.conversationState.messages.push({
      type: 'user',
      message: message,
      timestamp: Date.now(),
    })
  }

  showQuickOptions(options) {
    const quickOptionsContainer = this.container.querySelector('.quick-options')
    quickOptionsContainer.innerHTML = options
      .map(
        option => `
      <button class="quick-option" data-option="${option.value}">
        ${option.text}
      </button>
    `
      )
      .join('')

    // Attach click handlers
    const optionButtons =
      quickOptionsContainer.querySelectorAll('.quick-option')
    optionButtons.forEach(button => {
      button.addEventListener('click', e => {
        const value = e.target.dataset.option
        const text = e.target.textContent
        this.handleUserResponse(value, text)
      })
    })
  }

  handleUserResponse(value, displayText = null) {
    // Add user message
    if (displayText) {
      this.addUserMessage(displayText)
    }

    // Store response
    this.conversationState.userResponses[this.currentFlow] = value

    // Calculate lead score
    this.updateLeadScore(this.currentFlow, value)

    // Clear quick options
    this.container.querySelector('.quick-options').innerHTML = ''

    // Determine next flow
    const currentFlowData = this.flows[this.currentFlow]
    const nextFlow = currentFlowData.next

    if (nextFlow === 'qualification') {
      this.completeQualification()
    } else if (nextFlow) {
      this.continueFlow(nextFlow)
    } else {
      // Handle specific flow logic
      this.handleFlowLogic(value)
    }

    this.saveConversationState()
  }

  updateLeadScore(flow, value) {
    const scoring = {
      // Service type scoring
      integrated: 30,
      strategy: 25,
      culture: 20,
      website: 15,

      // Company size scoring
      '50-200': 25,
      '200+': 30,
      '10-50': 20,
      '1-10': 10,

      // Budget scoring
      '500k+': 30,
      '100k-500k': 20,
      'under-100k': 10,
      discuss: 15,

      // Urgency scoring
      immediate: 25,
      '1-3months': 20,
      '3-6months': 15,
      planning: 5,
    }

    this.leadScore += scoring[value] || 0

    // Determine qualification level
    if (this.leadScore >= 80) {
      this.qualification.priority = 'high'
    } else if (this.leadScore >= 50) {
      this.qualification.priority = 'medium'
    } else {
      this.qualification.priority = 'low'
    }

    this.qualification.score = this.leadScore
  }

  continueFlow(nextFlowKey) {
    this.showTypingIndicator()

    setTimeout(() => {
      this.hideTypingIndicator()
      const nextFlow = this.flows[nextFlowKey]
      this.addBotMessage(nextFlow.message)
      this.showQuickOptions(nextFlow.options)
      this.currentFlow = nextFlowKey
    }, 1000)
  }

  handleFlowLogic(value) {
    // Handle specific flow transitions
    if (this.currentFlow === 'welcome') {
      this.currentFlow = value
      this.continueFlow(value)
    } else if (['strategy', 'website', 'culture'].includes(this.currentFlow)) {
      this.continueFlow('company-size')
    }
  }

  completeQualification() {
    this.showTypingIndicator()

    setTimeout(() => {
      this.hideTypingIndicator()

      const responses = this.conversationState.userResponses
      this.qualification = {
        ...this.qualification,
        needs: [
          responses.welcome ||
            responses.strategy ||
            responses.website ||
            responses.culture,
        ],
        companySize:
          responses['company-size'] ||
          responses.strategy ||
          responses.integrated,
        budget: responses.budget,
        urgency: responses.urgency,
        timestamp: Date.now(),
      }

      this.showQualificationResults()
      this.submitToCRM(this.qualification)
    }, 1500)
  }

  showQualificationResults() {
    if (this.qualification.priority === 'high') {
      this.addBotMessage(
        "Excellent! Based on your responses, you're a perfect fit for our integrated approach. I'd love to connect you directly with one of our founders."
      )
      this.showBookingOptions()
    } else if (this.qualification.priority === 'medium') {
      this.addBotMessage(
        "Great! I can see you're serious about growth. Before we connect you with our team, I recommend taking our free Business Health Assessment to get personalized insights."
      )
      this.showAssessmentOption()
    } else {
      this.addBotMessage(
        "Thanks for your interest! I'd recommend starting with our free resources to help you plan your next steps."
      )
      this.showResourceOptions()
    }
  }

  showBookingOptions() {
    const quickOptionsContainer = this.container.querySelector('.quick-options')
    quickOptionsContainer.innerHTML = `
      <div class="calendar-booking">
        <h4>Book Your Free Consultation</h4>
        <p>Choose a time that works for you:</p>
        <button class="book-now-btn" onclick="window.open('/book-consultation', '_blank')">
          📅 Book Now
        </button>
      </div>
    `
  }

  showAssessmentOption() {
    const quickOptionsContainer = this.container.querySelector('.quick-options')
    quickOptionsContainer.innerHTML = `
      <div class="assessment-cta">
        <h4>Get Your Free Business Health Score</h4>
        <p>5-minute assessment with personalized recommendations</p>
        <button class="assessment-btn" onclick="window.location.href='/assessment'">
          🎯 Start Assessment
        </button>
        <button class="book-call-btn" onclick="window.open('/book-consultation', '_blank')">
          📞 Book Call Instead
        </button>
      </div>
    `
  }

  showResourceOptions() {
    const quickOptionsContainer = this.container.querySelector('.quick-options')
    quickOptionsContainer.innerHTML = `
      <div class="resource-options">
        <h4>Free Resources for You</h4>
        <button class="resource-btn" onclick="window.location.href='/assessment'">
          📊 Business Health Assessment
        </button>
        <button class="resource-btn" onclick="window.location.href='/newsletter'">
          📧 Join Our Newsletter
        </button>
        <button class="resource-btn" onclick="window.location.href='/blog'">
          📚 Read Our Blog
        </button>
      </div>
    `
  }

  async submitToCRM(qualificationData) {
    try {
      const leadData = {
        source: 'chatbot',
        qualification: qualificationData,
        conversationHistory: this.conversationState.messages,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
      }

      const response = await fetch('/api/chatbot-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Lead submitted successfully:', result.leadId)

        // Track conversion
        if (window.gtag) {
          window.gtag('event', 'chatbot_qualification_complete', {
            lead_score: qualificationData.score,
            priority: qualificationData.priority,
            needs: qualificationData.needs.join(','),
          })
        }
      } else {
        throw new Error('Failed to submit lead')
      }
    } catch (error) {
      console.error('Error submitting to CRM:', error)
      // Continue conversation even if CRM fails
    }
  }

  handleExitIntent() {
    if (!this.isOpen && this.conversationState.messages.length === 0) {
      this.openChatbot()

      setTimeout(() => {
        this.addBotMessage(
          "Wait! Before you go, get your free Business Health Score. It only takes 2 minutes and you'll get personalized insights for your business."
        )

        const quickOptionsContainer =
          this.container.querySelector('.quick-options')
        quickOptionsContainer.innerHTML = `
          <div class="exit-intent-message">
            <button class="assessment-btn" onclick="window.location.href='/assessment'">
              🎯 Get My Free Score
            </button>
            <button class="close-btn" onclick="this.closest('.chatbot-widget').querySelector('.chatbot-toggle').click()">
              Maybe Later
            </button>
          </div>
        `
      }, 500)
    }
  }

  showTypingIndicator() {
    const indicator = this.container.querySelector('.typing-indicator')
    indicator.style.display = 'flex'
  }

  hideTypingIndicator() {
    const indicator = this.container.querySelector('.typing-indicator')
    indicator.style.display = 'none'
  }

  scrollToBottom() {
    const messagesContainer = this.container.querySelector(
      '.messages-container'
    )
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }

  saveConversationState() {
    try {
      localStorage.setItem(
        'chatbot_conversation',
        JSON.stringify({
          ...this.conversationState,
          currentFlow: this.currentFlow,
          leadScore: this.leadScore,
          qualification: this.qualification,
          timestamp: Date.now(),
        })
      )
    } catch (error) {
      console.error('Error saving conversation state:', error)
    }
  }

  restoreConversationState() {
    try {
      const saved = localStorage.getItem('chatbot_conversation')
      if (saved) {
        const state = JSON.parse(saved)

        // Only restore if less than 24 hours old
        if (Date.now() - state.timestamp < 24 * 60 * 60 * 1000) {
          this.conversationState = state
          this.currentFlow = state.currentFlow
          this.leadScore = state.leadScore || 0
          this.qualification = state.qualification || {}

          // Restore messages
          const messagesContainer = this.container.querySelector(
            '.messages-container'
          )
          state.messages.forEach(msg => {
            if (msg.type === 'bot') {
              this.addBotMessage(msg.message)
            } else {
              this.addUserMessage(msg.message)
            }
          })
        }
      }
    } catch (error) {
      console.error('Error restoring conversation state:', error)
    }
  }

  trackEngagement(action) {
    if (window.gtag) {
      window.gtag('event', 'chatbot_engagement', {
        action: action,
        timestamp: Date.now(),
      })
    }
  }
}
```

- [ ] Run `npm test` to verify tests pass (GREEN Phase)
- [ ] Commit working implementation: `git add . && git commit -m "GREEN: Implement ChatbotSystem class"`

- [ ] 5.3 Create chatbot styling and animations (REFACTOR Phase)
- [ ] Create `src/styles/components/chatbot.css`:

```css
/* Chatbot Widget Styles */
.chatbot-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 350px;
  height: 500px;
  background: var(--surface);
  border-radius: 1rem;
  box-shadow: var(--shadow-xl);
  z-index: var(--z-modal);
  transition: all 0.3s ease;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.chatbot-widget.closed {
  transform: translateY(100%) scale(0.8);
  opacity: 0;
  pointer-events: none;
}

.chatbot-widget.open {
  transform: translateY(0) scale(1);
  opacity: 1;
  pointer-events: all;
}

.chatbot-header {
  background: var(--gradient-primary);
  color: white;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.chatbot-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.chatbot-title h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.status-indicator {
  font-size: 0.75rem;
  opacity: 0.9;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.status-indicator::before {
  content: '';
  width: 8px;
  height: 8px;
  background: #4ade80;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.chatbot-toggle {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  margin-left: auto;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.3s ease;
}

.chatbot-toggle:hover {
  background: rgba(255, 255, 255, 0.2);
}

.chatbot-messages {
  height: 350px;
  overflow-y: auto;
  padding: 1rem;
  background: var(--background);
}

.messages-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.bot-message,
.user-message {
  display: flex;
  gap: 0.5rem;
  animation: messageSlideIn 0.3s ease;
}

@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-message {
  flex-direction: row-reverse;
}

.message-avatar img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.message-content {
  max-width: 80%;
  background: var(--surface);
  padding: 0.75rem;
  border-radius: 1rem;
  position: relative;
}

.bot-message .message-content {
  background: var(--surface);
  border-bottom-left-radius: 0.25rem;
}

.user-message .message-content {
  background: var(--primary);
  color: white;
  border-bottom-right-radius: 0.25rem;
}

.message-content p {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.4;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.7;
  display: block;
  margin-top: 0.25rem;
}

.chatbot-input {
  padding: 1rem;
  background: var(--surface);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.quick-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.quick-option {
  background: var(--background);
  border: 2px solid rgba(0, 0, 0, 0.1);
  padding: 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  font-size: 0.875rem;
}

.quick-option:hover {
  border-color: var(--primary);
  background: rgba(196, 30, 58, 0.05);
  transform: translateY(-1px);
}

.typing-indicator {
  display: flex;
  gap: 0.25rem;
  padding: 0.5rem 0;
  align-items: center;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: var(--text-secondary);
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

/* Chatbot Launcher */
.chatbot-launcher {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: var(--z-modal);
  transition: all 0.3s ease;
}

.chatbot-launcher.hidden {
  transform: scale(0);
  opacity: 0;
  pointer-events: none;
}

.chatbot-launcher.visible {
  transform: scale(1);
  opacity: 1;
  pointer-events: all;
}

.launcher-button {
  width: 60px;
  height: 60px;
  background: var(--gradient-primary);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-lg);
  transition: all 0.3s ease;
  position: relative;
}

.launcher-button:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-xl);
}

.launcher-button img {
  width: 24px;
  height: 24px;
  filter: brightness(0) invert(1);
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: var(--accent);
  color: var(--text-primary);
  font-size: 0.75rem;
  font-weight: 600;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-5px);
  }
  60% {
    transform: translateY(-3px);
  }
}

/* Booking and Assessment CTAs */
.calendar-booking,
.assessment-cta,
.resource-options {
  background: var(--background);
  padding: 1rem;
  border-radius: 0.5rem;
  border: 2px solid rgba(0, 0, 0, 0.1);
  text-align: center;
}

.calendar-booking h4,
.assessment-cta h4,
.resource-options h4 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
  font-size: 1rem;
}

.calendar-booking p,
.assessment-cta p {
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.book-now-btn,
.assessment-btn,
.book-call-btn,
.resource-btn,
.close-btn {
  background: var(--primary);
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  margin: 0.25rem;
  min-width: 120px;
}

.book-now-btn:hover,
.assessment-btn:hover {
  background: var(--highlight);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.book-call-btn {
  background: var(--secondary);
}

.book-call-btn:hover {
  background: var(--accent);
}

.resource-btn {
  background: var(--background);
  color: var(--text-primary);
  border: 2px solid var(--primary);
  display: block;
  width: 100%;
  margin: 0.5rem 0;
}

.resource-btn:hover {
  background: var(--primary);
  color: white;
}

.close-btn {
  background: var(--text-secondary);
}

.close-btn:hover {
  background: var(--text-primary);
}

.exit-intent-message {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Dark theme adjustments */
[data-theme='dark'] .chatbot-widget {
  border-color: rgba(255, 255, 255, 0.2);
}

[data-theme='dark'] .chatbot-messages {
  background: var(--background);
}

[data-theme='dark'] .quick-option {
  border-color: rgba(255, 255, 255, 0.2);
}

[data-theme='dark'] .quick-option:hover {
  background: rgba(196, 30, 58, 0.1);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .chatbot-widget {
    width: calc(100vw - 40px);
    height: calc(100vh - 40px);
    bottom: 20px;
    right: 20px;
    left: 20px;
  }

  .chatbot-messages {
    height: calc(100vh - 200px);
  }

  .launcher-button {
    width: 50px;
    height: 50px;
  }

  .launcher-button img {
    width: 20px;
    height: 20px;
  }
}

/* Accessibility improvements */
.chatbot-widget:focus-within {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.quick-option:focus,
.launcher-button:focus {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .chatbot-widget,
  .launcher-button,
  .quick-option,
  .message-content {
    transition: none;
  }

  .notification-badge,
  .typing-indicator span,
  .status-indicator::before {
    animation: none;
  }

  @keyframes messageSlideIn {
    from,
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
```

- [ ] Add chatbot styles to main CSS: `@import 'components/chatbot.css';` in `src/styles/main.css`
- [ ] Run `npm test` and `npm run lint` to verify quality
- [ ] Commit styled chatbot: `git add . && git commit -m "REFACTOR: Add comprehensive chatbot styling and animations"`

- [ ] 6. Automated Booking and Calendar Integration System (TDD)
- **What**: Seamless calendar booking system with automated confirmations
- **Why**: Converts qualified leads directly into scheduled consultations
- _Requirements: 16.1, 16.2, 16.3, 16.4_

- [ ] 6.1 Write failing tests for booking system (RED Phase)
- [ ] Create `tests/unit/booking-system.test.js`:

```javascript
import { BookingSystem } from '../../src/js/modules/booking-system.js'

describe('BookingSystem', () => {
  let bookingSystem
  let mockContainer

  beforeEach(() => {
    document.body.innerHTML = '<div id="booking-container"></div>'
    mockContainer = document.getElementById('booking-container')
    bookingSystem = new BookingSystem(mockContainer)

    // Mock Calendly API
    global.Calendly = {
      initInlineWidget: jest.fn(),
      closePopupWidget: jest.fn(),
      initPopupWidget: jest.fn(),
    }
  })

  describe('Booking System Initialization', () => {
    test('should initialize with calendar widget', () => {
      bookingSystem.initialize()

      const calendarWidget = mockContainer.querySelector('.calendar-widget')
      expect(calendarWidget).toBeTruthy()
    })

    test('should load Calendly script', () => {
      const scriptSpy = jest.spyOn(document, 'createElement')
      bookingSystem.loadCalendlyScript()

      expect(scriptSpy).toHaveBeenCalledWith('script')
    })
  })

  describe('Meeting Type Selection', () => {
    beforeEach(() => {
      bookingSystem.initialize()
    })

    test('should show meeting type options', () => {
      const meetingTypes = mockContainer.querySelectorAll('.meeting-type')
      expect(meetingTypes).toHaveLength(4)

      const strategyType = mockContainer.querySelector('[data-type="strategy"]')
      expect(strategyType.textContent).toContain('Strategy Consultation')
    })

    test('should select meeting type and update calendar', () => {
      const strategyType = mockContainer.querySelector('[data-type="strategy"]')
      strategyType.click()

      expect(bookingSystem.selectedMeetingType).toBe('strategy')
      expect(global.Calendly.initInlineWidget).toHaveBeenCalled()
    })
  })

  describe('Pre-call Questionnaire', () => {
    test('should show questionnaire after meeting selection', () => {
      bookingSystem.selectedMeetingType = 'strategy'
      bookingSystem.showPreCallQuestionnaire()

      const questionnaire = mockContainer.querySelector(
        '.pre-call-questionnaire'
      )
      expect(questionnaire).toBeTruthy()

      const companyField = mockContainer.querySelector('input[name="company"]')
      expect(companyField).toBeTruthy()
    })

    test('should validate required fields', () => {
      bookingSystem.showPreCallQuestionnaire()

      const form = mockContainer.querySelector('.questionnaire-form')
      const submitButton = mockContainer.querySelector('.submit-questionnaire')

      submitButton.click()

      const errorMessages = mockContainer.querySelectorAll('.field-error')
      expect(errorMessages.length).toBeGreaterThan(0)
    })

    test('should submit valid questionnaire data', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })

      bookingSystem.showPreCallQuestionnaire()

      // Fill form
      const companyInput = mockContainer.querySelector('input[name="company"]')
      const challengeTextarea = mockContainer.querySelector(
        'textarea[name="challenge"]'
      )

      companyInput.value = 'Test Company'
      challengeTextarea.value = 'Need help with growth strategy'

      const submitButton = mockContainer.querySelector('.submit-questionnaire')
      await submitButton.click()

      expect(fetch).toHaveBeenCalledWith(
        '/api/pre-call-questionnaire',
        expect.objectContaining({
          method: 'POST',
        })
      )
    })
  })

  describe('Calendar Integration', () => {
    test('should initialize Calendly widget with correct URL', () => {
      bookingSystem.selectedMeetingType = 'strategy'
      bookingSystem.initializeCalendar()

      expect(global.Calendly.initInlineWidget).toHaveBeenCalledWith({
        url: expect.stringContaining('strategy-consultation'),
        parentElement: expect.any(Element),
      })
    })

    test('should handle different meeting types', () => {
      const meetingTypes = ['strategy', 'digital', 'culture', 'integrated']

      meetingTypes.forEach(type => {
        bookingSystem.selectedMeetingType = type
        bookingSystem.initializeCalendar()

        expect(global.Calendly.initInlineWidget).toHaveBeenCalledWith({
          url: expect.stringContaining(type),
          parentElement: expect.any(Element),
        })
      })
    })
  })

  describe('Booking Confirmation', () => {
    test('should handle successful booking', () => {
      const bookingData = {
        event: 'calendly.event_scheduled',
        payload: {
          event: {
            uri: 'https://calendly.com/events/123',
            name: 'Strategy Consultation',
          },
          invitee: {
            email: 'test@example.com',
            name: 'Test User',
          },
        },
      }

      bookingSystem.handleBookingConfirmation(bookingData)

      const confirmationMessage = mockContainer.querySelector(
        '.booking-confirmation'
      )
      expect(confirmationMessage).toBeTruthy()
      expect(confirmationMessage.textContent).toContain('confirmed')
    })

    test('should trigger CRM integration on booking', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })

      const bookingData = {
        event: 'calendly.event_scheduled',
        payload: {
          event: { uri: 'test-uri', name: 'Test Meeting' },
          invitee: { email: 'test@example.com', name: 'Test User' },
        },
      }

      await bookingSystem.handleBookingConfirmation(bookingData)

      expect(fetch).toHaveBeenCalledWith(
        '/api/booking-confirmation',
        expect.objectContaining({
          method: 'POST',
        })
      )
    })
  })

  describe('Automated Email Sequences', () => {
    test('should trigger confirmation email', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })

      const bookingData = {
        invitee: { email: 'test@example.com', name: 'Test User' },
        event: {
          name: 'Strategy Consultation',
          start_time: '2024-01-15T10:00:00Z',
        },
      }

      await bookingSystem.sendConfirmationEmail(bookingData)

      expect(fetch).toHaveBeenCalledWith(
        '/api/send-confirmation-email',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('test@example.com'),
        })
      )
    })

    test('should schedule reminder emails', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })

      const bookingData = {
        invitee: { email: 'test@example.com' },
        event: { start_time: '2024-01-15T10:00:00Z' },
      }

      await bookingSystem.scheduleReminders(bookingData)

      expect(fetch).toHaveBeenCalledWith(
        '/api/schedule-reminders',
        expect.objectContaining({
          method: 'POST',
        })
      )
    })
  })

  describe('No-show Recovery', () => {
    test('should detect no-show events', () => {
      const noShowData = {
        event: 'calendly.invitee_no_show',
        payload: {
          invitee: { email: 'test@example.com' },
          event: { name: 'Strategy Consultation' },
        },
      }

      bookingSystem.handleNoShow(noShowData)

      expect(bookingSystem.noShowEvents).toContain('test@example.com')
    })

    test('should trigger re-engagement sequence', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })

      const noShowData = {
        invitee: { email: 'test@example.com', name: 'Test User' },
        event: { name: 'Strategy Consultation' },
      }

      await bookingSystem.handleNoShow(noShowData)

      expect(fetch).toHaveBeenCalledWith(
        '/api/no-show-recovery',
        expect.objectContaining({
          method: 'POST',
        })
      )
    })
  })

  describe('Availability Management', () => {
    test('should check founder availability', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            available: true,
            nextSlot: '2024-01-15T10:00:00Z',
          }),
      })

      const availability = await bookingSystem.checkAvailability('2024-01-15')

      expect(availability.available).toBe(true)
      expect(fetch).toHaveBeenCalledWith('/api/check-availability')
    })

    test('should handle fully booked scenarios', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            available: false,
            nextSlot: '2024-01-20T10:00:00Z',
          }),
      })

      const availability = await bookingSystem.checkAvailability('2024-01-15')

      expect(availability.available).toBe(false)
      expect(availability.nextSlot).toBeTruthy()
    })
  })
})
```

- [ ] Run `npm test` to confirm tests fail (RED Phase)
- [ ] Commit failing tests: `git add . && git commit -m "RED: Add failing tests for booking system"`

- [ ] 6.2 Implement BookingSystem class (GREEN Phase)
- [ ] Create `src/js/modules/booking-system.js`:

```javascript
export class BookingSystem {
  constructor(container) {
    this.container = container
    this.selectedMeetingType = null
    this.preCallData = {}
    this.noShowEvents = []
    this.calendlyLoaded = false

    this.meetingTypes = {
      strategy: {
        name: 'Strategy Consultation',
        duration: 45,
        description:
          'Deep dive into your business strategy and growth opportunities',
        calendlyUrl:
          'https://calendly.com/studio-encantador/strategy-consultation',
        icon: '🎯',
      },
      digital: {
        name: 'Digital Solutions Review',
        duration: 30,
        description: 'Assess your digital presence and web development needs',
        calendlyUrl: 'https://calendly.com/studio-encantador/digital-review',
        icon: '💻',
      },
      culture: {
        name: 'Culture & Team Assessment',
        duration: 30,
        description:
          'Evaluate team dynamics and culture development opportunities',
        calendlyUrl:
          'https://calendly.com/studio-encantador/culture-assessment',
        icon: '🤝',
      },
      integrated: {
        name: 'Integrated Solutions Consultation',
        duration: 60,
        description:
          'Comprehensive review of strategy, digital, and culture needs',
        calendlyUrl:
          'https://calendly.com/studio-encantador/integrated-consultation',
        icon: '🚀',
      },
    }
  }

  initialize() {
    this.loadCalendlyScript()
    this.render()
    this.attachEventListeners()
  }

  loadCalendlyScript() {
    if (this.calendlyLoaded || window.Calendly) {
      this.calendlyLoaded = true
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://assets.calendly.com/assets/external/widget.js'
      script.async = true

      script.onload = () => {
        this.calendlyLoaded = true
        resolve()
      }

      script.onerror = () => {
        reject(new Error('Failed to load Calendly script'))
      }

      document.head.appendChild(script)
    })
  }

  render() {
    this.container.innerHTML = `
      <div class="booking-system">
        <div class="booking-header">
          <h2>Book Your Free Consultation</h2>
          <p>Choose the type of consultation that best fits your needs</p>
        </div>
        
        <div class="meeting-types">
          ${Object.entries(this.meetingTypes)
            .map(
              ([key, type]) => `
            <div class="meeting-type" data-type="${key}">
              <div class="meeting-icon">${type.icon}</div>
              <div class="meeting-info">
                <h3>${type.name}</h3>
                <p class="meeting-duration">${type.duration} minutes</p>
                <p class="meeting-description">${type.description}</p>
              </div>
              <button class="select-meeting">Select</button>
            </div>
          `
            )
            .join('')}
        </div>
        
        <div class="calendar-container" style="display: none;">
          <div class="calendar-header">
            <button class="back-button">← Back to Meeting Types</button>
            <h3 id="selected-meeting-title">Select Your Time</h3>
          </div>
          <div class="calendar-widget"></div>
        </div>
        
        <div class="pre-call-questionnaire" style="display: none;">
          <h3>Pre-Call Information</h3>
          <p>Help us prepare for our conversation by sharing some details about your business.</p>
          
          <form class="questionnaire-form">
            <div class="form-group">
              <label for="company">Company Name *</label>
              <input type="text" name="company" id="company" required />
              <span class="field-error"></span>
            </div>
            
            <div class="form-group">
              <label for="role">Your Role *</label>
              <select name="role" id="role" required>
                <option value="">Select your role</option>
                <option value="founder">Founder/CEO</option>
                <option value="director">Director/VP</option>
                <option value="manager">Manager</option>
                <option value="other">Other</option>
              </select>
              <span class="field-error"></span>
            </div>
            
            <div class="form-group">
              <label for="company-size">Company Size *</label>
              <select name="company-size" id="company-size" required>
                <option value="">Select company size</option>
                <option value="1-10">1-10 employees</option>
                <option value="10-50">10-50 employees</option>
                <option value="50-200">50-200 employees</option>
                <option value="200+">200+ employees</option>
              </select>
              <span class="field-error"></span>
            </div>
            
            <div class="form-group">
              <label for="challenge">Main Challenge *</label>
              <textarea name="challenge" id="challenge" rows="4" 
                placeholder="What's the biggest challenge you're facing that we can help with?" required></textarea>
              <span class="field-error"></span>
            </div>
            
            <div class="form-group">
              <label for="goals">Goals for This Consultation</label>
              <textarea name="goals" id="goals" rows="3" 
                placeholder="What would you like to achieve from our conversation?"></textarea>
            </div>
            
            <div class="form-group">
              <label for="timeline">Timeline</label>
              <select name="timeline" id="timeline">
                <option value="">When are you looking to get started?</option>
                <option value="immediate">Immediately</option>
                <option value="1-3months">1-3 months</option>
                <option value="3-6months">3-6 months</option>
                <option value="planning">Just planning ahead</option>
              </select>
            </div>
            
            <button type="submit" class="submit-questionnaire">Complete Booking</button>
          </form>
        </div>
        
        <div class="booking-confirmation" style="display: none;">
          <div class="confirmation-icon">✅</div>
          <h3>Booking Confirmed!</h3>
          <p class="confirmation-message"></p>
          <div class="next-steps">
            <h4>What happens next:</h4>
            <ul>
              <li>You'll receive a calendar invitation with meeting details</li>
              <li>We'll send you a preparation guide 24 hours before</li>
              <li>Our founder will review your information beforehand</li>
            </ul>
          </div>
        </div>
      </div>
    `
  }

  attachEventListeners() {
    // Meeting type selection
    const meetingTypes = this.container.querySelectorAll('.meeting-type')
    meetingTypes.forEach(type => {
      const selectButton = type.querySelector('.select-meeting')
      selectButton.addEventListener('click', () => {
        const meetingType = type.dataset.type
        this.selectMeetingType(meetingType)
      })
    })

    // Back button
    const backButton = this.container.querySelector('.back-button')
    if (backButton) {
      backButton.addEventListener('click', () => {
        this.showMeetingTypes()
      })
    }

    // Questionnaire form
    const form = this.container.querySelector('.questionnaire-form')
    if (form) {
      form.addEventListener('submit', e => {
        e.preventDefault()
        this.handleQuestionnaireSubmit(e)
      })
    }

    // Listen for Calendly events
    window.addEventListener('message', e => {
      if (e.data.event && e.data.event.indexOf('calendly') === 0) {
        this.handleCalendlyEvent(e.data)
      }
    })
  }

  selectMeetingType(type) {
    this.selectedMeetingType = type
    const meetingInfo = this.meetingTypes[type]

    // Update header
    const title = this.container.querySelector('#selected-meeting-title')
    title.textContent = `Book ${meetingInfo.name}`

    // Show calendar container
    this.container.querySelector('.meeting-types').style.display = 'none'
    this.container.querySelector('.calendar-container').style.display = 'block'

    // Initialize calendar
    this.initializeCalendar()
  }

  async initializeCalendar() {
    if (!this.calendlyLoaded) {
      await this.loadCalendlyScript()
    }

    const meetingInfo = this.meetingTypes[this.selectedMeetingType]
    const calendarWidget = this.container.querySelector('.calendar-widget')

    // Clear previous widget
    calendarWidget.innerHTML = ''

    // Initialize Calendly widget
    if (window.Calendly) {
      window.Calendly.initInlineWidget({
        url: meetingInfo.calendlyUrl,
        parentElement: calendarWidget,
        prefill: {
          customAnswers: {
            a1: this.selectedMeetingType,
          },
        },
        utm: {
          utmCampaign: 'website-booking',
          utmSource: 'studio-encantador',
          utmMedium: 'website',
        },
      })
    }
  }

  handleCalendlyEvent(data) {
    switch (data.event) {
      case 'calendly.event_scheduled':
        this.handleBookingConfirmation(data)
        break
      case 'calendly.event_type_viewed':
        this.trackEventTypeView(data)
        break
      case 'calendly.date_and_time_selected':
        this.showPreCallQuestionnaire()
        break
      case 'calendly.invitee_no_show':
        this.handleNoShow(data)
        break
    }
  }

  showPreCallQuestionnaire() {
    this.container.querySelector('.calendar-container').style.display = 'none'
    this.container.querySelector('.pre-call-questionnaire').style.display =
      'block'
  }

  async handleQuestionnaireSubmit(event) {
    const form = event.target
    const formData = new FormData(form)

    // Validate form
    if (!this.validateQuestionnaire(formData)) {
      return
    }

    // Collect data
    this.preCallData = {
      company: formData.get('company'),
      role: formData.get('role'),
      companySize: formData.get('company-size'),
      challenge: formData.get('challenge'),
      goals: formData.get('goals'),
      timeline: formData.get('timeline'),
      meetingType: this.selectedMeetingType,
      timestamp: new Date().toISOString(),
    }

    try {
      // Submit to backend
      await this.submitPreCallData(this.preCallData)

      // Show success and continue to calendar
      this.container.querySelector('.pre-call-questionnaire').style.display =
        'none'
      this.container.querySelector('.calendar-container').style.display =
        'block'
    } catch (error) {
      console.error('Error submitting pre-call data:', error)
      this.showError(
        'There was an error saving your information. Please try again.'
      )
    }
  }

  validateQuestionnaire(formData) {
    const requiredFields = ['company', 'role', 'company-size', 'challenge']
    let isValid = true

    // Clear previous errors
    this.container.querySelectorAll('.field-error').forEach(error => {
      error.textContent = ''
    })

    requiredFields.forEach(field => {
      const value = formData.get(field)
      if (!value || value.trim() === '') {
        const errorElement = this.container.querySelector(
          `[name="${field}"] + .field-error`
        )
        if (errorElement) {
          errorElement.textContent = 'This field is required'
        }
        isValid = false
      }
    })

    return isValid
  }

  async submitPreCallData(data) {
    const response = await fetch('/api/pre-call-questionnaire', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Failed to submit pre-call data')
    }

    return response.json()
  }

  async handleBookingConfirmation(data) {
    const { payload } = data
    const { event, invitee } = payload

    // Show confirmation
    this.showBookingConfirmation(event, invitee)

    // Submit to CRM
    await this.submitBookingToCRM({
      event,
      invitee,
      preCallData: this.preCallData,
      meetingType: this.selectedMeetingType,
    })

    // Send confirmation email
    await this.sendConfirmationEmail({ event, invitee })

    // Schedule reminders
    await this.scheduleReminders({ event, invitee })

    // Track conversion
    this.trackBookingConversion(data)
  }

  showBookingConfirmation(event, invitee) {
    const meetingInfo = this.meetingTypes[this.selectedMeetingType]

    this.container.querySelector('.calendar-container').style.display = 'none'
    this.container.querySelector('.pre-call-questionnaire').style.display =
      'none'

    const confirmation = this.container.querySelector('.booking-confirmation')
    const message = confirmation.querySelector('.confirmation-message')

    message.innerHTML = `
      <strong>Your ${meetingInfo.name} is confirmed!</strong><br>
      We'll meet with <strong>${invitee.name}</strong> at the scheduled time.<br>
      A calendar invitation has been sent to <strong>${invitee.email}</strong>.
    `

    confirmation.style.display = 'block'
  }

  async submitBookingToCRM(bookingData) {
    try {
      const response = await fetch('/api/booking-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...bookingData,
          source: 'website-booking',
          timestamp: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit booking to CRM')
      }

      const result = await response.json()
      console.log('Booking submitted to CRM:', result.leadId)
    } catch (error) {
      console.error('Error submitting booking to CRM:', error)
      // Don't fail the booking process if CRM submission fails
    }
  }

  async sendConfirmationEmail(data) {
    try {
      await fetch('/api/send-confirmation-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          meetingType: this.selectedMeetingType,
          preCallData: this.preCallData,
        }),
      })
    } catch (error) {
      console.error('Error sending confirmation email:', error)
    }
  }

  async scheduleReminders(data) {
    try {
      await fetch('/api/schedule-reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          meetingType: this.selectedMeetingType,
          reminderTimes: ['24h', '2h'], // 24 hours and 2 hours before
        }),
      })
    } catch (error) {
      console.error('Error scheduling reminders:', error)
    }
  }

  async handleNoShow(data) {
    const { payload } = data
    const { invitee, event } = payload

    // Track no-show
    this.noShowEvents.push(invitee.email)

    // Trigger re-engagement sequence
    try {
      await fetch('/api/no-show-recovery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invitee,
          event,
          meetingType: this.selectedMeetingType,
          originalBookingData: this.preCallData,
        }),
      })
    } catch (error) {
      console.error('Error triggering no-show recovery:', error)
    }
  }

  async checkAvailability(date) {
    try {
      const response = await fetch(
        `/api/check-availability?date=${date}&type=${this.selectedMeetingType}`
      )
      return response.json()
    } catch (error) {
      console.error('Error checking availability:', error)
      return { available: true } // Default to available if check fails
    }
  }

  showMeetingTypes() {
    this.container.querySelector('.calendar-container').style.display = 'none'
    this.container.querySelector('.pre-call-questionnaire').style.display =
      'none'
    this.container.querySelector('.booking-confirmation').style.display = 'none'
    this.container.querySelector('.meeting-types').style.display = 'block'

    this.selectedMeetingType = null
  }

  showError(message) {
    // Create or update error message
    let errorDiv = this.container.querySelector('.booking-error')
    if (!errorDiv) {
      errorDiv = document.createElement('div')
      errorDiv.className = 'booking-error'
      this.container.insertBefore(errorDiv, this.container.firstChild)
    }

    errorDiv.innerHTML = `
      <div class="error-content">
        <span class="error-icon">⚠️</span>
        <span class="error-message">${message}</span>
        <button class="close-error">×</button>
      </div>
    `

    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.parentNode.removeChild(errorDiv)
      }
    }, 5000)

    // Close button
    errorDiv.querySelector('.close-error').addEventListener('click', () => {
      errorDiv.parentNode.removeChild(errorDiv)
    })
  }

  trackEventTypeView(data) {
    if (window.gtag) {
      window.gtag('event', 'calendar_view', {
        meeting_type: this.selectedMeetingType,
        event_type: data.payload.event_type.name,
      })
    }
  }

  trackBookingConversion(data) {
    if (window.gtag) {
      window.gtag('event', 'booking_completed', {
        meeting_type: this.selectedMeetingType,
        invitee_email: data.payload.invitee.email,
        event_name: data.payload.event.name,
      })
    }

    // Track in local storage for follow-up
    localStorage.setItem(
      'last_booking',
      JSON.stringify({
        meetingType: this.selectedMeetingType,
        timestamp: Date.now(),
        inviteeEmail: data.payload.invitee.email,
      })
    )
  }
}
```

- [ ] Run `npm test` to verify tests pass (GREEN Phase)
- [ ] Commit working implementation: `git add . && git commit -m "GREEN: Implement BookingSystem class"`

- [ ] 6.3 Create booking system styling (REFACTOR Phase)
- [ ] Create `src/styles/components/booking-system.css`:

```css
/* Booking System Styles */
.booking-system {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.booking-header {
  text-align: center;
  margin-bottom: 3rem;
}

.booking-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.booking-header p {
  font-size: 1.125rem;
  color: var(--text-secondary);
  max-width: 500px;
  margin: 0 auto;
}

/* Meeting Types Grid */
.meeting-types {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.meeting-type {
  background: var(--surface);
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.meeting-type:hover {
  border-color: var(--primary);
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.meeting-type::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient-primary);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.meeting-type:hover::before {
  transform: scaleX(1);
}

.meeting-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  text-align: center;
}

.meeting-info h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.meeting-duration {
  font-size: 0.875rem;
  color: var(--primary);
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.meeting-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.select-meeting {
  background: var(--primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.select-meeting:hover {
  background: var(--highlight);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Calendar Container */
.calendar-container {
  background: var(--surface);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: var(--shadow-md);
}

.calendar-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
}

.back-button {
  background: var(--background);
  border: 2px solid var(--primary);
  color: var(--primary);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: var(--primary);
  color: white;
}

.calendar-header h3 {
  font-size: 1.5rem;
  color: var(--text-primary);
  margin: 0;
}

.calendar-widget {
  min-height: 600px;
  border-radius: 0.5rem;
  overflow: hidden;
}

/* Pre-call Questionnaire */
.pre-call-questionnaire {
  background: var(--surface);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: var(--shadow-md);
}

.pre-call-questionnaire h3 {
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.pre-call-questionnaire > p {
  color: var(--text-secondary);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.questionnaire-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  background: var(--background);
  color: var(--text-primary);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

.field-error {
  color: var(--primary);
  font-size: 0.75rem;
  margin-top: 0.25rem;
  min-height: 1rem;
}

.submit-questionnaire {
  background: var(--primary);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.submit-questionnaire:hover {
  background: var(--highlight);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Booking Confirmation */
.booking-confirmation {
  text-align: center;
  background: var(--surface);
  border-radius: 1rem;
  padding: 3rem 2rem;
  box-shadow: var(--shadow-md);
}

.confirmation-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: checkmarkBounce 0.6s ease;
}

@keyframes checkmarkBounce {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.booking-confirmation h3 {
  font-size: 2rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.confirmation-message {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.next-steps {
  background: var(--background);
  border-radius: 0.5rem;
  padding: 1.5rem;
  text-align: left;
  max-width: 500px;
  margin: 0 auto;
}

.next-steps h4 {
  color: var(--text-primary);
  margin-bottom: 1rem;
  font-size: 1.125rem;
}

.next-steps ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.next-steps li {
  padding: 0.5rem 0;
  color: var(--text-secondary);
  position: relative;
  padding-left: 1.5rem;
}

.next-steps li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--primary);
  font-weight: 600;
}

/* Error Handling */
.booking-error {
  background: rgba(196, 30, 58, 0.1);
  border: 2px solid var(--primary);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 2rem;
  animation: errorSlideIn 0.3s ease;
}

@keyframes errorSlideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.error-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.error-icon {
  font-size: 1.25rem;
}

.error-message {
  flex: 1;
  color: var(--primary);
  font-weight: 600;
}

.close-error {
  background: none;
  border: none;
  color: var(--primary);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Dark theme adjustments */
[data-theme='dark'] .meeting-type {
  border-color: rgba(255, 255, 255, 0.2);
}

[data-theme='dark'] .meeting-type:hover {
  border-color: var(--primary);
}

[data-theme='dark'] .calendar-header {
  border-bottom-color: rgba(255, 255, 255, 0.2);
}

[data-theme='dark'] .form-group input,
[data-theme='dark'] .form-group select,
[data-theme='dark'] .form-group textarea {
  border-color: rgba(255, 255, 255, 0.2);
  background: var(--surface);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .booking-system {
    padding: 1rem;
  }

  .booking-header h2 {
    font-size: 2rem;
  }

  .meeting-types {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .meeting-type {
    padding: 1rem;
  }

  .calendar-container,
  .pre-call-questionnaire,
  .booking-confirmation {
    padding: 1.5rem;
  }

  .calendar-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .back-button {
    align-self: flex-start;
  }

  .calendar-widget {
    min-height: 500px;
  }
}

@media (max-width: 480px) {
  .booking-system {
    padding: 0.5rem;
  }

  .meeting-icon {
    font-size: 2.5rem;
  }

  .booking-confirmation {
    padding: 2rem 1rem;
  }

  .confirmation-icon {
    font-size: 3rem;
  }
}

/* Accessibility improvements */
.meeting-type:focus,
.select-meeting:focus,
.back-button:focus,
.submit-questionnaire:focus {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .meeting-type,
  .select-meeting,
  .submit-questionnaire,
  .back-button {
    transition: none;
  }

  .meeting-type:hover {
    transform: none;
  }

  .confirmation-icon {
    animation: none;
  }

  @keyframes checkmarkBounce,
  @keyframes errorSlideIn {
    from,
    to {
      opacity: 1;
      transform: none;
    }
  }
}
```
