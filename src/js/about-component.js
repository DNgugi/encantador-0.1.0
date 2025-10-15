// About Section Component
import { translationManager } from './translation-system.js'

export function createAboutComponent(container) {
  let aboutElement = null
  let isDestroyed = false

  // Create the team SVG illustration
  function createTeamSVG() {
    return `
      <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" loading="lazy" class="team-illustration-svg">
        <!-- Hong Kong skyline background -->
        <defs>
          <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#7fb3d3;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#2d8659;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="buildingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#c41e3a;stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#a8336b;stop-opacity:0.6" />
          </linearGradient>
        </defs>
        
        <!-- Sky background -->
        <rect width="800" height="300" fill="url(#skyGradient)" />
        
        <!-- Hong Kong IFC Tower and skyline -->
        <rect x="100" y="150" width="40" height="150" fill="url(#buildingGradient)" rx="5" class="hong-kong-building" />
        <rect x="160" y="180" width="35" height="120" fill="#2d8659" rx="3" class="hong-kong-building" />
        <rect x="210" y="160" width="45" height="140" fill="url(#buildingGradient)" rx="5" class="hong-kong-building" />
        <rect x="270" y="190" width="30" height="110" fill="#e6c200" rx="3" class="hong-kong-building" />
        <rect x="320" y="140" width="50" height="160" fill="url(#buildingGradient)" rx="5" class="hong-kong-building" />
        
        <!-- Victoria Harbour waves -->
        <path d="M0,300 Q200,280 400,300 T800,300 L800,350 L0,350 Z" fill="#2d8659" opacity="0.7" />
        <path d="M0,320 Q150,310 300,320 T600,320 T800,320 L800,350 L0,350 Z" fill="#7fb3d3" opacity="0.5" />
        
        <!-- Business team illustration -->
        <!-- Person 1 - Alex Chen -->
        <g transform="translate(150, 350)">
          <!-- Body -->
          <ellipse cx="0" cy="40" rx="25" ry="35" fill="#c41e3a" />
          <!-- Head -->
          <circle cx="0" cy="0" r="20" fill="#f4c2a1" />
          <!-- Hair -->
          <path d="M-18,-10 Q0,-25 18,-10 Q15,-20 0,-22 Q-15,-20 -18,-10" fill="#2c1810" />
          <!-- Laptop -->
          <rect x="-15" y="20" width="30" height="20" fill="#2d8659" rx="2" />
          <rect x="-12" y="22" width="24" height="12" fill="#ffffff" />
          <!-- Business charts on laptop -->
          <line x1="-8" y1="30" x2="-4" y2="26" stroke="#c41e3a" stroke-width="1" />
          <line x1="-4" y1="26" x2="0" y2="28" stroke="#c41e3a" stroke-width="1" />
          <line x1="0" y1="28" x2="4" y2="24" stroke="#c41e3a" stroke-width="1" />
          <line x1="4" y1="24" x2="8" y2="26" stroke="#c41e3a" stroke-width="1" />
        </g>
        
        <!-- Person 2 - Sarah Wong -->
        <g transform="translate(350, 350)">
          <!-- Body -->
          <ellipse cx="0" cy="40" rx="25" ry="35" fill="#2d8659" />
          <!-- Head -->
          <circle cx="0" cy="0" r="20" fill="#f4c2a1" />
          <!-- Hair -->
          <path d="M-18,-8 Q0,-22 18,-8 Q12,-18 0,-20 Q-12,-18 -18,-8" fill="#1a0f0a" />
          <!-- Tablet/Device -->
          <rect x="-12" y="15" width="24" height="18" fill="#a8336b" rx="3" />
          <rect x="-10" y="17" width="20" height="14" fill="#ffffff" />
          <!-- Code/Design elements -->
          <rect x="-8" y="19" width="4" height="2" fill="#2d8659" />
          <rect x="-3" y="19" width="6" height="2" fill="#c41e3a" />
          <rect x="-8" y="22" width="8" height="2" fill="#e6c200" />
          <rect x="-8" y="25" width="5" height="2" fill="#2d8659" />
        </g>
        
        <!-- Collaboration elements -->
        <!-- Connection lines between team members -->
        <path d="M175,390 Q250,370 325,390" stroke="#e6c200" stroke-width="3" fill="none" opacity="0.8" />
        
        <!-- AI enhancement symbols -->
        <g transform="translate(250, 380)">
          <circle cx="0" cy="0" r="15" fill="#e6c200" opacity="0.3" />
          <path d="M-8,-8 L8,8 M8,-8 L-8,8" stroke="#c41e3a" stroke-width="2" />
          <circle cx="0" cy="0" r="3" fill="#c41e3a" />
        </g>
        
        <!-- Success metrics visualization -->
        <g transform="translate(500, 400)">
          <!-- Chart bars -->
          <rect x="0" y="20" width="8" height="30" fill="#2d8659" />
          <rect x="12" y="15" width="8" height="35" fill="#c41e3a" />
          <rect x="24" y="10" width="8" height="40" fill="#e6c200" />
          <rect x="36" y="5" width="8" height="45" fill="#a8336b" />
          <!-- Chart title -->
          <text x="22" y="0" text-anchor="middle" font-size="8" fill="#2c1810">Growth</text>
        </g>
        
        <!-- Hong Kong cultural elements -->
        <!-- Jade prosperity pattern -->
        <g transform="translate(600, 320)" opacity="0.4">
          <path d="M0,0 L20,0 L20,20 L0,20 Z" fill="none" stroke="#2d8659" stroke-width="1" />
          <path d="M5,5 L15,5 L15,15 L5,15 Z" fill="none" stroke="#2d8659" stroke-width="1" />
          <path d="M0,10 L20,10 M10,0 L10,20" stroke="#2d8659" stroke-width="0.5" />
        </g>
      </svg>
    `
  }

  // Render the about section
  function render() {
    if (isDestroyed) return

    const translations = translationManager.getTranslations()
    const aboutData = translations.about || {}

    aboutElement = document.createElement('section')
    aboutElement.className = 'about-section'
    aboutElement.innerHTML = `
      <div class="about-full-width-layout">
        <div class="about-content">
          <div class="about-header">
            <h2 class="about-title">${aboutData.title || 'About Studio Encantador'}</h2>
            <p class="about-subtitle">${aboutData.subtitle || 'Hong Kong Business Consulting Excellence'}</p>
          </div>
          
          <div class="about-story">
            <p class="about-story-text">${aboutData.story || 'Founded in January 2025, Studio Encantador is a boutique consulting agency...'}</p>
          </div>
          
          <div class="about-founders">
            <h3 class="founders-title">${aboutData.founders?.title || 'Meet Our Founders'}</h3>
            <div class="founders-grid">
              ${(aboutData.founders?.profiles || [])
                .map(
                  (founder, index) => `
                <div class="founder-profile-card" data-founder="${founder.name.toLowerCase().replace(/\s+/g, '-')}">
                  <div class="founder-photo-container">
                    <img src="https://images.unsplash.com/photo-${index === 0 ? '1507003211169-0a1dd7228f2d' : '1472099645785-5658abf4ff4e'}?w=300&h=300&fit=crop&crop=face&auto=format&q=80" alt="${founder.name} - ${founder.title}" class="founder-photo" loading="lazy" decoding="async" />
                  </div>
                  <div class="founder-header">
                    <h4 class="founder-name">${founder.name}</h4>
                    <p class="founder-title">${founder.title}</p>
                  </div>
                  <div class="founder-background">
                    <p>${founder.background}</p>
                  </div>
                  <div class="founder-experience">
                    <h5>Experience:</h5>
                    <p>${founder.experience || 'Extensive experience in Hong Kong market'}</p>
                  </div>
                  <div class="founder-achievements">
                    <h5>Key Achievements:</h5>
                    <p>${founder.achievements || 'Recognized expert in the field'}</p>
                  </div>
                  <div class="founder-expertise">
                    <h5>Expertise Areas:</h5>
                    <p>${index === 0 ? 'Business Strategy, Consulting, Market Analysis' : 'Technical Development, Innovation, Team Building'}</p>
                  </div>
                  <div class="founder-certifications">
                    <h5>Certifications & Credentials:</h5>
                    <div class="certifications-badges">
                      ${(founder.certifications || []).map(cert => `<span class="certification-badge">${cert}</span>`).join('')}
                    </div>
                  </div>
                </div>
              `
                )
                .join('')}
            </div>
          </div>
          
          <div class="about-credibility">
            <h3 class="credibility-title">${aboutData.credibility?.title || 'Why Choose Studio Encantador'}</h3>
            
            <!-- Credibility Metrics -->
            <div class="credibility-metrics">
              <div class="credibility-metric" data-metric="experience">
                <div class="metric-value">15+</div>
                <div class="metric-label">Years Combined Experience</div>
              </div>
              <div class="credibility-metric" data-metric="projects">
                <div class="metric-value">150+</div>
                <div class="metric-label">Projects Completed</div>
              </div>
              <div class="credibility-metric" data-metric="satisfaction">
                <div class="metric-value">98%</div>
                <div class="metric-label">Client Satisfaction</div>
              </div>
              <div class="credibility-metric" data-metric="focus">
                <div class="metric-value">100%</div>
                <div class="metric-label">Hong Kong Market Focus</div>
              </div>
            </div>

            <!-- Credibility Groups -->
            <div class="credibility-groups">
              <div class="credibility-group" data-type="experience">
                <h4 class="group-title">Experience & Expertise</h4>
                <div class="key-credential trust-indicator">
                  <div class="trust-icon">🏆</div>
                  <p>Deep Hong Kong market knowledge and cultural expertise</p>
                </div>
                <div class="key-credential trust-indicator">
                  <div class="trust-icon">🎯</div>
                  <p>AI-enhanced consulting methodologies for data-driven insights</p>
                </div>
              </div>
              
              <div class="credibility-group" data-type="expertise">
                <h4 class="group-title">Professional Qualifications</h4>
                <div class="key-credential trust-indicator">
                  <div class="trust-icon">📊</div>
                  <p>Proven track record in business transformation and growth</p>
                </div>
                <div class="key-credential trust-indicator">
                  <div class="trust-icon">🌏</div>
                  <p>Bilingual team with international and local experience</p>
                </div>
              </div>
              
              <div class="credibility-group" data-type="results">
                <h4 class="group-title">Client Success</h4>
                ${(aboutData.credibility?.elements || [])
                  .map(
                    element => `
                  <div class="credibility-item trust-indicator">
                    <div class="credibility-icon trust-icon">✓</div>
                    <p>${element}</p>
                  </div>
                `
                  )
                  .join('')}
              </div>
            </div>

            <!-- Client Testimonials -->
            <div class="credibility-testimonials">
              <h4 class="testimonials-title">What Our Clients Say</h4>
              <div class="testimonials-grid">
                <div class="testimonial-item">
                  <blockquote class="testimonial-quote">
                    "Studio Encantador transformed our business operations with their innovative approach and deep understanding of the Hong Kong market."
                  </blockquote>
                  <cite class="testimonial-author">
                    <span class="author-name">Michael Chen</span>
                    <span class="author-company">Hong Kong Tech Startup</span>
                  </cite>
                </div>
                <div class="testimonial-item">
                  <blockquote class="testimonial-quote">
                    "Their team development program significantly improved our cross-cultural communication and productivity. The results exceeded our expectations."
                  </blockquote>
                  <cite class="testimonial-author">
                    <span class="author-name">Lisa Wong</span>
                    <span class="author-company">Multinational Corporation</span>
                  </cite>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `

    container.appendChild(aboutElement)
    setupResponsiveBehavior()
    setupPerformanceOptimizations()
  }

  // Setup responsive behavior
  function setupResponsiveBehavior() {
    if (isDestroyed) return

    const aboutLayout = aboutElement?.querySelector(
      '.about-full-width-layout, .about-split-layout'
    )
    if (!aboutLayout) return

    function updateLayout() {
      const isMobile = window.innerWidth <= 768
      const contentArea = aboutElement.querySelector('.about-content')

      if (contentArea) {
        if (isMobile) {
          contentArea.style.textAlign = 'center'
        } else {
          contentArea.style.textAlign = 'left'
        }
      }

      // Handle legacy split layout if it exists
      if (aboutLayout.classList.contains('about-split-layout')) {
        if (isMobile) {
          aboutLayout.style.flexDirection = 'column'
        } else {
          aboutLayout.style.flexDirection = 'row'
        }
      }
    }

    // Initial layout
    updateLayout()

    // Listen for resize events
    window.addEventListener('resize', updateLayout)
  }

  // Setup performance optimizations
  function setupPerformanceOptimizations() {
    if (isDestroyed) return

    // Add lazy loading to SVG
    const svg = aboutElement?.querySelector('.team-illustration-svg')
    if (svg) {
      svg.setAttribute('loading', 'lazy')
    }

    // Add lazy loading to any images
    const images = aboutElement?.querySelectorAll('img')
    images?.forEach(img => {
      img.setAttribute('loading', 'lazy')
      img.setAttribute('decoding', 'async')
    })
  }

  // Update content when language changes
  function updateContent(translations) {
    if (isDestroyed || !aboutElement) return

    const aboutData = translations.about || {}

    // Update text content
    const titleElement = aboutElement.querySelector('.about-title')
    if (titleElement)
      titleElement.textContent = aboutData.title || 'About Studio Encantador'

    const subtitleElement = aboutElement.querySelector('.about-subtitle')
    if (subtitleElement)
      subtitleElement.textContent =
        aboutData.subtitle || 'Hong Kong Business Consulting Excellence'

    const storyElement = aboutElement.querySelector('.about-story-text')
    if (storyElement)
      storyElement.textContent = aboutData.story || 'Founded in January 2025...'

    // Update founders section
    const foundersTitle = aboutElement.querySelector('.founders-title')
    if (foundersTitle)
      foundersTitle.textContent =
        aboutData.founders?.title || 'Meet Our Founders'

    // Update credibility section
    const credibilityTitle = aboutElement.querySelector('.credibility-title')
    if (credibilityTitle)
      credibilityTitle.textContent =
        aboutData.credibility?.title || 'Why Choose Studio Encantador'

    // Re-render founders and credibility items for language changes
    const foundersGrid = aboutElement.querySelector('.founders-grid')
    if (foundersGrid && aboutData.founders?.profiles) {
      foundersGrid.innerHTML = aboutData.founders.profiles
        .map(
          founder => `
        <div class="founder-profile-card" data-founder="${founder.name.toLowerCase().replace(/\s+/g, '-')}">
          <div class="founder-header">
            <h4 class="founder-name">${founder.name}</h4>
            <p class="founder-title">${founder.title}</p>
          </div>
          <div class="founder-background">
            <p>${founder.background}</p>
          </div>
          <div class="founder-certifications">
            <h5>Certifications & Credentials:</h5>
            <ul>
              ${(founder.certifications || []).map(cert => `<li>${cert}</li>`).join('')}
            </ul>
          </div>
        </div>
      `
        )
        .join('')
    }

    const credibilityGrid = aboutElement.querySelector('.credibility-grid')
    if (credibilityGrid && aboutData.credibility?.elements) {
      credibilityGrid.innerHTML = aboutData.credibility.elements
        .map(
          element => `
        <div class="credibility-item">
          <div class="credibility-icon">✓</div>
          <p>${element}</p>
        </div>
      `
        )
        .join('')
    }
  }

  // Cleanup function
  function destroy() {
    isDestroyed = true
    if (aboutElement && aboutElement.parentNode) {
      aboutElement.parentNode.removeChild(aboutElement)
    }
    aboutElement = null
  }

  return {
    render,
    updateContent,
    setupResponsiveBehavior,
    destroy,
  }
}
