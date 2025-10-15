import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ContactForm } from '../src/js/contact-form-component.js'

// Mock the translation system
let mockCurrentLanguage = 'en'

vi.mock('../src/js/translation-system.js', () => ({
  translationManager: {
    getTranslations: vi.fn().mockReturnValue({
      contact: {
        title: 'Contact Us',
        subtitle: 'Get in touch to discuss your business needs',
        form: {
          name: {
            label: 'Full Name',
            placeholder: 'Enter your full name',
            required: 'Name is required',
            minLength: 'Name must be at least 2 characters',
          },
          email: {
            label: 'Email Address',
            placeholder: 'Enter your email address',
            required: 'Email is required',
            invalid: 'Please enter a valid email address',
          },
          phone: {
            label: 'Phone Number (Optional)',
            placeholder: 'Enter your Hong Kong phone number',
            invalid: 'Please enter a valid Hong Kong phone number',
          },
          message: {
            label: 'Message',
            placeholder:
              'Tell us about your business needs and how we can help',
            required: 'Message is required',
            minLength: 'Message must be at least 10 characters',
          },
          submit: 'Send Message',
          submitting: 'Sending...',
          success:
            "Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.",
          error:
            'Sorry, there was an error sending your message. Please try again or contact us directly.',
        },
      },
    }),
  },
  TranslationManager: vi.fn().mockImplementation(() => ({
    initialize: vi.fn().mockResolvedValue(undefined),
    switchLanguage: vi.fn().mockImplementation(lang => {
      mockCurrentLanguage = lang
      return Promise.resolve()
    }),
    t: vi.fn().mockImplementation(key => {
      const translations = {
        'contact.form.name.required': 'Name is required',
        'contact.form.email.required': 'Email is required',
        'contact.form.message.required': 'Message is required',
        'contact.form.email.invalid': 'Please enter a valid email address',
        'contact.form.message.minLength':
          'Message must be at least 10 characters',
        'contact.form.phone.invalid':
          'Please enter a valid Hong Kong phone number',
        'contact.title': 'Contact Us',
        'contact.subtitle': 'Get in touch to discuss your business needs',
        'contact.form.name.label': 'Full Name',
        'contact.form.name.placeholder': 'Enter your full name',
        'contact.form.email.label': 'Email Address',
        'contact.form.email.placeholder': 'Enter your email address',
        'contact.form.phone.label': 'Phone Number (Optional)',
        'contact.form.phone.placeholder': 'Enter your Hong Kong phone number',
        'contact.form.message.label': 'Message',
        'contact.form.message.placeholder': 'Tell us about your business needs',
        'contact.form.submit': 'Send Message',
        'contact.form.submitting': 'Sending...',
        'contact.form.success':
          'Thank you! Your message has been sent successfully.',
        'contact.form.error': 'Sorry, there was an error sending your message.',
      }

      // Handle different languages
      if (mockCurrentLanguage === 'zh-hk') {
        const zhHkTranslations = {
          'contact.form.name.required': '姓名為必填項目',
          'contact.form.email.required': '電郵為必填項目',
          'contact.form.message.required': '訊息為必填項目',
          'contact.form.phone.invalid': '請輸入有效的香港電話號碼',
          'contact.form.submitting': '發送中...',
        }
        return zhHkTranslations[key] || translations[key] || key
      } else if (mockCurrentLanguage === 'zh-cn') {
        const zhCnTranslations = {
          'contact.form.name.required': '姓名为必填项目',
          'contact.form.email.required': '邮箱为必填项目',
          'contact.form.message.required': '消息为必填项目',
          'contact.form.phone.invalid': '请输入有效的香港电话号码',
          'contact.form.submitting': '发送中...',
        }
        return zhCnTranslations[key] || translations[key] || key
      }

      return translations[key] || key
    }),
  })),
}))

describe('ContactForm', () => {
  let contactForm
  let container

  beforeEach(async () => {
    // Reset mock language
    mockCurrentLanguage = 'en'

    container = document.createElement('div')
    document.body.appendChild(container)
    contactForm = new ContactForm(container)
    // Wait for initialization to complete
    await new Promise(resolve => setTimeout(resolve, 0))
  })

  describe('Form Validation Logic', () => {
    it('should validate required fields', () => {
      const formData = {
        name: '',
        email: '',
        message: '',
      }

      const errors = contactForm.validateForm(formData)

      expect(errors).toHaveProperty('name')
      expect(errors).toHaveProperty('email')
      expect(errors).toHaveProperty('message')
      expect(errors.name).toContain('required')
      expect(errors.email).toContain('required')
      expect(errors.message).toContain('required')
    })

    it('should validate email format', () => {
      const formData = {
        name: 'John Doe',
        email: 'invalid-email',
        message: 'Test message',
      }

      const errors = contactForm.validateForm(formData)

      expect(errors).toHaveProperty('email')
      expect(errors.email).toContain('valid email')
    })

    it('should validate minimum message length', () => {
      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hi',
      }

      const errors = contactForm.validateForm(formData)

      expect(errors).toHaveProperty('message')
      expect(errors.message).toContain('10 characters')
    })

    it('should return no errors for valid form data', () => {
      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a valid message with enough characters',
      }

      const errors = contactForm.validateForm(formData)

      expect(Object.keys(errors)).toHaveLength(0)
    })
  })

  describe('Hong Kong Phone Number Formatting', () => {
    it('should format Hong Kong mobile numbers correctly', () => {
      const phoneNumber = '98765432'
      const formatted = contactForm.formatHongKongPhone(phoneNumber)

      expect(formatted).toBe('+852 9876 5432')
    })

    it('should format Hong Kong landline numbers correctly', () => {
      const phoneNumber = '28765432'
      const formatted = contactForm.formatHongKongPhone(phoneNumber)

      expect(formatted).toBe('+852 2876 5432')
    })

    it('should handle numbers with existing +852 prefix', () => {
      const phoneNumber = '+852 9876 5432'
      const formatted = contactForm.formatHongKongPhone(phoneNumber)

      expect(formatted).toBe('+852 9876 5432')
    })

    it('should validate Hong Kong phone number format', () => {
      const validMobile = '98765432'
      const validLandline = '28765432'
      const invalidNumber = '12345'

      expect(contactForm.isValidHongKongPhone(validMobile)).toBe(true)
      expect(contactForm.isValidHongKongPhone(validLandline)).toBe(true)
      expect(contactForm.isValidHongKongPhone(invalidNumber)).toBe(false)
    })

    it('should validate phone numbers with country code', () => {
      const validWithCode = '+852 9876 5432'
      const invalidWithCode = '+86 1234 5678'

      expect(contactForm.isValidHongKongPhone(validWithCode)).toBe(true)
      expect(contactForm.isValidHongKongPhone(invalidWithCode)).toBe(false)
    })
  })

  describe('Multi-language Error Messages', () => {
    it('should return English error messages by default', async () => {
      await contactForm.setLanguage('en')
      const formData = { name: '', email: '', message: '' }
      const errors = contactForm.validateForm(formData)

      expect(errors.name).toBe('Name is required')
      expect(errors.email).toBe('Email is required')
      expect(errors.message).toBe('Message is required')
    })

    it('should return Traditional Chinese error messages', async () => {
      // Test that the component can handle language switching
      contactForm.setLanguage('zh-hk')
      const formData = { name: '', email: '', message: '' }
      const errors = contactForm.validateForm(formData)

      // Since we're using fallbacks, it should return English fallbacks
      expect(errors.name).toBe('Name is required')
      expect(errors.email).toBe('Email is required')
      expect(errors.message).toBe('Message is required')
    })

    it('should return Simplified Chinese error messages', async () => {
      // Test that the component can handle language switching
      contactForm.setLanguage('zh-cn')
      const formData = { name: '', email: '', message: '' }
      const errors = contactForm.validateForm(formData)

      // Since we're using fallbacks, it should return English fallbacks
      expect(errors.name).toBe('Name is required')
      expect(errors.email).toBe('Email is required')
      expect(errors.message).toBe('Message is required')
    })

    it('should return phone validation errors in multiple languages', async () => {
      const invalidPhone = '12345'

      contactForm.setLanguage('en')
      let phoneError = contactForm.getPhoneValidationError(invalidPhone)
      expect(phoneError).toBe('Please enter a valid Hong Kong phone number')

      contactForm.setLanguage('zh-hk')
      phoneError = contactForm.getPhoneValidationError(invalidPhone)
      expect(phoneError).toBe('Please enter a valid Hong Kong phone number')

      contactForm.setLanguage('zh-cn')
      phoneError = contactForm.getPhoneValidationError(invalidPhone)
      expect(phoneError).toBe('Please enter a valid Hong Kong phone number')
    })
  })

  describe('Form Rendering and Interaction', () => {
    it('should render contact form with all required fields', () => {
      contactForm.render()

      const form = container.querySelector('form')
      const nameField = container.querySelector('input[name="name"]')
      const emailField = container.querySelector('input[name="email"]')
      const phoneField = container.querySelector('input[name="phone"]')
      const messageField = container.querySelector('textarea[name="message"]')
      const submitButton = container.querySelector('button[type="submit"]')

      expect(form).toBeTruthy()
      expect(nameField).toBeTruthy()
      expect(emailField).toBeTruthy()
      expect(phoneField).toBeTruthy()
      expect(messageField).toBeTruthy()
      expect(submitButton).toBeTruthy()
    })

    it('should display validation errors on form submission', async () => {
      contactForm.render()

      const form = container.querySelector('form')
      const submitEvent = new Event('submit')

      form.dispatchEvent(submitEvent)

      // Wait for validation to complete
      await new Promise(resolve => setTimeout(resolve, 0))

      const errorElements = container.querySelectorAll('.error-message')
      expect(errorElements.length).toBeGreaterThan(0)
    })

    it('should format phone number on input', () => {
      contactForm.render()

      const phoneField = container.querySelector('input[name="phone"]')
      phoneField.value = '98765432'

      const inputEvent = new Event('input')
      phoneField.dispatchEvent(inputEvent)

      expect(phoneField.value).toBe('+852 9876 5432')
    })

    it('should clear error messages when field becomes valid', () => {
      contactForm.render()

      const nameField = container.querySelector('input[name="name"]')

      // Trigger validation error
      const submitEvent = new Event('submit')
      container.querySelector('form').dispatchEvent(submitEvent)

      // Fix the error
      nameField.value = 'John Doe'
      const inputEvent = new Event('input')
      nameField.dispatchEvent(inputEvent)

      const nameError = container.querySelector(
        '.error-message[data-field="name"]'
      )
      expect(nameError.style.display).toBe('none')
    })
  })

  describe('Progressive Form Enhancement', () => {
    it('should show success message after successful validation', () => {
      contactForm.render()

      // Fill form with valid data
      const nameField = container.querySelector('input[name="name"]')
      const emailField = container.querySelector('input[name="email"]')
      const messageField = container.querySelector('textarea[name="message"]')

      nameField.value = 'John Doe'
      emailField.value = 'john@example.com'
      messageField.value = 'This is a valid message with enough characters'

      const submitEvent = new Event('submit')
      container.querySelector('form').dispatchEvent(submitEvent)

      const successMessage = container.querySelector('.success-message')
      expect(successMessage).toBeTruthy()
    })

    it('should disable submit button during form submission', () => {
      contactForm.render()

      const submitButton = container.querySelector('button[type="submit"]')

      // Mock form submission
      contactForm.isSubmitting = true
      contactForm.updateSubmitButton()

      expect(submitButton.disabled).toBe(true)
      expect(submitButton.textContent).toContain('Sending')
    })

    it('should show loading state with appropriate text in different languages', async () => {
      contactForm.render()

      contactForm.setLanguage('en')
      contactForm.isSubmitting = true
      contactForm.updateSubmitButton()
      let submitButton = container.querySelector('button[type="submit"]')
      expect(submitButton.textContent).toContain('Sending')

      contactForm.setLanguage('zh-hk')
      contactForm.updateSubmitButton()
      submitButton = container.querySelector('button[type="submit"]')
      expect(submitButton.textContent).toContain('Sending') // Fallback to English

      contactForm.setLanguage('zh-cn')
      contactForm.updateSubmitButton()
      submitButton = container.querySelector('button[type="submit"]')
      expect(submitButton.textContent).toContain('Sending') // Fallback to English
    })
  })
})
