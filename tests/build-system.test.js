import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'

describe('Build System Configuration', () => {
  describe('Package.json Configuration', () => {
    it('should have correct project name and version', () => {
      const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'))

      expect(packageJson.name).toBe('studio-encantador-website')
      expect(packageJson.version).toBe('1.0.0')
      expect(packageJson.type).toBe('module')
    })

    it('should have all required build scripts', () => {
      const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'))

      expect(packageJson.scripts).toHaveProperty('dev')
      expect(packageJson.scripts).toHaveProperty('build')
      expect(packageJson.scripts).toHaveProperty('preview')
      expect(packageJson.scripts).toHaveProperty('test')
      expect(packageJson.scripts.dev).toBe('vite')
      expect(packageJson.scripts.build).toBe('vite build')
    })

    it('should have required development dependencies', () => {
      const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'))

      expect(packageJson.devDependencies).toHaveProperty('vite')
      expect(packageJson.devDependencies).toHaveProperty('vitest')
      expect(packageJson.devDependencies).toHaveProperty('jsdom')
      expect(packageJson.devDependencies).toHaveProperty('@testing-library/dom')
    })
  })

  describe('Vite Configuration', () => {
    it('should have vite.config.js file', () => {
      expect(existsSync('vite.config.js')).toBe(true)
    })

    it('should have vitest.config.js file', () => {
      expect(existsSync('vitest.config.js')).toBe(true)
    })
  })

  describe('Directory Structure', () => {
    it('should have src directory with main files', () => {
      expect(existsSync('src')).toBe(true)
      expect(existsSync('src/index.html')).toBe(true)
      expect(existsSync('src/js/main.js')).toBe(true)
      expect(existsSync('src/styles/main.css')).toBe(true)
    })

    it('should have multi-language HTML files', () => {
      expect(existsSync('src/zh-hk/index.html')).toBe(true)
      expect(existsSync('src/zh-cn/index.html')).toBe(true)
    })

    it('should have component and asset directories', () => {
      expect(existsSync('src/components')).toBe(true)
      expect(existsSync('src/assets/images')).toBe(true)
      expect(existsSync('src/assets/icons')).toBe(true)
    })

    it('should have translation files for all languages', () => {
      expect(existsSync('src/translations/en.json')).toBe(true)
      expect(existsSync('src/translations/zh-hk.json')).toBe(true)
      expect(existsSync('src/translations/zh-cn.json')).toBe(true)
    })
  })

  describe('Translation Files Structure', () => {
    it('should have consistent structure across all language files', () => {
      const enTranslations = JSON.parse(
        readFileSync('src/translations/en.json', 'utf-8')
      )
      const zhHkTranslations = JSON.parse(
        readFileSync('src/translations/zh-hk.json', 'utf-8')
      )
      const zhCnTranslations = JSON.parse(
        readFileSync('src/translations/zh-cn.json', 'utf-8')
      )

      // Check that all files have the same structure
      expect(Object.keys(enTranslations)).toEqual(Object.keys(zhHkTranslations))
      expect(Object.keys(enTranslations)).toEqual(Object.keys(zhCnTranslations))

      // Check required sections exist
      expect(enTranslations).toHaveProperty('site')
      expect(enTranslations).toHaveProperty('navigation')
      expect(enTranslations).toHaveProperty('hero')
    })
  })
})
