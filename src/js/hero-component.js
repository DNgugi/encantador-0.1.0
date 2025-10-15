// Hero Section Component
import { translationManager } from './translation-system.js'
import { createHeroSVGIllustration } from './hero-svg-illustration.js'

export function createHeroComponent(container) {
  let heroElement = null

  const component = {
    render() {
      const translations = translationManager.getTranslations()

      heroElement = document.createElement('section')
      heroElement.className = 'hero-split-layout'
      heroElement.id = 'hero-section'

      heroElement.innerHTML = `
        <div class="hero-container">
          <div class="hero-text-content">
            <h1 class="hero-headline">
              ${translations?.hero?.headline || 'Transform Your Business with Expert Consulting'}
            </h1>
            <p class="hero-subheadline">
              ${translations?.hero?.subheadline || "Hong Kong's boutique consulting agency specializing in Business Strategy, Web Development, and Team Building"}
            </p>
            <div class="hero-cta-buttons">
              <button class="hero-cta-primary" role="button" aria-label="Get started with our consulting services">
                ${translations?.hero?.cta?.primary || 'Get Started'}
              </button>
              <button class="hero-cta-secondary" role="button" aria-label="Learn more about our services">
                ${translations?.hero?.cta?.secondary || 'Learn More'}
              </button>
            </div>
          </div>
          <div class="hero-illustration">
            <!-- Custom SVG illustration will be rendered here -->
          </div>
        </div>
      `

      container.appendChild(heroElement)

      // Render the custom SVG illustration
      const illustrationContainer =
        heroElement.querySelector('.hero-illustration')
      this.svgComponent = createHeroSVGIllustration(illustrationContainer)
      this.svgComponent.render()

      this.attachEventListeners()
      this.setupResponsiveBehavior()
      this.optimizePerformance()

      return heroElement
    },

    attachEventListeners() {
      const primaryCTA = heroElement.querySelector('.hero-cta-primary')
      const secondaryCTA = heroElement.querySelector('.hero-cta-secondary')

      // Primary CTA click handler
      primaryCTA.addEventListener('click', e => {
        e.preventDefault()
        // Scroll to contact section or open contact modal
        console.log('Primary CTA clicked - Get Started')
        // Future: implement contact form or scroll to contact section
      })

      // Secondary CTA click handler
      secondaryCTA.addEventListener('click', e => {
        e.preventDefault()
        // Scroll to services section
        console.log('Secondary CTA clicked - Learn More')
        // Future: scroll to services section
      })

      // Hover effects for CTA buttons
      ;[primaryCTA, secondaryCTA].forEach(button => {
        button.addEventListener('mouseenter', () => {
          button.classList.add('hover-active')
        })

        button.addEventListener('mouseleave', () => {
          button.classList.remove('hover-active')
        })
      })
    },

    setupResponsiveBehavior() {
      const updateLayout = () => {
        const isMobile = window.innerWidth <= 768
        const heroContainer = heroElement.querySelector('.hero-container')
        const textContent = heroElement.querySelector('.hero-text-content')

        if (heroContainer && textContent) {
          if (isMobile) {
            heroContainer.style.flexDirection = 'column'
            textContent.style.textAlign = 'center'
          } else {
            heroContainer.style.flexDirection = 'row'
            textContent.style.textAlign = 'left'
          }
        }
      }

      // Initial layout setup
      updateLayout()

      // Listen for window resize
      window.addEventListener('resize', updateLayout)
    },

    optimizePerformance() {
      // Set up performance optimizations
      heroElement.style.willChange = 'transform'

      // Lazy load illustration
      const svg = heroElement.querySelector('.hero-svg')
      if (svg) {
        svg.setAttribute('loading', 'lazy')
      }
    },

    updateContent(translations) {
      if (!heroElement) return

      const headline = heroElement.querySelector('.hero-headline')
      const subheadline = heroElement.querySelector('.hero-subheadline')
      const primaryCTA = heroElement.querySelector('.hero-cta-primary')
      const secondaryCTA = heroElement.querySelector('.hero-cta-secondary')

      if (headline && translations?.hero?.headline) {
        headline.textContent = translations.hero.headline
      }

      if (subheadline && translations?.hero?.subheadline) {
        subheadline.textContent = translations.hero.subheadline
      }

      if (primaryCTA && translations?.hero?.cta?.primary) {
        primaryCTA.textContent = translations.hero.cta.primary
      }

      if (secondaryCTA && translations?.hero?.cta?.secondary) {
        secondaryCTA.textContent = translations.hero.cta.secondary
      }
    },

    destroy() {
      if (this.svgComponent) {
        this.svgComponent.destroy()
        this.svgComponent = null
      }
      if (heroElement && heroElement.parentNode) {
        heroElement.parentNode.removeChild(heroElement)
        heroElement = null
      }
    },
  }

  return component
}
