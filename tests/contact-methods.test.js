import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ContactMethods } from '../src/js/contact-methods-component.js'

// Mock the translation system
let mockCurrentLanguage = 'en'

vi.mock('../src/js/translation-system.js', () => ({
  translationManager: {
    getTranslations: vi.fn().mockReturnValue({
      contact: {
        methods: {
          title: 'Other Ways to Reach Us',
          email: 'Email us at {email}',
          phone: 'Call us at {phone}',
          whatsapp: 'WhatsApp us at {phone}',
          office: 'Visit our office',
          address: 'Central, Hong Kong',
          hours: 'Monday - Friday: 9:00 AM - 6:00 PM',
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
    t: vi.fn().mockImplementation((key, variables = {}) => {
      const translations = {
        'contact.methods.title': 'Other Ways to Reach Us',
        'contact.methods.email': 'Email us at {email}',
        'contact.methods.phone': 'Call us at {phone}',
        'contact.methods.whatsapp': 'WhatsApp us at {phone}',
        'contact.methods.office': 'Visit our office',
        'contact.methods.address': 'Central, Hong Kong',
        'contact.methods.hours': 'Monday - Friday: 9:00 AM - 6:00 PM',
      }

      // Handle different languages
      let translation
      if (mockCurrentLanguage === 'zh-hk') {
        const zhHkTranslations = {
          'contact.methods.title': '其他聯絡方式',
          'contact.methods.email': '電郵聯絡：{email}',
          'contact.methods.phone': '電話聯絡：{phone}',
          'contact.methods.whatsapp': 'WhatsApp聯絡：{phone}',
          'contact.methods.office': '造訪我們的辦公室',
          'contact.methods.address': '香港中環',
          'contact.methods.hours': '星期一至五：上午9:00 - 下午6:00',
        }
        translation = zhHkTranslations[key] || translations[key] || key
      } else if (mockCurrentLanguage === 'zh-cn') {
        const zhCnTranslations = {
          'contact.methods.title': '其他联系方式',
          'contact.methods.email': '邮箱联系：{email}',
          'contact.methods.phone': '电话联系：{phone}',
          'contact.methods.whatsapp': 'WhatsApp联系：{phone}',
          'contact.methods.office': '访问我们的办公室',
          'contact.methods.address': '香港中环',
          'contact.methods.hours': '周一至五：上午9:00 - 下午6:00',
        }
        translation = zhCnTranslations[key] || translations[key] || key
      } else {
        translation = translations[key] || key
      }

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

describe('ContactMethods', () => {
  let contactMethods
  let container

  beforeEach(async () => {
    // Reset mock language
    mockCurrentLanguage = 'en'

    container = document.createElement('div')
    document.body.appendChild(container)
    contactMethods = new ContactMethods(container)
    // Wait for initialization to complete
    await new Promise(resolve => setTimeout(resolve, 0))
  })

  describe('Contact Method Rendering', () => {
    it('should render all contact methods', () => {
      contactMethods.render()

      const methodsSection = container.querySelector('.contact-methods')
      const emailMethod = container.querySelector(
        '.contact-method[data-method="email"]'
      )
      const phoneMethod = container.querySelector(
        '.contact-method[data-method="phone"]'
      )
      const whatsappMethod = container.querySelector(
        '.contact-method[data-method="whatsapp"]'
      )
      const officeMethod = container.querySelector(
        '.contact-method[data-method="office"]'
      )

      expect(methodsSection).toBeTruthy()
      expect(emailMethod).toBeTruthy()
      expect(phoneMethod).toBeTruthy()
      expect(whatsappMethod).toBeTruthy()
      expect(officeMethod).toBeTruthy()
    })

    it('should display contact information in Hong Kong format', () => {
      contactMethods.render()

      const phoneMethod = container.querySelector(
        '.contact-method[data-method="phone"]'
      )
      const phoneText = phoneMethod.textContent

      // Should contain Hong Kong formatted phone number
      expect(phoneText).toContain('+852')
    })

    it('should render contact methods with proper icons', () => {
      contactMethods.render()

      const emailIcon = container.querySelector(
        '.contact-method[data-method="email"] .method-icon'
      )
      const phoneIcon = container.querySelector(
        '.contact-method[data-method="phone"] .method-icon'
      )
      const whatsappIcon = container.querySelector(
        '.contact-method[data-method="whatsapp"] .method-icon'
      )
      const officeIcon = container.querySelector(
        '.contact-method[data-method="office"] .method-icon'
      )

      expect(emailIcon).toBeTruthy()
      expect(phoneIcon).toBeTruthy()
      expect(whatsappIcon).toBeTruthy()
      expect(officeIcon).toBeTruthy()
    })

    it('should render contact methods in different languages', async () => {
      await contactMethods.setLanguage('zh-hk')
      contactMethods.render()

      const title = container.querySelector('.contact-methods-title')
      expect(title.textContent).toBe('其他聯絡方式')

      await contactMethods.setLanguage('zh-cn')
      contactMethods.render()

      const titleCn = container.querySelector('.contact-methods-title')
      expect(titleCn.textContent).toBe('其他联系方式')
    })
  })

  describe('WhatsApp Integration Functionality', () => {
    it('should generate correct WhatsApp URL for Hong Kong numbers', () => {
      const phoneNumber = '+852 9876 5432'
      const message = 'Hello, I would like to inquire about your services'

      const whatsappUrl = contactMethods.generateWhatsAppUrl(
        phoneNumber,
        message
      )

      expect(whatsappUrl).toContain('https://wa.me/85298765432')
      expect(whatsappUrl).toContain(encodeURIComponent(message))
    })

    it('should handle WhatsApp URL generation with default message', () => {
      const phoneNumber = '+852 2876 5432'

      const whatsappUrl = contactMethods.generateWhatsAppUrl(phoneNumber)

      expect(whatsappUrl).toContain('https://wa.me/85228765432')
      expect(whatsappUrl).toContain('Hello')
    })

    it('should create clickable WhatsApp links', () => {
      contactMethods.render()

      const whatsappMethod = container.querySelector(
        '.contact-method[data-method="whatsapp"]'
      )
      const whatsappLink = whatsappMethod.querySelector('a')

      expect(whatsappLink).toBeTruthy()
      expect(whatsappLink.href).toContain('wa.me')
      expect(whatsappLink.target).toBe('_blank')
    })

    it('should generate WhatsApp URLs with multi-language messages', async () => {
      await contactMethods.setLanguage('zh-hk')
      const phoneNumber = '+852 9876 5432'

      const whatsappUrl = contactMethods.generateWhatsAppUrl(phoneNumber)

      // Should contain Chinese greeting
      expect(whatsappUrl).toContain(encodeURIComponent('您好'))

      await contactMethods.setLanguage('zh-cn')
      const whatsappUrlCn = contactMethods.generateWhatsAppUrl(phoneNumber)

      // Should contain Simplified Chinese greeting
      expect(whatsappUrlCn).toContain(encodeURIComponent('您好'))
    })
  })

  describe('Form Submission and Confirmation', () => {
    it('should handle form submission successfully', async () => {
      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message',
      }

      const result = await contactMethods.submitForm(formData)

      expect(result.success).toBe(true)
      expect(result.message).toBeTruthy()
    })

    it('should show confirmation message after successful submission', async () => {
      contactMethods.render()

      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message',
      }

      await contactMethods.handleFormSubmission(formData)

      const confirmationMessage = container.querySelector(
        '.submission-confirmation'
      )
      expect(confirmationMessage).toBeTruthy()
      expect(confirmationMessage.style.display).not.toBe('none')
    })

    it('should handle form submission errors gracefully', async () => {
      // Mock a failed submission
      contactMethods.mockSubmissionError = true

      const formData = {
        name: 'John Doe',
        email: 'invalid-email',
        message: 'Test message',
      }

      const result = await contactMethods.submitForm(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBeTruthy()
    })

    it('should display error message on submission failure', async () => {
      contactMethods.render()
      contactMethods.mockSubmissionError = true

      const formData = {
        name: 'John Doe',
        email: 'invalid-email',
        message: 'Test message',
      }

      await contactMethods.handleFormSubmission(formData)

      const errorMessage = container.querySelector('.submission-error')
      expect(errorMessage).toBeTruthy()
      expect(errorMessage.style.display).not.toBe('none')
    })

    it('should send confirmation emails after successful submission', async () => {
      const emailSpy = vi.spyOn(contactMethods, 'sendConfirmationEmail')

      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message',
      }

      await contactMethods.handleFormSubmission(formData)

      expect(emailSpy).toHaveBeenCalledWith(formData)
    })
  })

  describe('Hong Kong Contact Information Formatting', () => {
    it('should format email addresses correctly', () => {
      const email = 'hello@studioencantador.com'
      const formatted = contactMethods.formatContactInfo('email', email)

      expect(formatted).toBe('hello@studioencantador.com')
    })

    it('should format Hong Kong phone numbers correctly', () => {
      const phone = '98765432'
      const formatted = contactMethods.formatContactInfo('phone', phone)

      expect(formatted).toBe('+852 9876 5432')
    })

    it('should format Hong Kong office address correctly', () => {
      const address = 'Central, Hong Kong'
      const formatted = contactMethods.formatContactInfo('address', address)

      expect(formatted).toBe('Central, Hong Kong')
    })

    it('should format business hours in Hong Kong timezone', () => {
      const hours = 'Monday - Friday: 9:00 AM - 6:00 PM'
      const formatted = contactMethods.formatContactInfo('hours', hours)

      expect(formatted).toContain('9:00 AM')
      expect(formatted).toContain('6:00 PM')
    })
  })

  describe('Contact Method Interactions', () => {
    it('should handle email method clicks', () => {
      contactMethods.render()

      const emailMethod = container.querySelector(
        '.contact-method[data-method="email"]'
      )
      const clickEvent = new Event('click')

      emailMethod.dispatchEvent(clickEvent)

      // Should trigger email client or copy to clipboard
      expect(emailMethod.classList.contains('clicked')).toBe(true)
    })

    it('should handle phone method clicks', () => {
      contactMethods.render()

      const phoneMethod = container.querySelector(
        '.contact-method[data-method="phone"]'
      )
      const clickEvent = new Event('click')

      phoneMethod.dispatchEvent(clickEvent)

      // Should trigger phone dialer on mobile or copy to clipboard
      expect(phoneMethod.classList.contains('clicked')).toBe(true)
    })

    it('should copy contact information to clipboard on click', async () => {
      // Mock clipboard API
      Object.assign(navigator, {
        clipboard: {
          writeText: vi.fn().mockResolvedValue(undefined),
        },
      })

      contactMethods.render()

      const emailMethod = container.querySelector(
        '.contact-method[data-method="email"]'
      )
      const clickEvent = new Event('click')

      emailMethod.dispatchEvent(clickEvent)

      // Wait for async clipboard operation
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(navigator.clipboard.writeText).toHaveBeenCalled()
    })

    it('should show copy confirmation message', async () => {
      // Mock clipboard API
      Object.assign(navigator, {
        clipboard: {
          writeText: vi.fn().mockResolvedValue(undefined),
        },
      })

      contactMethods.render()

      const emailMethod = container.querySelector(
        '.contact-method[data-method="email"]'
      )
      const clickEvent = new Event('click')

      emailMethod.dispatchEvent(clickEvent)

      // Wait for async operation
      await new Promise(resolve => setTimeout(resolve, 100))

      const copyMessage = container.querySelector('.copy-confirmation')
      expect(copyMessage).toBeTruthy()
    })
  })

  describe('Responsive Design and Accessibility', () => {
    it('should render contact methods in responsive grid', () => {
      contactMethods.render()

      const methodsGrid = container.querySelector('.contact-methods-grid')
      const computedStyle = getComputedStyle(methodsGrid)

      expect(computedStyle.display).toBe('grid')
    })

    it('should have proper ARIA labels for accessibility', () => {
      contactMethods.render()

      const emailMethod = container.querySelector(
        '.contact-method[data-method="email"]'
      )
      const phoneMethod = container.querySelector(
        '.contact-method[data-method="phone"]'
      )

      expect(emailMethod.getAttribute('aria-label')).toBeTruthy()
      expect(phoneMethod.getAttribute('aria-label')).toBeTruthy()
    })

    it('should support keyboard navigation', () => {
      contactMethods.render()

      const contactMethodElements =
        container.querySelectorAll('.contact-method')

      contactMethodElements.forEach(method => {
        expect(method.tabIndex).toBe(0)
        expect(method.getAttribute('role')).toBe('button')
      })
    })

    it('should handle keyboard interactions', () => {
      contactMethods.render()

      const emailMethod = container.querySelector(
        '.contact-method[data-method="email"]'
      )
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' })
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ' })

      emailMethod.dispatchEvent(enterEvent)
      expect(emailMethod.classList.contains('clicked')).toBe(true)

      emailMethod.classList.remove('clicked')

      emailMethod.dispatchEvent(spaceEvent)
      expect(emailMethod.classList.contains('clicked')).toBe(true)
    })
  })
})
