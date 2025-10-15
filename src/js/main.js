// Main application entry point
import { languageSwitcher } from './language-system.js'
import { translationManager } from './translation-system.js'
import { createHeaderComponent } from './header-component.js'
import { createHeroComponent } from './hero-component.js'
import { createServiceCardsComponent } from './service-cards-component.js'
import { createAboutComponent } from './about-component.js'
import { createPortfolioComponent } from './portfolio-component.js'
import { ContactSection } from './contact-section-component.js'
import { createFooterComponent } from './footer-component.js'
import CulturalElementsComponent from './cultural-elements-component.js'

console.log('Studio Encantador website loading...')

let headerComponent = null
let heroComponent = null
let serviceCardsComponent = null
let aboutComponent = null
let portfolioComponent = null
let contactSection = null
let footerComponent = null
let culturalElementsComponent = null

// Initialize application
document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM loaded, initializing application...')

  // Initialize header component
  // Create a header container and prepend it to body
  const headerContainer = document.createElement('div')
  headerContainer.id = 'header-container'
  document.body.prepend(headerContainer)

  if (headerContainer) {
    headerComponent = createHeaderComponent(headerContainer)
    headerComponent.initializeTheme()
    console.log('Header component initialized')
  }

  // Initialize language system
  const initialLanguage = languageSwitcher.initialize()
  console.log('Language system initialized with language:', initialLanguage)

  // Initialize translation system
  await translationManager.initialize(initialLanguage)
  console.log('Translation system initialized')

  // Initialize hero component after translations are loaded
  const heroContainer = document.querySelector('#app main')
  if (heroContainer) {
    heroComponent = createHeroComponent(heroContainer)
    heroComponent.render()
    console.log('Hero component initialized')
  }

  // Initialize service cards component
  const servicesContainer = document.createElement('section')
  servicesContainer.id = 'services'
  servicesContainer.className = 'services-section'
  if (heroContainer) {
    heroContainer.appendChild(servicesContainer)
    serviceCardsComponent = createServiceCardsComponent(servicesContainer)
    serviceCardsComponent.render()
    console.log('Service cards component initialized')
  }

  // Initialize about component
  const aboutContainer = document.createElement('section')
  aboutContainer.id = 'about'
  aboutContainer.className = 'about-section'
  if (heroContainer) {
    heroContainer.appendChild(aboutContainer)
    aboutComponent = createAboutComponent(aboutContainer)
    aboutComponent.render()
    console.log('About component initialized')
  }

  // Initialize portfolio component
  const portfolioContainer = document.createElement('section')
  portfolioContainer.id = 'portfolio'
  portfolioContainer.className = 'portfolio-section'
  if (heroContainer) {
    heroContainer.appendChild(portfolioContainer)
    portfolioComponent = createPortfolioComponent(portfolioContainer)
    portfolioComponent.render()
    console.log('Portfolio component initialized')
  }

  // Initialize contact section
  const contactContainer = document.createElement('section')
  contactContainer.id = 'contact'
  contactContainer.className = 'contact-section-wrapper'
  if (heroContainer) {
    heroContainer.appendChild(contactContainer)
    contactSection = new ContactSection(contactContainer)
    console.log('Contact section initialized')
  }

  // Initialize footer component
  const footerContainer = document.createElement('div')
  footerContainer.id = 'footer-container'
  document.body.appendChild(footerContainer)
  footerComponent = createFooterComponent(footerContainer)
  console.log('Footer component initialized')

  // Initialize cultural elements component
  culturalElementsComponent = new CulturalElementsComponent()
  console.log('Cultural elements component initialized')

  // Update demo display
  updateDemoDisplay(initialLanguage)

  // Listen for language changes
  document.addEventListener('languageChanged', async event => {
    const { language } = event.detail
    console.log('Language changed to:', language)

    // Load translations for new language
    await translationManager.switchLanguage(language)

    // Update hero component content
    if (heroComponent) {
      heroComponent.updateContent(translationManager.getTranslations())
    }

    // Update service cards component content
    if (serviceCardsComponent) {
      serviceCardsComponent.updateContent(translationManager.getTranslations())
    }

    // Update about component content
    if (aboutComponent) {
      aboutComponent.updateContent(translationManager.getTranslations())
    }

    // Update portfolio component content
    if (portfolioComponent) {
      portfolioComponent.updateContent(translationManager.getTranslations())
    }

    // Update contact section content
    if (contactSection) {
      contactSection.setLanguage(language)
    }

    // Update footer content
    if (footerComponent) {
      footerComponent.setLanguage(language)
      footerComponent.updateContent()
    }

    updateDemoDisplay(language)
  })

  // Listen for translation loading events
  document.addEventListener('translationsLoaded', event => {
    const { language, translations } = event.detail
    console.log(
      `Translations loaded for ${language}:`,
      Object.keys(translations).length,
      'keys'
    )
  })

  // Listen for missing translation events
  document.addEventListener('missingTranslation', event => {
    const { key, language } = event.detail
    console.warn(
      `Missing translation for key "${key}" in language "${language}"`
    )
  })

  // Listen for header events
  document.addEventListener('themeChanged', event => {
    const { theme } = event.detail
    console.log('Theme changed to:', theme)
  })

  // Add smooth scrolling for navigation links
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]')
    if (link) {
      event.preventDefault()
      const targetId = link.getAttribute('href').substring(1)
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    }
  })
})

// Demo function to show language switching in action
function updateDemoDisplay(language) {
  const currentLangElement = document.getElementById('current-language')
  const currentPathElement = document.getElementById('current-path')

  if (currentLangElement) {
    currentLangElement.textContent = language
  }

  if (currentPathElement) {
    currentPathElement.textContent = window.location.pathname
  }

  // Show translation stats
  const stats = translationManager.getStats()
  const missingKeys = translationManager.getMissingKeys()
  const statsElement = document.getElementById('translation-stats')
  if (statsElement) {
    let statsText = `${stats.totalKeys} translations loaded`
    if (stats.missingKeysCount > 0) {
      statsText += `, ${stats.missingKeysCount} missing: ${missingKeys.join(', ')}`
    }
    statsElement.textContent = statsText
  }
}
