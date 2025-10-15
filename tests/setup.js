import '@testing-library/jest-dom'

// Global test setup
global.console = {
  ...console,
  // Suppress console.log in tests unless needed
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = vi
  .fn()
  .mockImplementation((callback, options) => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
    root: null,
    rootMargin: '',
    thresholds: [],
  }))

// Mock CSS custom properties
global.CSS = {
  supports: vi.fn().mockReturnValue(true),
}

// Mock document.documentElement.style for CSS custom properties
Object.defineProperty(document.documentElement, 'style', {
  value: {
    getPropertyValue: vi.fn().mockImplementation(prop => {
      if (prop === '--harbour-wave-animation') {
        return 'harbour-wave'
      }
      return ''
    }),
    setProperty: vi.fn(),
  },
  writable: true,
})

// Mock getComputedStyle
global.getComputedStyle = vi.fn().mockImplementation(element => {
  const className = element.className || ''
  const testId = element.getAttribute('data-testid') || ''

  // Base styles
  const baseStyles = {
    borderRadius: '1rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2rem',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    willChange: 'transform',
  }

  // Cultural element specific styles
  if (className.includes('harbour-wave-container')) {
    return new Proxy(
      {
        ...baseStyles,
        position: 'relative',
        width: '100%',
        height: '8vh',
        overflow: 'hidden',
        margin: '2rem 0',
      },
      {
        get(target, prop) {
          return target[prop] || ''
        },
      }
    )
  }

  if (className.includes('harbour-wave')) {
    const waveIndex = testId.includes('wave-1')
      ? 0
      : testId.includes('wave-2')
        ? 1
        : 2
    return new Proxy(
      {
        ...baseStyles,
        position: 'absolute',
        width: '120%',
        height: '100%',
        background: 'linear-gradient(180deg, #7fb3d3 0%, #2d8659 100%)',
        borderRadius: '50px',
        opacity: '0.7',
        willChange: 'transform',
        animation: 'harbour-wave 3s ease-in-out infinite',
        animationDelay: `${waveIndex * 0.2}s`,
        animationDuration: '3s',
        animationTimingFunction: 'ease-in-out',
        animationPlayState: 'running',
      },
      {
        get(target, prop) {
          return target[prop] || ''
        },
      }
    )
  }

  if (className.includes('ifc-tower-skyline')) {
    return new Proxy(
      {
        ...baseStyles,
        position: 'relative',
        width: '100%',
        height: '200px',
        background:
          'linear-gradient(180deg, #e6c200 0%, #c41e3a 50%, #f8f8ff 100%)',
        clipPath:
          'polygon(0% 100%, 5% 85%, 10% 90%, 15% 70%, 20% 75%, 25% 60%, 30% 65%, 35% 45%, 40% 50%, 45% 30%, 50% 35%, 55% 20%, 60% 25%, 65% 40%, 70% 45%, 75% 55%, 80% 60%, 85% 70%, 90% 75%, 95% 80%, 100% 100%)',
        margin: '1rem 0',
      },
      {
        get(target, prop) {
          return target[prop] || ''
        },
      }
    )
  }

  if (className.includes('hong-kong-hills')) {
    return new Proxy(
      {
        ...baseStyles,
        position: 'relative',
        width: '100%',
        height: '120px',
        background: '#2d8659',
        backgroundColor: '#2d8659',
        clipPath:
          'polygon(0% 100%, 10% 80%, 20% 85%, 30% 70%, 40% 75%, 50% 60%, 60% 65%, 70% 50%, 80% 55%, 90% 70%, 100% 100%)',
        margin: '1rem 0',
      },
      {
        get(target, prop) {
          return target[prop] || ''
        },
      }
    )
  }

  if (className.includes('jade-crosshatch')) {
    return new Proxy(
      {
        ...baseStyles,
        position: 'relative',
        width: '100%',
        height: '60px',
        backgroundImage:
          'repeating-linear-gradient(45deg, #2d8659 0px, #2d8659 2px, transparent 2px, transparent 8px), repeating-linear-gradient(-45deg, #2d8659 0px, #2d8659 2px, transparent 2px, transparent 8px)',
        opacity: '0.3',
        margin: '1rem 0',
      },
      {
        get(target, prop) {
          return target[prop] || ''
        },
      }
    )
  }

  if (className.includes('cultural-patterns')) {
    return new Proxy(
      {
        ...baseStyles,
        position: 'relative',
        width: '100%',
        margin: '2rem 0',
        transform: 'scale(1)',
      },
      {
        get(target, prop) {
          return target[prop] || ''
        },
      }
    )
  }

  // Default styles
  return new Proxy(baseStyles, {
    get(target, prop) {
      return target[prop] || ''
    },
  })
})
