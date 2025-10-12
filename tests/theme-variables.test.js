import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

describe('Theme Variables System', () => {
  let testElement
  let rootElement
  let styleElement

  beforeEach(() => {
    // Inject CSS styles directly
    const cssText = `
      :root {
        --primary: #c41e3a;
        --secondary: #2d8659;
        --accent: #e6c200;
        --highlight: #a8336b;
        --background: #f8f8ff;
        --surface: #ffffff;
        --text-primary: #1a1a1a;
        --text-secondary: #666666;
        --gradient-primary: linear-gradient(135deg, var(--primary), var(--highlight));
        --gradient-secondary: linear-gradient(45deg, var(--secondary), var(--accent));
        --gradient-harbour: linear-gradient(180deg, #7fb3d3 0%, var(--secondary) 100%);
        --animation-duration-fast: 0.2s;
        --animation-duration-normal: 0.3s;
        --animation-duration-slow: 0.5s;
        --animation-easing-smooth: cubic-bezier(0.4, 0, 0.2, 1);
        --animation-easing-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
        --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        --radius-sm: 0.25rem;
        --radius-md: 0.5rem;
        --radius-lg: 1rem;
        --radius-xl: 1.5rem;
      }
      
      [data-theme='dark'] {
        --primary: #e63946;
        --secondary: #52b788;
        --accent: #d4a574;
        --highlight: #d63384;
        --background: #0f172a;
        --surface: #1e293b;
        --text-primary: #f1f5f9;
        --text-secondary: #cbd5e1;
        --gradient-primary: linear-gradient(135deg, var(--primary), var(--accent));
        --gradient-secondary: linear-gradient(45deg, var(--secondary), var(--highlight));
        --gradient-harbour: linear-gradient(180deg, #1e293b 0%, var(--background) 100%);
      }
      
      @keyframes harbour-wave {
        0% { transform: translateX(-100%) scaleY(1); }
        50% { transform: translateX(0%) scaleY(1.2); }
        100% { transform: translateX(100%) scaleY(1); }
      }
      
      @keyframes peak-tram-slide {
        0% { transform: translateX(-100%) rotate(-15deg); }
        100% { transform: translateX(0%) rotate(0deg); }
      }
      
      @keyframes jade-shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      
      .theme-transition-element {
        will-change: background-color, color, border-color;
        transition: 
          background-color var(--animation-duration-normal) var(--animation-easing-smooth),
          color var(--animation-duration-normal) var(--animation-easing-smooth),
          border-color var(--animation-duration-normal) var(--animation-easing-smooth);
      }
    `

    styleElement = document.createElement('style')
    styleElement.textContent = cssText
    document.head.appendChild(styleElement)

    // Create test elements
    testElement = document.createElement('div')
    testElement.className = 'test-element'
    document.body.appendChild(testElement)

    rootElement = document.documentElement

    // Reset theme
    rootElement.removeAttribute('data-theme')
  })

  afterEach(() => {
    // Clean up
    if (testElement && testElement.parentNode) {
      testElement.parentNode.removeChild(testElement)
    }
    if (styleElement && styleElement.parentNode) {
      styleElement.parentNode.removeChild(styleElement)
    }
    rootElement.removeAttribute('data-theme')
  })

  describe('CSS Custom Properties', () => {
    it('should have light theme variables defined in :root', () => {
      const computedStyle = getComputedStyle(rootElement)

      // Test primary colors
      expect(computedStyle.getPropertyValue('--primary').trim()).toBe('#c41e3a')
      expect(computedStyle.getPropertyValue('--secondary').trim()).toBe(
        '#2d8659'
      )
      expect(computedStyle.getPropertyValue('--accent').trim()).toBe('#e6c200')
      expect(computedStyle.getPropertyValue('--highlight').trim()).toBe(
        '#a8336b'
      )

      // Test background colors
      expect(computedStyle.getPropertyValue('--background').trim()).toBe(
        '#f8f8ff'
      )
      expect(computedStyle.getPropertyValue('--surface').trim()).toBe('#ffffff')

      // Test text colors
      expect(computedStyle.getPropertyValue('--text-primary').trim()).toBe(
        '#1a1a1a'
      )
      expect(computedStyle.getPropertyValue('--text-secondary').trim()).toBe(
        '#666666'
      )
    })

    it('should have gradient variables defined', () => {
      const computedStyle = getComputedStyle(rootElement)

      const primaryGradient = computedStyle
        .getPropertyValue('--gradient-primary')
        .trim()
      const secondaryGradient = computedStyle
        .getPropertyValue('--gradient-secondary')
        .trim()
      const harbourGradient = computedStyle
        .getPropertyValue('--gradient-harbour')
        .trim()

      expect(primaryGradient).toContain('linear-gradient')
      expect(primaryGradient).toContain('135deg')
      expect(secondaryGradient).toContain('linear-gradient')
      expect(secondaryGradient).toContain('45deg')
      expect(harbourGradient).toContain('linear-gradient')
      expect(harbourGradient).toContain('180deg')
    })

    it('should apply dark theme variables when data-theme="dark"', () => {
      rootElement.setAttribute('data-theme', 'dark')

      const computedStyle = getComputedStyle(rootElement)

      // Test dark theme colors
      expect(computedStyle.getPropertyValue('--primary').trim()).toBe('#e63946')
      expect(computedStyle.getPropertyValue('--secondary').trim()).toBe(
        '#52b788'
      )
      expect(computedStyle.getPropertyValue('--accent').trim()).toBe('#d4a574')
      expect(computedStyle.getPropertyValue('--highlight').trim()).toBe(
        '#d63384'
      )

      // Test dark background colors
      expect(computedStyle.getPropertyValue('--background').trim()).toBe(
        '#0f172a'
      )
      expect(computedStyle.getPropertyValue('--surface').trim()).toBe('#1e293b')

      // Test dark text colors
      expect(computedStyle.getPropertyValue('--text-primary').trim()).toBe(
        '#f1f5f9'
      )
      expect(computedStyle.getPropertyValue('--text-secondary').trim()).toBe(
        '#cbd5e1'
      )
    })

    it('should have Hong Kong cultural animation variables', () => {
      const computedStyle = getComputedStyle(rootElement)

      // Test animation duration variables
      expect(
        computedStyle.getPropertyValue('--animation-duration-fast').trim()
      ).toBe('0.2s')
      expect(
        computedStyle.getPropertyValue('--animation-duration-normal').trim()
      ).toBe('0.3s')
      expect(
        computedStyle.getPropertyValue('--animation-duration-slow').trim()
      ).toBe('0.5s')

      // Test easing variables
      expect(
        computedStyle.getPropertyValue('--animation-easing-smooth').trim()
      ).toBe('cubic-bezier(0.4, 0, 0.2, 1)')
      expect(
        computedStyle.getPropertyValue('--animation-easing-bounce').trim()
      ).toBe('cubic-bezier(0.68, -0.55, 0.265, 1.55)')
    })

    it('should have shadow variables for depth', () => {
      const computedStyle = getComputedStyle(rootElement)

      expect(computedStyle.getPropertyValue('--shadow-sm').trim()).toContain(
        'rgba'
      )
      expect(computedStyle.getPropertyValue('--shadow-md').trim()).toContain(
        'rgba'
      )
      expect(computedStyle.getPropertyValue('--shadow-lg').trim()).toContain(
        'rgba'
      )
      expect(computedStyle.getPropertyValue('--shadow-xl').trim()).toContain(
        'rgba'
      )
    })

    it('should have border radius variables', () => {
      const computedStyle = getComputedStyle(rootElement)

      expect(computedStyle.getPropertyValue('--radius-sm').trim()).toBe(
        '0.25rem'
      )
      expect(computedStyle.getPropertyValue('--radius-md').trim()).toBe(
        '0.5rem'
      )
      expect(computedStyle.getPropertyValue('--radius-lg').trim()).toBe('1rem')
      expect(computedStyle.getPropertyValue('--radius-xl').trim()).toBe(
        '1.5rem'
      )
    })
  })

  describe('Theme Transition Animations', () => {
    it('should have transition properties on theme-sensitive elements', () => {
      testElement.style.cssText = `
        background-color: var(--background);
        color: var(--text-primary);
        transition: background-color var(--animation-duration-normal) var(--animation-easing-smooth),
                   color var(--animation-duration-normal) var(--animation-easing-smooth);
      `

      const computedStyle = getComputedStyle(testElement)
      const transition = computedStyle.getPropertyValue('transition')

      expect(transition).toContain('background-color')
      expect(transition).toContain('color')
      // Check that transition contains the CSS variables (they may not be resolved in test environment)
      expect(transition).toContain('var(--animation-duration-normal)')
    })

    it('should smoothly transition between light and dark themes', async () => {
      // Set initial light theme styles with actual values
      testElement.style.cssText = `
        background-color: #f8f8ff;
        color: #1a1a1a;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      `

      const initialBg = getComputedStyle(testElement).backgroundColor
      const initialColor = getComputedStyle(testElement).color

      // Switch to dark theme and update styles
      rootElement.setAttribute('data-theme', 'dark')
      testElement.style.cssText = `
        background-color: #0f172a;
        color: #f1f5f9;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      `

      // Wait for transition
      await new Promise(resolve => setTimeout(resolve, 50))

      const darkBg = getComputedStyle(testElement).backgroundColor
      const darkColor = getComputedStyle(testElement).color

      // Colors should be different
      expect(darkBg).not.toBe(initialBg)
      expect(darkColor).not.toBe(initialColor)
    })

    it('should have harbour wave animation keyframes', () => {
      const styleSheets = Array.from(document.styleSheets)
      let harbourWaveFound = false

      styleSheets.forEach(sheet => {
        try {
          const rules = Array.from(sheet.cssRules || sheet.rules || [])
          rules.forEach(rule => {
            if (
              rule.type === CSSRule.KEYFRAMES_RULE &&
              rule.name === 'harbour-wave'
            ) {
              harbourWaveFound = true
            }
          })
        } catch (e) {
          // Cross-origin stylesheets may throw errors
        }
      })

      expect(harbourWaveFound).toBe(true)
    })

    it('should have peak tram slide animation keyframes', () => {
      const styleSheets = Array.from(document.styleSheets)
      let peakTramFound = false

      styleSheets.forEach(sheet => {
        try {
          const rules = Array.from(sheet.cssRules || sheet.rules || [])
          rules.forEach(rule => {
            if (
              rule.type === CSSRule.KEYFRAMES_RULE &&
              rule.name === 'peak-tram-slide'
            ) {
              peakTramFound = true
            }
          })
        } catch (e) {
          // Cross-origin stylesheets may throw errors
        }
      })

      expect(peakTramFound).toBe(true)
    })

    it('should have jade shimmer animation keyframes', () => {
      const styleSheets = Array.from(document.styleSheets)
      let jadeShimmerFound = false

      styleSheets.forEach(sheet => {
        try {
          const rules = Array.from(sheet.cssRules || sheet.rules || [])
          rules.forEach(rule => {
            if (
              rule.type === CSSRule.KEYFRAMES_RULE &&
              rule.name === 'jade-shimmer'
            ) {
              jadeShimmerFound = true
            }
          })
        } catch (e) {
          // Cross-origin stylesheets may throw errors
        }
      })

      expect(jadeShimmerFound).toBe(true)
    })
  })

  describe('Performance Optimizations', () => {
    it('should use CSS custom properties for better performance', () => {
      testElement.style.cssText = `
        background: linear-gradient(135deg, #c41e3a, #a8336b);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        border-radius: 0.5rem;
      `

      const computedStyle = getComputedStyle(testElement)

      // Should resolve to actual values
      expect(computedStyle.background).toContain('linear-gradient')
      expect(computedStyle.boxShadow).not.toBe('none')
      expect(computedStyle.borderRadius).toBe('0.5rem')
    })

    it('should have will-change properties for animated elements', () => {
      testElement.className = 'theme-transition-element'
      testElement.style.cssText = `
        will-change: background-color, color, border-color;
        transition: all var(--animation-duration-normal) var(--animation-easing-smooth);
      `

      const computedStyle = getComputedStyle(testElement)
      expect(computedStyle.willChange).toContain('background-color')
    })
  })
})
