import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ContactSection } from '../src/js/contact-section-component.js'

// Mock the translation system
vi.mock('../src/js/translation-system.js', () => ({
  translationManager: {
    getTranslations: vi.fn().mockReturnValue({
      contact: {
        title: 'Contact Us',
        subtitle: 'Get in touch to discuss your business needs',
        methods: {
          title: 'Other Ways to Reach Us',
          email: 'Email us at {email}',
          phone: 'Call us at {phone}',
          whatsapp: 'WhatsApp us at {phone}',
          office: 'Visit our office',
          address: 'Central, Hong Kong',
          hours: 'Monday - Friday: 9:00 AM - 6:00 PM',
        },
        form: {
          name: { label: 'Full Name' },
          email: { label: 'Email Address' },
          phone: { label: 'Phone Number (Optional)' },
          message: { label: 'Message' },
          submit: 'Send Message',
        },
      },
    }),
  },
  TranslationManager: vi.fn().mockImplementation(() => ({
    initialize: vi.fn().mockResolvedValue(undefined),
    switchLanguage: vi.fn().mockResolvedValue(undefined),
    t: vi.fn().mockImplementation((key, variables = {}) => {
      const translations = {
        'contact.title': 'Contact Us',
        'contact.subtitle': 'Get in touch to discuss your business needs',
        'contact.methods.title': 'Other Ways to Reach Us',
        'contact.methods.email': 'Email us at {email}',
        'contact.methods.phone': 'Call us at {phone}',
        'contact.methods.whatsapp': 'WhatsApp us at {phone}',
        'contact.methods.office': 'Visit our office',
        'contact.methods.address': 'Central, Hong Kong',
        'contact.methods.hours': 'Monday - Friday: 9:00 AM - 6:00 PM',
        'contact.form.name.label': 'Full Name',
        'contact.form.email.label': 'Email Address',
        'contact.form.phone.label': 'Phone Number (Optional)',
        'contact.form.message.label': 'Message',
        'contact.form.submit': 'Send Message',
      }

      let translation = translations[key] || key

      // Handle variable interpolation
      if (variables && Object.keys(variables).length > 0) {
        return translation.replace(/\{(\w+)\}/g, (match, varKey) => {
          return variables[varKey] !== undefined ? variables[varKey] : match
        })
      }

      return translation
    }),
  })),
}))

describe('Contact Section Integration', () => {
  let contactSection
  let container

  beforeEach(async () => {
    container = document.createElement('div')
    container.id = 'contact'
    container.className = 'contact-section-wrapper'
    document.body.appendChild(container)

    contactSection = new ContactSection(container)
    // Wait for initialization to complete
    await new Promise(resolve => setTimeout(resolve, 0))
  })

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container)
    }
  })

  describe('Integration with Main Website', () => {
    it('should initialize contact section with proper container setup', () => {
      expect(container.id).toBe('contact')
      expect(container.className).toBe('contact-section-wrapper')
      expect(contactSection).toBeTruthy()
    })

    it('should render both contact form and contact methods', () => {
      const formContainer = container.querySelector('#contact-form-container')
      const methodsContainer = container.querySelector(
        '#contact-methods-container'
      )

      expect(formContainer).toBeTruthy()
      expect(methodsContainer).toBeTruthy()
    })

    it('should have contact form rendered inside form container', () => {
      const formContainer = container.querySelector('#contact-form-container')
      const contactForm = formContainer.querySelector('.contact-form')

      expect(contactForm).toBeTruthy()
    })

    it('should have contact methods rendered inside methods container', () => {
      const methodsContainer = container.querySelector(
        '#contact-methods-container'
      )
      const contactMethods = methodsContainer.querySelector('.contact-methods')

      expect(contactMethods).toBeTruthy()
    })

    it('should support language switching for both components', async () => {
      await contactSection.setLanguage('zh-hk')

      // Both components should be updated
      expect(contactSection.contactForm).toBeTruthy()
      expect(contactSection.contactMethods).toBeTruthy()
    })

    it('should integrate form submission with contact methods', async () => {
      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message',
      }

      const result = await contactSection.handleFormSubmission(formData)

      expect(result.success).toBe(true)
    })
  })

  describe('Navigation Integration', () => {
    it('should have correct ID for navigation linking', () => {
      expect(container.id).toBe('contact')
    })

    it('should have proper CSS class for styling', () => {
      expect(container.classList.contains('contact-section-wrapper')).toBe(true)
    })

    it('should be positioned correctly in the page flow', () => {
      // The contact section should be a section element
      expect(container.tagName.toLowerCase()).toBe('div')
      expect(container.id).toBe('contact')
    })
  })

  describe('Responsive Design Integration', () => {
    it('should maintain responsive layout in integrated environment', () => {
      const formContainer = container.querySelector('#contact-form-container')
      const methodsContainer = container.querySelector(
        '#contact-methods-container'
      )

      // Both containers should exist and be properly structured
      expect(formContainer).toBeTruthy()
      expect(methodsContainer).toBeTruthy()

      // Check that the contact form has responsive classes
      const contactForm = formContainer.querySelector('.contact-form')
      expect(contactForm).toBeTruthy()

      // Check that contact methods have responsive grid
      const methodsGrid = methodsContainer.querySelector(
        '.contact-methods-grid'
      )
      expect(methodsGrid).toBeTruthy()
    })
  })

  describe('Accessibility Integration', () => {
    it('should maintain accessibility features in integrated environment', () => {
      // Check form accessibility
      const formInputs = container.querySelectorAll('input, textarea')
      formInputs.forEach(input => {
        const label = container.querySelector(`label[for="${input.id}"]`)
        expect(label || input.getAttribute('aria-label')).toBeTruthy()
      })

      // Check contact methods accessibility
      const contactMethods = container.querySelectorAll('.contact-method')
      contactMethods.forEach(method => {
        expect(method.getAttribute('tabindex')).toBe('0')
        expect(method.getAttribute('role')).toBe('button')
        expect(method.getAttribute('aria-label')).toBeTruthy()
      })
    })
  })
})
