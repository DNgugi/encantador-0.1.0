import { translationManager } from './translation-system.js'

export class ContactMethods {
  constructor(container) {
    this.container = container
    this.currentLanguage = 'en'
    this.mockSubmissionError = false

    // Contact information
    this.contactInfo = {
      email: 'hello@encantador.co',
      phone: '+852 6744 7452',
      address: 'Central, Hong Kong',
      hours: 'Monday - Friday: 9:00 AM - 6:00 PM',
    }

    this.init()
  }

  init() {
    this.setupEventListeners()
  }

  setLanguage(language) {
    this.currentLanguage = language
  }

  getTranslation(key, variables = {}, fallback = '') {
    const translations = translationManager.getTranslations()
    const keys = key.split('.')
    let value = translations

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        value = fallback
        break
      }
    }

    if (
      typeof value === 'string' &&
      variables &&
      Object.keys(variables).length > 0
    ) {
      return value.replace(/\{(\w+)\}/g, (match, varKey) => {
        return variables[varKey] !== undefined ? variables[varKey] : match
      })
    }

    return value || fallback
  }

  render() {
    const methodsHTML = `
      <section class="contact-methods">
        <div class="contact-methods-container">
          <h3 class="contact-methods-title">${this.getTranslation('contact.methods.title', {}, 'Other Ways to Reach Us')}</h3>
          
          <div class="contact-methods-grid">
            <div class="contact-method" data-method="email" tabindex="0" role="button" aria-label="Email us">
              <div class="method-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="method-content">
                <h4 class="method-title">Email</h4>
                <p class="method-text">${this.getTranslation('contact.methods.email', { email: this.contactInfo.email }, `Email us at ${this.contactInfo.email}`)}</p>
              </div>
            </div>

            <div class="contact-method" data-method="phone" tabindex="0" role="button" aria-label="Call us">
              <div class="method-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 16.92V19.92C22 20.52 21.39 21 20.92 21C9.11 21 1 12.89 1 1.08C1 0.61 1.48 0 2.08 0H5.08C5.68 0 6.08 0.4 6.08 0.92C6.08 3.29 6.5 5.58 7.29 7.69C7.41 7.97 7.35 8.3 7.13 8.52L5.25 10.4C7.28 14.43 9.57 16.72 13.6 18.75L15.48 16.87C15.7 16.65 16.03 16.59 16.31 16.71C18.42 17.5 20.71 17.92 23.08 17.92C23.6 17.92 24 18.32 24 18.92V21.92Z" fill="currentColor"/>
                </svg>
              </div>
              <div class="method-content">
                <h4 class="method-title">Phone</h4>
                <p class="method-text">${this.getTranslation('contact.methods.phone', { phone: this.contactInfo.phone }, `Call us at ${this.contactInfo.phone}`)}</p>
              </div>
            </div>

            <div class="contact-method" data-method="whatsapp" tabindex="0" role="button" aria-label="WhatsApp us">
              <a href="${this.generateWhatsAppUrl(this.contactInfo.phone)}" target="_blank" rel="noopener noreferrer">
                <div class="method-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382C17.367 14.382 17.188 14.317 16.935 14.187C16.682 14.057 15.618 13.543 15.378 13.448C15.139 13.353 14.961 13.305 14.782 13.565C14.604 13.825 14.207 14.317 14.051 14.496C13.894 14.675 13.738 14.697 13.485 14.567C13.232 14.437 12.402 14.141 11.402 13.249C10.622 12.553 10.087 11.706 9.931 11.446C9.775 11.186 9.913 11.043 10.041 10.913C10.157 10.795 10.294 10.615 10.422 10.457C10.55 10.299 10.597 10.184 10.69 10.005C10.783 9.826 10.736 9.668 10.672 9.538C10.608 9.408 10.087 8.331 9.869 7.811C9.656 7.302 9.438 7.370 9.281 7.362C9.132 7.354 8.953 7.352 8.775 7.352C8.596 7.352 8.309 7.417 8.069 7.677C7.829 7.937 7.267 8.451 7.267 9.528C7.267 10.605 8.091 11.639 8.218 11.818C8.346 11.997 10.087 14.663 12.772 15.579C13.329 15.805 13.767 15.944 14.106 16.047C14.663 16.212 15.166 16.186 15.563 16.119C16.007 16.045 16.835 15.601 17.053 15.112C17.271 14.623 17.271 14.210 17.207 14.112C17.143 14.014 16.964 13.949 16.711 13.819L17.472 14.382Z" fill="currentColor"/>
                    <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0C5.463 0 0.104 5.334 0.101 11.893C0.1 13.988 0.644 16.025 1.678 17.812L0 24L6.304 22.346C8.032 23.296 10.018 23.799 12.041 23.8H12.045C18.626 23.8 23.985 18.466 23.988 11.907C23.99 8.749 22.798 5.753 20.52 3.449ZM12.045 21.785C10.227 21.784 8.445 21.302 6.898 20.398L6.531 20.185L2.828 21.187L3.846 17.584L3.608 17.204C2.618 15.583 2.093 13.726 2.094 11.893C2.096 6.434 6.562 1.993 12.049 1.993C14.693 1.994 17.151 3.024 18.945 4.808C20.739 6.592 21.775 9.038 21.774 11.907C21.772 17.366 17.306 21.785 12.045 21.785Z" fill="currentColor"/>
                  </svg>
                </div>
                <div class="method-content">
                  <h4 class="method-title">WhatsApp</h4>
                  <p class="method-text">${this.getTranslation('contact.methods.whatsapp', { phone: this.contactInfo.phone }, `WhatsApp us at ${this.contactInfo.phone}`)}</p>
                </div>
              </a>
            </div>
          </div>
          
          <div class="submission-confirmation" style="display: none;">
            <p>Thank you! Your message has been sent successfully.</p>
          </div>
          
          <div class="submission-error" style="display: none;">
            <p>Sorry, there was an error sending your message. Please try again.</p>
          </div>
          
          <div class="copy-confirmation" style="display: none;">
            <p>Copied to clipboard!</p>
          </div>
        </div>
      </section>
    `

    this.container.innerHTML = methodsHTML
    this.setupMethodEventListeners()
  }

  setupEventListeners() {
    // Global event listeners if needed
  }

  setupMethodEventListeners() {
    const contactMethods = this.container.querySelectorAll('.contact-method')

    contactMethods.forEach(method => {
      method.addEventListener('click', e => this.handleMethodClick(e))
      method.addEventListener('keydown', e => this.handleMethodKeydown(e))
    })
  }

  handleMethodClick(e) {
    const method = e.currentTarget
    const methodType = method.getAttribute('data-method')

    method.classList.add('clicked')

    switch (methodType) {
      case 'email':
        this.handleEmailClick()
        break
      case 'phone':
        this.handlePhoneClick()
        break
      case 'office':
        this.handleOfficeClick()
        break
    }
  }

  handleMethodKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      this.handleMethodClick(e)
    }
  }

  async handleEmailClick() {
    try {
      await navigator.clipboard.writeText(this.contactInfo.email)
      this.showCopyConfirmation()
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      window.location.href = `mailto:${this.contactInfo.email}`
    }
  }

  async handlePhoneClick() {
    try {
      await navigator.clipboard.writeText(this.contactInfo.phone)
      this.showCopyConfirmation()
    } catch (err) {
      // Fallback for mobile devices
      window.location.href = `tel:${this.contactInfo.phone}`
    }
  }

  async handleOfficeClick() {
    try {
      await navigator.clipboard.writeText(this.contactInfo.address)
      this.showCopyConfirmation()
    } catch (err) {
      // Fallback - could open maps
      console.log('Address copied to clipboard failed')
    }
  }

  showCopyConfirmation() {
    const confirmation = this.container.querySelector('.copy-confirmation')
    if (confirmation) {
      confirmation.style.display = 'block'
      setTimeout(() => {
        confirmation.style.display = 'none'
      }, 2000)
    }
  }

  generateWhatsAppUrl(phoneNumber, message = null) {
    // Remove all non-digit characters except +
    const cleanPhone = phoneNumber.replace(/[^\d+]/g, '')

    // Remove + and any leading zeros
    const whatsappNumber = cleanPhone.replace(/^\+/, '').replace(/^0+/, '')

    // Default message based on language
    let defaultMessage = 'Hello, I would like to inquire about your services'
    if (this.currentLanguage === 'zh-hk') {
      defaultMessage = '您好，我想了解您的服務'
    } else if (this.currentLanguage === 'zh-cn') {
      defaultMessage = '您好，我想了解您的服务'
    }

    const finalMessage = message || defaultMessage
    const encodedMessage = encodeURIComponent(finalMessage)

    return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
  }

  formatContactInfo(type, value) {
    switch (type) {
      case 'phone':
        // Format Hong Kong phone numbers
        if (value.length === 8) {
          return `+852 ${value.substring(0, 4)} ${value.substring(4)}`
        }
        return value
      case 'email':
      case 'address':
      case 'hours':
      default:
        return value
    }
  }

  async submitForm(formData) {
    // Simulate form submission
    if (this.mockSubmissionError) {
      return {
        success: false,
        error: 'Submission failed',
      }
    }

    // Simulate async submission
    await new Promise(resolve => setTimeout(resolve, 1000))

    return {
      success: true,
      message: 'Form submitted successfully',
    }
  }

  async handleFormSubmission(formData) {
    try {
      const result = await this.submitForm(formData)

      if (result.success) {
        this.showSubmissionConfirmation()
        await this.sendConfirmationEmail(formData)
      } else {
        this.showSubmissionError()
      }

      return result
    } catch (error) {
      this.showSubmissionError()
      return {
        success: false,
        error: error.message,
      }
    }
  }

  showSubmissionConfirmation() {
    const confirmation = this.container.querySelector(
      '.submission-confirmation'
    )
    if (confirmation) {
      confirmation.style.display = 'block'
      setTimeout(() => {
        confirmation.style.display = 'none'
      }, 5000)
    }
  }

  showSubmissionError() {
    const error = this.container.querySelector('.submission-error')
    if (error) {
      error.style.display = 'block'
      setTimeout(() => {
        error.style.display = 'none'
      }, 5000)
    }
  }

  async sendConfirmationEmail(formData) {
    // Simulate sending confirmation email
    console.log('Sending confirmation email to:', formData.email)
    console.log('Form data:', formData)

    // In a real implementation, this would call an email service
    return Promise.resolve()
  }
}
