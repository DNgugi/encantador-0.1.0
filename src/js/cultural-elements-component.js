/**
 * Cultural Elements Component
 * Manages Hong Kong cultural design elements including Victoria Harbour waves,
 * IFC Tower skyline, and Hong Kong hills patterns
 */

class CulturalElementsComponent {
  constructor() {
    this.waveContainers = []
    this.culturalPatterns = []
    this.animationFrameId = null
    this.isReducedMotion = this.checkReducedMotion()

    this.init()
  }

  /**
   * Initialize cultural elements component
   */
  init() {
    this.createWaveElements()
    this.createCulturalPatterns()
    this.setupEventListeners()
    this.startAnimations()
  }

  /**
   * Check if user prefers reduced motion
   */
  checkReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  /**
   * Create Victoria Harbour wave elements
   */
  createWaveElements() {
    const waveContainers = document.querySelectorAll('.harbour-wave-container')

    waveContainers.forEach(container => {
      // Ensure container has proper structure
      if (container.children.length === 0) {
        for (let i = 1; i <= 3; i++) {
          const wave = document.createElement('div')
          wave.className = 'harbour-wave'
          wave.setAttribute('data-testid', `wave-${i}`)
          wave.setAttribute('aria-hidden', 'true')
          container.appendChild(wave)
        }
      }

      // Add animation classes if motion is allowed
      if (!this.isReducedMotion) {
        const waves = container.querySelectorAll('.harbour-wave')
        waves.forEach(wave => {
          wave.classList.add('harbour-wave-animation')
        })
      }

      this.waveContainers.push(container)
    })
  }

  /**
   * Create cultural pattern elements
   */
  createCulturalPatterns() {
    const patternContainers = document.querySelectorAll('.cultural-patterns')

    patternContainers.forEach(container => {
      // Ensure container has proper structure
      if (container.children.length === 0) {
        // IFC Tower Skyline
        const ifcTower = document.createElement('div')
        ifcTower.className = 'ifc-tower-skyline cultural-element'
        ifcTower.setAttribute('data-testid', 'ifc-tower')
        ifcTower.setAttribute(
          'aria-label',
          'Hong Kong IFC Tower skyline illustration'
        )
        ifcTower.setAttribute('role', 'img')
        container.appendChild(ifcTower)

        // Hong Kong Hills
        const hkHills = document.createElement('div')
        hkHills.className = 'hong-kong-hills cultural-element'
        hkHills.setAttribute('data-testid', 'hk-hills')
        hkHills.setAttribute(
          'aria-label',
          'Hong Kong mountain hills silhouette'
        )
        hkHills.setAttribute('role', 'img')
        container.appendChild(hkHills)

        // Jade Crosshatch Pattern
        const jadePattern = document.createElement('div')
        jadePattern.className = 'jade-crosshatch cultural-element'
        jadePattern.setAttribute('data-testid', 'jade-pattern')
        jadePattern.setAttribute(
          'aria-label',
          'Jade green prosperity crosshatch pattern'
        )
        jadePattern.setAttribute('role', 'img')
        container.appendChild(jadePattern)
      }

      this.culturalPatterns.push(container)
    })
  }

  /**
   * Setup event listeners for responsive behavior
   */
  setupEventListeners() {
    // Handle window resize for responsive patterns
    window.addEventListener('resize', this.handleResize.bind(this))

    // Handle reduced motion preference changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    mediaQuery.addEventListener(
      'change',
      this.handleMotionPreferenceChange.bind(this)
    )

    // Handle theme changes for cultural elements
    document.addEventListener('themeChanged', this.handleThemeChange.bind(this))
  }

  /**
   * Handle window resize events
   */
  handleResize() {
    this.updateResponsiveElements()
  }

  /**
   * Handle motion preference changes
   */
  handleMotionPreferenceChange(e) {
    this.isReducedMotion = e.matches

    if (this.isReducedMotion) {
      this.pauseAnimations()
    } else {
      this.resumeAnimations()
    }
  }

  /**
   * Handle theme changes
   */
  handleThemeChange() {
    // Cultural elements automatically adapt via CSS custom properties
    // This method can be extended for additional theme-specific logic
    this.updateCulturalElementColors()
  }

  /**
   * Start wave animations
   */
  startAnimations() {
    if (this.isReducedMotion) return

    const animate = () => {
      this.updateWaveAnimations()
      this.animationFrameId = requestAnimationFrame(animate)
    }

    animate()
  }

  /**
   * Update wave animations
   */
  updateWaveAnimations() {
    // Additional wave animation logic can be added here
    // Currently handled by CSS animations for performance
  }

  /**
   * Pause all animations
   */
  pauseAnimations() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }

    // Remove animation classes
    this.waveContainers.forEach(container => {
      const waves = container.querySelectorAll('.harbour-wave')
      waves.forEach(wave => {
        wave.classList.remove('harbour-wave-animation')
        wave.style.animationPlayState = 'paused'
      })
    })
  }

  /**
   * Resume animations
   */
  resumeAnimations() {
    // Add animation classes back
    this.waveContainers.forEach(container => {
      const waves = container.querySelectorAll('.harbour-wave')
      waves.forEach(wave => {
        wave.classList.add('harbour-wave-animation')
        wave.style.animationPlayState = 'running'
      })
    })

    this.startAnimations()
  }

  /**
   * Update responsive elements based on viewport
   */
  updateResponsiveElements() {
    const viewport = window.innerWidth

    this.culturalPatterns.forEach(container => {
      const patterns = container.querySelectorAll('.cultural-element')

      patterns.forEach(pattern => {
        if (viewport <= 480) {
          pattern.style.transform = 'scale(0.8)'
        } else if (viewport <= 768) {
          pattern.style.transform = 'scale(0.9)'
        } else {
          pattern.style.transform = 'scale(1)'
        }
      })
    })
  }

  /**
   * Update cultural element colors based on theme
   */
  updateCulturalElementColors() {
    // Colors are handled by CSS custom properties
    // This method can be extended for dynamic color adjustments
  }

  /**
   * Add cultural elements to a specific container
   */
  addCulturalElements(
    containerId,
    elements = ['waves', 'skyline', 'hills', 'crosshatch']
  ) {
    const container = document.getElementById(containerId)
    if (!container) return

    if (elements.includes('waves')) {
      const waveContainer = document.createElement('div')
      waveContainer.className = 'harbour-wave-container'
      container.appendChild(waveContainer)
      this.createWaveElements()
    }

    if (
      elements.includes('skyline') ||
      elements.includes('hills') ||
      elements.includes('crosshatch')
    ) {
      const patternsContainer = document.createElement('div')
      patternsContainer.className = 'cultural-patterns'
      container.appendChild(patternsContainer)
      this.createCulturalPatterns()
    }
  }

  /**
   * Remove cultural elements
   */
  removeCulturalElements() {
    this.pauseAnimations()

    this.waveContainers.forEach(container => {
      container.remove()
    })

    this.culturalPatterns.forEach(container => {
      container.remove()
    })

    this.waveContainers = []
    this.culturalPatterns = []
  }

  /**
   * Get animation performance metrics
   */
  getPerformanceMetrics() {
    return {
      waveContainers: this.waveContainers.length,
      culturalPatterns: this.culturalPatterns.length,
      isAnimating: !!this.animationFrameId,
      isReducedMotion: this.isReducedMotion,
    }
  }

  /**
   * Cleanup component
   */
  destroy() {
    this.pauseAnimations()

    window.removeEventListener('resize', this.handleResize.bind(this))

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    mediaQuery.removeEventListener(
      'change',
      this.handleMotionPreferenceChange.bind(this)
    )

    document.removeEventListener(
      'themeChanged',
      this.handleThemeChange.bind(this)
    )

    this.waveContainers = []
    this.culturalPatterns = []
  }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.culturalElements = new CulturalElementsComponent()
})

// Export for module usage
export default CulturalElementsComponent
