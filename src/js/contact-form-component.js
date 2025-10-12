import { translationManager } from './translation-system.js'

export class ContactForm {
  constructor(container) {
    this.container = container
    this.currentLanguage = 'en'
    this.isSubmitting = false
    this.formData = {}

    // Hong Kong phone number patterns
    this.hkMobilePattern = /^[569]\d{7}$/
    this.hkLandlinePattern = /^[23]\d{7}$/
    this.hkPhoneWithCodePattern = /^\+852\s?[23569]\d{3}\s?\d{4}$/

    this.init()
  }

  init() {
    this.setupEventListeners()
  }

  setLanguage(language) {
    this.currentLanguage = language
  }

  validateForm(formData) {
    const errors = {}

    // Name validation
    if (!formData.name || formData.name.trim() === '') {
      errors.name = this.getTranslation(
        'contact.form.name.required',
        'Name is required'
      )
    } else if (formData.name.trim().length < 2) {
      errors.name = this.getTranslation(
        'contact.form.name.minLength',
        'Name must be at least 2 characters'
      )
    }

    // Email validation
    if (!formData.email || formData.email.trim() === '') {
      errors.email = this.getTranslation(
        'contact.form.email.required',
        'Email is required'
      )
    } else if (!this.isValidEmail(formData.email)) {
      errors.email = this.getTranslation(
        'contact.form.email.invalid',
        'Please enter a valid email address'
      )
    }

    // Phone validation (optional field)
    if (formData.phone && formData.phone.trim() !== '') {
      if (!this.isValidHongKongPhone(formData.phone)) {
        errors.phone = this.getTranslation(
          'contact.form.phone.invalid',
          'Please enter a valid Hong Kong phone number'
        )
      }
    }

    // Message validation
    if (!formData.message || formData.message.trim() === '') {
      errors.message = this.getTranslation(
        'contact.form.message.required',
        'Message is required'
      )
    } else if (formData.message.trim().length < 10) {
      errors.message = this.getTranslation(
        'contact.form.message.minLength',
        'Message must be at least 10 characters'
      )
    }

    return errors
  }

  isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailPattern.test(email)
  }

  isValidHongKongPhone(phone) {
    // Remove all spaces and formatting
    const cleanPhone = phone.replace(/\s/g, '')

    // Check if it has +852 prefix
    if (cleanPhone.startsWith('+852')) {
      return this.hkPhoneWithCodePattern.test(phone)
    }

    // Check if it's a valid HK mobile or landline without country code
    const phoneNumber = cleanPhone.replace(/^\+852/, '')
    return (
      this.hkMobilePattern.test(phoneNumber) ||
      this.hkLandlinePattern.test(phoneNumber)
    )
  }

  formatHongKongPhone(phone) {
    // Remove all spaces and formatting
    let cleanPhone = phone.replace(/\s/g, '')

    // If already has +852, just reformat
    if (cleanPhone.startsWith('+852')) {
      const number = cleanPhone.substring(4)
      return `+852 ${number.substring(0, 4)} ${number.substring(4)}`
    }

    // Add +852 prefix and format
    if (cleanPhone.length === 8) {
      return `+852 ${cleanPhone.substring(0, 4)} ${cleanPhone.substring(4)}`
    }

    return phone // Return original if can't format
  }

  getPhoneValidationError(phone) {
    return this.getTranslation(
      'contact.form.phone.invalid',
      'Please enter a valid Hong Kong phone number'
    )
  }

  getTranslation(key, fallback = '') {
    const translations = translationManager.getTranslations()
    const keys = key.split('.')
    let value = translations

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return fallback
      }
    }

    return value || fallback
  }

  render() {
    const formHTML = `
      <section class="contact-section">
        <div class="contact-container">
          <div class="contact-header">
            <h2 class="contact-title">${this.getTranslation('contact.title', 'Contact Us')}</h2>
            <p class="contact-subtitle">${this.getTranslation('contact.subtitle', 'Get in touch to discuss your business needs')}</p>
          </div>
          
          <form class="contact-form" novalidate>
            <div class="form-group">
              <label for="name" class="form-label">
                ${this.getTranslation('contact.form.name.label', 'Full Name')}
                <span class="required">*</span>
              </label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                class="form-input"
                placeholder="${this.getTranslation('contact.form.name.placeholder', 'Enter your full name')}"
                required
              >
              <div class="error-message" data-field="name"></div>
            </div>

            <div class="form-group">
              <label for="email" class="form-label">
                ${this.getTranslation('contact.form.email.label', 'Email Address')}
                <span class="required">*</span>
              </label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                class="form-input"
                placeholder="${this.getTranslation('contact.form.email.placeholder', 'Enter your email address')}"
                required
              >
              <div class="error-message" data-field="email"></div>
            </div>

            <div class="form-group">
              <label for="phone" class="form-label">
                ${this.getTranslation('contact.form.phone.label', 'Phone Number (Optional)')}
              </label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                class="form-input"
                placeholder="${this.getTranslation('contact.form.phone.placeholder', 'Enter your Hong Kong phone number')}"
              >
              <div class="error-message" data-field="phone"></div>
            </div>

            <div class="form-group">
              <label for="message" class="form-label">
                ${this.getTranslation('contact.form.message.label', 'Message')}
                <span class="required">*</span>
              </label>
              <textarea 
                id="message" 
                name="message" 
                class="form-textarea"
                placeholder="${this.getTranslation('contact.form.message.placeholder', 'Tell us about your business needs and how we can help')}"
                rows="5"
                required
              ></textarea>
              <div class="error-message" data-field="message"></div>
            </div>

            <button type="submit" class="submit-button">
              ${this.getTranslation('contact.form.submit', 'Send Message')}
            </button>
            
            <div class="success-message" style="display: none;">
              ${this.getTranslation('contact.form.success', "Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.")}
            </div>
            
            <div class="form-error-message" style="display: none;">
              ${this.getTranslation('contact.form.error', 'Sorry, there was an error sending your message. Please try again or contact us directly.')}
            </div>
          </form>
        </div>
      </section>
    `

    this.container.innerHTML = formHTML
    this.setupFormEventListeners()
  }

  setupEventListeners() {
    // Global event listeners if needed
  }

  setupFormEventListeners() {
    const form = this.container.querySelector('.contact-form')
    const phoneField = this.container.querySelector('input[name="phone"]')

    if (form) {
      form.addEventListener('submit', e => this.handleSubmit(e))
    }

    if (phoneField) {
      phoneField.addEventListener('input', e => this.handlePhoneInput(e))
    }

    // Add input event listeners for real-time validation
    const inputs = this.container.querySelectorAll(
      '.form-input, .form-textarea'
    )
    inputs.forEach(input => {
      input.addEventListener('input', e => this.handleFieldInput(e))
    })
  }

  handleSubmit(e) {
    e.preventDefault()

    // Collect form data
    const formData = this.collectFormData()

    // Validate form
    const errors = this.validateForm(formData)

    // Display errors or show success
    if (Object.keys(errors).length > 0) {
      this.displayErrors(errors)
    } else {
      this.clearErrors()
      this.showSuccessMessage()
      // In a real implementation, you would submit the form here
    }
  }

  handlePhoneInput(e) {
    const input = e.target
    const value = input.value

    if (value && value.length >= 8) {
      input.value = this.formatHongKongPhone(value)
    }
  }

  handleFieldInput(e) {
    const field = e.target
    const fieldName = field.name

    // Clear error for this field if it becomes valid
    const formData = this.collectFormData()
    const errors = this.validateForm(formData)

    if (!errors[fieldName]) {
      this.clearFieldError(fieldName)
    }
  }

  collectFormData() {
    const form = this.container.querySelector('.contact-form')
    const formData = new FormData(form)

    return {
      name: formData.get('name') || '',
      email: formData.get('email') || '',
      phone: formData.get('phone') || '',
      message: formData.get('message') || '',
    }
  }

  displayErrors(errors) {
    // Clear previous errors
    this.clearErrors()

    // Display new errors
    Object.keys(errors).forEach(fieldName => {
      const errorElement = this.container.querySelector(
        `.error-message[data-field="${fieldName}"]`
      )
      if (errorElement) {
        errorElement.textContent = errors[fieldName]
        errorElement.style.display = 'block'

        // Add error class to input
        const input = this.container.querySelector(`[name="${fieldName}"]`)
        if (input) {
          input.classList.add('error')
        }
      }
    })
  }

  clearErrors() {
    const errorElements = this.container.querySelectorAll('.error-message')
    errorElements.forEach(element => {
      element.textContent = ''
      element.style.display = 'none'
    })

    // Remove error classes from inputs
    const inputs = this.container.querySelectorAll(
      '.form-input, .form-textarea'
    )
    inputs.forEach(input => {
      input.classList.remove('error')
    })
  }

  clearFieldError(fieldName) {
    const errorElement = this.container.querySelector(
      `.error-message[data-field="${fieldName}"]`
    )
    if (errorElement) {
      errorElement.textContent = ''
      errorElement.style.display = 'none'
    }

    const input = this.container.querySelector(`[name="${fieldName}"]`)
    if (input) {
      input.classList.remove('error')
    }
  }

  showSuccessMessage() {
    const successElement = this.container.querySelector('.success-message')
    if (successElement) {
      successElement.style.display = 'block'

      // Hide form temporarily
      const form = this.container.querySelector('.contact-form')
      if (form) {
        form.style.opacity = '0.5'
        form.style.pointerEvents = 'none'

        // Re-enable form after 3 seconds
        setTimeout(() => {
          form.style.opacity = '1'
          form.style.pointerEvents = 'auto'
          successElement.style.display = 'none'
          form.reset()
        }, 3000)
      }
    }
  }

  updateSubmitButton() {
    const submitButton = this.container.querySelector('.submit-button')
    if (submitButton) {
      if (this.isSubmitting) {
        submitButton.disabled = true
        submitButton.textContent = this.getTranslation(
          'contact.form.submitting',
          'Sending...'
        )
      } else {
        submitButton.disabled = false
        submitButton.textContent = this.getTranslation(
          'contact.form.submit',
          'Send Message'
        )
      }
    }
  }
}
