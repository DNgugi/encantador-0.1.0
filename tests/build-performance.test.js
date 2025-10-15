import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync, statSync } from 'fs'

describe('Build Performance Optimization', () => {
  describe('Production Build Output', () => {
    it('should generate optimized assets', () => {
      expect(existsSync('dist')).toBe(true)
      expect(existsSync('dist/assets')).toBe(true)
      expect(existsSync('dist/index.html')).toBe(true)
    })

    it('should generate multi-language HTML files', () => {
      expect(existsSync('dist/zh-hk/index.html')).toBe(true)
      expect(existsSync('dist/zh-cn/index.html')).toBe(true)
    })

    it('should generate minified CSS and JS files', () => {
      const assetsDir = 'dist/assets'
      const files = require('fs').readdirSync(assetsDir)

      const cssFiles = files.filter(file => file.endsWith('.css'))
      const jsFiles = files.filter(
        file => file.endsWith('.js') && !file.endsWith('.map')
      )

      expect(cssFiles.length).toBeGreaterThan(0)
      expect(jsFiles.length).toBeGreaterThan(0)
    })

    it('should generate source maps for debugging', () => {
      const assetsDir = 'dist/assets'
      const files = require('fs').readdirSync(assetsDir)

      const mapFiles = files.filter(file => file.endsWith('.js.map'))
      expect(mapFiles.length).toBeGreaterThan(0)
    })

    it('should have optimized file sizes', () => {
      const indexHtml = statSync('dist/index.html')
      const zhHkHtml = statSync('dist/zh-hk/index.html')
      const zhCnHtml = statSync('dist/zh-cn/index.html')

      // HTML files should be reasonably small (under 2KB)
      expect(indexHtml.size).toBeLessThan(2048)
      expect(zhHkHtml.size).toBeLessThan(2048)
      expect(zhCnHtml.size).toBeLessThan(2048)
    })
  })

  describe('Build Configuration Optimization', () => {
    it('should use ES2015 target for broad compatibility', () => {
      const viteConfig = readFileSync('vite.config.js', 'utf-8')
      expect(viteConfig).toContain("target: 'es2015'")
    })

    it('should enable minification with terser', () => {
      const viteConfig = readFileSync('vite.config.js', 'utf-8')
      expect(viteConfig).toContain("minify: 'terser'")
    })

    it('should generate source maps', () => {
      const viteConfig = readFileSync('vite.config.js', 'utf-8')
      expect(viteConfig).toContain('sourcemap: true')
    })
  })
})
