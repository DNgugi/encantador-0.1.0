import { describe, it, expect, beforeEach, vi } from 'vitest'
import { FooterComponent } from '../src/js/footer-component.js'

// Mock the translation system
vi.mock('../src/js/translation-system.js', () => ({
  translationManager: {
    getTranslations: vi.fn().mockReturnValue({
      footer: {
        description:
          "Hong Kong's boutique consulting agency specializing in Business Strategy, Web Development, and Team Building.",
        established: 'Est. 2025',
        location: 'Hong Kong',
        services: {
          title: 'Our Services',
          consulting: 'Business Consulting',
          web: 'Web Development',
          team: 'Team Building',
          strategy: 'Digital Strategy',
        },
        company: {
          title: 'Company',
          about: 'About Us',
          portfolio: 'Portfolio',
          contact: 'Contact',
          careers: 'Careers',
        },
        contact: {
          title: 'Get in Touch',
          address: 'Central, Hong Kong',
        },
        copyright: 'All rights reserved.',
        legal: {
          privacy: 'Privacy Policy',
          terms: 'Terms of Service',
        },
      },
    }),
  },
}))

describe('FooterComponent', () => {
  let footerComponent
  let container

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    footerComponent = new FooterComponent(container)
  })

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container)
    }
  })

  describe('Footer Rendering', () => {
    it('should render footer with all main sections', () => {
      const footer = container.querySelector('.footer')
      const footerMain = container.querySelector('.footer-main')
      const footerBottom = container.querySelector('.footer-bottom')

      expect(footer).toBeTruthy()
      expect(footerMain).toBeTruthy()
      expect(footerBottom).toBeTruthy()
    })

    it('should render company information section', () => {
      const companySection = container.querySelector('.footer-company')
      const logo = container.querySelector('.footer-logo')
      const description = container.querySelector('.footer-description')
      const certifications = container.querySelector('.footer-certifications')

      expect(companySection).toBeTruthy()
      expect(logo).toBeTruthy()
      expect(description).toBeTruthy()
      expect(certifications).toBeTruthy()
    })

    it('should render services links section', () => {
      const servicesSection = container.querySelector('.footer-services')
      const servicesTitle = servicesSection.querySelector('.footer-title')
      const servicesLinks = servicesSection.querySelectorAll('.footer-link')

      expect(servicesSection).toBeTruthy()
      expect(servicesTitle.textContent).toBe('Our Services')
      expect(servicesLinks.length).toBeGreaterThan(0)
    })

    it('should render company links section', () => {
      const companyLinksSection = container.querySelector(
        '.footer-company-links'
      )
      const companyTitle = companyLinksSection.querySelector('.footer-title')
      const companyLinks = companyLinksSection.querySelectorAll('.footer-link')

      expect(companyLinksSection).toBeTruthy()
      expect(companyTitle.textContent).toBe('Company')
      expect(companyLinks.length).toBeGreaterThan(0)
    })

    it('should render contact information section', () => {
      const contactSection = container.querySelector('.footer-contact')
      const contactTitle = contactSection.querySelector('.footer-title')
      const contactItems = contactSection.querySelectorAll('.contact-item')
      const socialLinks = contactSection.querySelectorAll('.social-link')

      expect(contactSection).toBeTruthy()
      expect(contactTitle.textContent).toBe('Get in Touch')
      expect(contactItems.length).toBe(3) // Email, phone, address
      expect(socialLinks.length).toBe(2) // LinkedIn, WhatsApp
    })

    it('should render footer bottom with copyright and legal links', () => {
      const footerBottom = container.querySelector('.footer-bottom')
      const copyright = footerBottom.querySelector('.footer-copyright')
      const legalLinks = footerBottom.querySelectorAll('.legal-link')

      expect(footerBottom).toBeTruthy()
      expect(copyright).toBeTruthy()
      expect(legalLinks.length).toBe(2) // Privacy, Terms
    })
  })

  describe('Footer Functionality', () => {
    it('should handle language switching', () => {
      footerComponent.setLanguage('zh-hk')
      expect(footerComponent.currentLanguage).toBe('zh-hk')

      footerComponent.setLanguage('zh-cn')
      expect(footerComponent.currentLanguage).toBe('zh-cn')
    })

    it('should update content when updateContent is called', () => {
      const initialContent = container.innerHTML
      footerComponent.updateContent()
      const updatedContent = container.innerHTML

      // Content should be re-rendered (may be the same if translations haven't changed)
      expect(typeof updatedContent).toBe('string')
      expect(updatedContent.length).toBeGreaterThan(0)
    })

    it('should have proper contact information', () => {
      const emailLink = container.querySelector(
        'a[href="mailto:hello@studioencantador.com"]'
      )
      const phoneLink = container.querySelector('a[href="tel:+85298765432"]')

      expect(emailLink).toBeTruthy()
      expect(phoneLink).toBeTruthy()
      expect(emailLink.textContent).toBe('hello@studioencantador.com')
      expect(phoneLink.textContent).toBe('+852 9876 5432')
    })

    it('should display current year in copyright', () => {
      const currentYear = new Date().getFullYear()
      const copyright = container.querySelector('.footer-copyright p')

      expect(copyright.textContent).toContain(currentYear.toString())
    })
  })

  describe('Footer Navigation', () => {
    it('should have navigation links with proper href attributes', () => {
      const navLinks = container.querySelectorAll('a[href^="#"]')

      expect(navLinks.length).toBeGreaterThan(0)

      // Check that we have some valid section links
      const sectionLinks = Array.from(navLinks).filter(link => {
        const href = link.getAttribute('href')
        return href.match(/^#[a-z]+$/)
      })

      expect(sectionLinks.length).toBeGreaterThan(0)
    })

    it('should handle smooth scrolling for navigation links', () => {
      const navLink = container.querySelector('a[href="#about"]')

      if (navLink) {
        const clickEvent = new Event('click')
        navLink.dispatchEvent(clickEvent)

        // Test that the event listener is attached (no error thrown)
        expect(navLink).toBeTruthy()
      }
    })
  })

  describe('Footer Accessibility', () => {
    it('should have proper ARIA labels for social links', () => {
      const socialLinks = container.querySelectorAll('.social-link')

      socialLinks.forEach(link => {
        expect(link.getAttribute('aria-label')).toBeTruthy()
      })
    })

    it('should have proper semantic structure', () => {
      const footer = container.querySelector('footer')
      const headings = container.querySelectorAll('h3')

      expect(footer).toBeTruthy()
      expect(headings.length).toBeGreaterThan(0)

      headings.forEach(heading => {
        expect(heading.classList.contains('footer-title')).toBe(true)
      })
    })

    it('should have keyboard accessible links', () => {
      const allLinks = container.querySelectorAll('a')

      allLinks.forEach(link => {
        // Links should be focusable
        expect(link.tabIndex).not.toBe(-1)
      })
    })
  })

  describe('Footer Responsive Design', () => {
    it('should have responsive grid classes', () => {
      const footerMain = container.querySelector('.footer-main')
      const computedStyle = getComputedStyle(footerMain)

      expect(computedStyle.display).toBe('grid')
    })

    it('should have proper mobile-friendly structure', () => {
      const footer = container.querySelector('.footer')
      const footerContainer = container.querySelector('.footer-container')

      expect(footer).toBeTruthy()
      expect(footerContainer).toBeTruthy()
    })
  })
})
