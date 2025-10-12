// Service Cards Component
import { translationManager } from './translation-system.js'

export function createServiceCardsComponent(container) {
  let servicesSection = null
  let isDestroyed = false

  // Service data structure
  const services = [
    {
      id: 'consulting',
      key: 'consulting',
      icon: 'consulting-icon',
    },
    {
      id: 'web',
      key: 'web',
      icon: 'web-icon',
    },
    {
      id: 'team',
      key: 'team',
      icon: 'team-icon',
    },
  ]

  // Custom SVG icons for each service
  const serviceIcons = {
    'consulting-icon': `
      <svg loading="lazy" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="consultingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:var(--primary);stop-opacity:1" />
            <stop offset="100%" style="stop-color:var(--highlight);stop-opacity:1" />
          </linearGradient>
        </defs>
        <!-- Pink/red background circle -->
        <circle cx="100" cy="100" r="95" fill="#f8d7da" stroke="#e8a2aa" stroke-width="2"/>
        <!-- Business consulting illustration -->
        <circle cx="100" cy="100" r="80" fill="url(#consultingGrad)" opacity="0.1"/>
        <rect x="60" y="70" width="80" height="60" rx="8" fill="var(--primary)" opacity="0.8"/>
        <circle cx="100" cy="50" r="15" fill="var(--secondary)"/>
        <path d="M85 65 L115 65 M85 85 L115 85 M85 105 L105 105" stroke="var(--background)" stroke-width="3" stroke-linecap="round"/>
        <polygon points="140,80 160,70 160,90" fill="var(--accent)"/>
      </svg>
    `,
    'web-icon': `
      <svg loading="lazy" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="webGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:var(--secondary);stop-opacity:1" />
            <stop offset="100%" style="stop-color:var(--accent);stop-opacity:1" />
          </linearGradient>
        </defs>
        <!-- Pink/red background circle -->
        <circle cx="100" cy="100" r="95" fill="#f8d7da" stroke="#e8a2aa" stroke-width="2"/>
        <!-- Web development illustration -->
        <circle cx="100" cy="100" r="80" fill="url(#webGrad)" opacity="0.1"/>
        <rect x="50" y="70" width="100" height="60" rx="4" fill="var(--surface)" stroke="var(--secondary)" stroke-width="2"/>
        <circle cx="60" cy="80" r="3" fill="var(--primary)"/>
        <circle cx="70" cy="80" r="3" fill="var(--accent)"/>
        <circle cx="80" cy="80" r="3" fill="var(--secondary)"/>
        <rect x="60" y="90" width="80" height="4" fill="var(--text-secondary)" opacity="0.3"/>
        <rect x="60" y="100" width="60" height="4" fill="var(--text-secondary)" opacity="0.3"/>
        <rect x="60" y="110" width="70" height="4" fill="var(--text-secondary)" opacity="0.3"/>
      </svg>
    `,
    'team-icon': `
      <svg loading="lazy" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="teamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:var(--accent);stop-opacity:1" />
            <stop offset="100%" style="stop-color:var(--primary);stop-opacity:1" />
          </linearGradient>
        </defs>
        <!-- Pink/red background circle -->
        <circle cx="100" cy="100" r="95" fill="#f8d7da" stroke="#e8a2aa" stroke-width="2"/>
        <!-- Team building illustration -->
        <circle cx="100" cy="100" r="70" fill="url(#teamGrad)" opacity="0.1"/>
        <circle cx="80" cy="90" r="12" fill="var(--primary)"/>
        <circle cx="120" cy="90" r="12" fill="var(--secondary)"/>
        <circle cx="100" cy="70" r="12" fill="var(--accent)"/>
        <path d="M80 105 Q100 120 120 105" stroke="var(--highlight)" stroke-width="3" fill="none" stroke-linecap="round"/>
        <circle cx="100" cy="130" r="8" fill="var(--secondary)" opacity="0.6"/>
      </svg>
    `,
  }

  function render() {
    if (isDestroyed) return

    const translations = translationManager.getTranslations()

    // Create services section
    servicesSection = document.createElement('section')
    servicesSection.className = 'services-section'
    servicesSection.innerHTML = `
      <div class="services-container">
        <div class="services-header">
          <h2 class="services-title">${translations.services?.title || 'Our Services'}</h2>
          <p class="services-subtitle">${translations.services?.subtitle || 'Comprehensive business solutions for Hong Kong companies'}</p>
        </div>
        <div class="services-grid">
          ${services.map(service => createServiceCard(service, translations)).join('')}
        </div>
      </div>
    `

    // Clear container and append new content
    container.innerHTML = ''
    container.appendChild(servicesSection)

    // Setup interactions and responsive behavior
    setupCardInteractions()
    setupResponsiveGrid()
    setupScrollAnimations()
  }

  function createServiceCard(service, translations) {
    const serviceData = translations.services?.[service.key] || {}

    return `
      <article class="service-card" 
               data-service="${service.id}" 
               role="article" 
               aria-label="${serviceData.title || service.key} service card"
               tabindex="0">
        <div class="service-icon">
          ${serviceIcons[service.icon]}
        </div>
        <div class="service-content">
          <h3 class="service-title">${serviceData.title || service.key}</h3>
          <p class="service-description">${serviceData.description || 'Service description'}</p>
          ${
            serviceData.features
              ? `
            <ul class="service-features">
              ${serviceData.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
          `
              : ''
          }
        </div>
      </article>
    `
  }

  function setupCardInteractions() {
    if (isDestroyed) return

    const serviceCards = servicesSection.querySelectorAll('.service-card')

    serviceCards.forEach(card => {
      // Hover effects
      card.addEventListener('mouseenter', handleCardHover)
      card.addEventListener('mouseleave', handleCardLeave)

      // Focus effects for accessibility
      card.addEventListener('focus', handleCardFocus)
      card.addEventListener('blur', handleCardBlur)

      // Set up performance optimizations
      card.style.willChange = 'transform'
      card.style.transition =
        'transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease'
    })
  }

  function handleCardHover(event) {
    const card = event.currentTarget
    card.classList.add('card-hover')

    // Apply primary red background on hover
    card.style.background = 'var(--primary)'

    // Apply shadow animation
    card.style.boxShadow = '0 20px 40px rgba(196, 30, 58, 0.25)'
    card.style.transform = 'translateY(-8px)'
  }

  function handleCardLeave(event) {
    const card = event.currentTarget
    card.classList.remove('card-hover')

    // Reset styles
    card.style.background = ''
    card.style.boxShadow = ''
    card.style.transform = ''
  }

  function handleCardFocus(event) {
    const card = event.currentTarget
    card.classList.add('card-focus')

    // Apply focus styles for accessibility
    card.style.outline = '2px solid var(--primary)'
    card.style.outlineOffset = '2px'
  }

  function handleCardBlur(event) {
    const card = event.currentTarget
    card.classList.remove('card-focus')

    // Reset focus styles
    card.style.outline = ''
    card.style.outlineOffset = ''
  }

  function setupResponsiveGrid() {
    if (isDestroyed) return

    const servicesGrid = servicesSection.querySelector('.services-grid')
    const screenWidth = window.innerWidth

    if (screenWidth >= 1024) {
      // Desktop: 3 columns
      servicesGrid.style.display = 'grid'
      servicesGrid.style.gridTemplateColumns = 'repeat(3, 1fr)'
      servicesGrid.style.gap = '2rem'
    } else if (screenWidth >= 768) {
      // Tablet: 2 columns
      servicesGrid.style.display = 'grid'
      servicesGrid.style.gridTemplateColumns = 'repeat(2, 1fr)'
      servicesGrid.style.gap = '1.5rem'
    } else {
      // Mobile: 1 column
      servicesGrid.style.display = 'grid'
      servicesGrid.style.gridTemplateColumns = '1fr'
      servicesGrid.style.gap = '1rem'
    }
  }

  function setupScrollAnimations() {
    if (isDestroyed) return

    const serviceCards = servicesSection.querySelectorAll('.service-card')

    // Set up staggered animation delays
    serviceCards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`
      card.style.opacity = '0'
      card.style.transform = 'translateY(30px)'
    })

    // Only set up IntersectionObserver if available
    if (window.IntersectionObserver) {
      // Intersection Observer for scroll animations
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.style.opacity = '1'
              entry.target.style.transform = 'translateY(0)'
              entry.target.style.transition =
                'opacity 0.6s ease, transform 0.6s ease'
            }
          })
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px',
        }
      )

      serviceCards.forEach(card => {
        observer.observe(card)
      })

      // Store observer for cleanup
      servicesSection._observer = observer
    }
  }

  function updateContent(translations) {
    if (isDestroyed) return
    render()
  }

  function destroy() {
    if (isDestroyed) return

    // Clean up event listeners and observers
    if (servicesSection) {
      const serviceCards = servicesSection.querySelectorAll('.service-card')
      serviceCards.forEach(card => {
        card.removeEventListener('mouseenter', handleCardHover)
        card.removeEventListener('mouseleave', handleCardLeave)
        card.removeEventListener('focus', handleCardFocus)
        card.removeEventListener('blur', handleCardBlur)
      })

      // Clean up intersection observer
      if (servicesSection._observer) {
        servicesSection._observer.disconnect()
      }

      // Remove from DOM
      if (servicesSection.parentNode) {
        servicesSection.parentNode.removeChild(servicesSection)
      }
    }

    isDestroyed = true
  }

  // Handle window resize for responsive grid
  function handleResize() {
    if (!isDestroyed) {
      setupResponsiveGrid()
    }
  }

  window.addEventListener('resize', handleResize)

  return {
    render,
    updateContent,
    destroy,
    setupResponsiveGrid,
    setupScrollAnimations,
  }
}
