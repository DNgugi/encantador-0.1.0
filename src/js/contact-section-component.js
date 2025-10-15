import { ContactForm } from './contact-form-component.js'
import { ContactMethods } from './contact-methods-component.js'

export class ContactSection {
  constructor(container) {
    this.container = container
    this.contactForm = null
    this.contactMethods = null
    this.currentLanguage = 'en'

    this.init()
  }

  init() {
    this.render()
    this.setupComponents()
  }

  setLanguage(language) {
    this.currentLanguage = language

    if (this.contactForm) {
      this.contactForm.setLanguage(language)
      this.contactForm.render()
    }

    if (this.contactMethods) {
      this.contactMethods.setLanguage(language)
      this.contactMethods.render()
    }
  }

  render() {
    const sectionHTML = `
      <section class="contact-section-wrapper">
        <div id="contact-form-container"></div>
        <div id="contact-methods-container"></div>
      </section>
    `

    this.container.innerHTML = sectionHTML
  }

  setupComponents() {
    // Initialize contact form
    const formContainer = this.container.querySelector(
      '#contact-form-container'
    )
    if (formContainer) {
      this.contactForm = new ContactForm(formContainer)
      this.contactForm.render()
    }

    // Initialize contact methods
    const methodsContainer = this.container.querySelector(
      '#contact-methods-container'
    )
    if (methodsContainer) {
      this.contactMethods = new ContactMethods(methodsContainer)
      this.contactMethods.render()
    }
  }

  // Integrate form submission with contact methods
  async handleFormSubmission(formData) {
    if (this.contactMethods) {
      return await this.contactMethods.handleFormSubmission(formData)
    }
    return { success: false, error: 'Contact methods not initialized' }
  }
}
