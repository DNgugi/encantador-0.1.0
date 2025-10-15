import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/dom'

describe('DOM Testing Utilities', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('Testing Library Integration', () => {
    it('should be able to query DOM elements', () => {
      document.body.innerHTML = `
        <div>
          <h1>Studio Encantador</h1>
          <p>Hong Kong Business Consulting</p>
        </div>
      `

      expect(screen.getByText('Studio Encantador')).toBeInTheDocument()
      expect(
        screen.getByText('Hong Kong Business Consulting')
      ).toBeInTheDocument()
    })

    it('should support custom matchers from jest-dom', () => {
      document.body.innerHTML = `
        <button disabled>Contact Us</button>
        <input type="text" value="test" />
      `

      const button = screen.getByRole('button')
      const input = screen.getByRole('textbox')

      expect(button).toBeDisabled()
      expect(input).toHaveValue('test')
    })
  })

  describe('Multi-language Content Testing', () => {
    it('should handle different language attributes', () => {
      document.body.innerHTML = `
        <div lang="en">English Content</div>
        <div lang="zh-HK">繁體中文內容</div>
        <div lang="zh-CN">简体中文内容</div>
      `

      const englishContent = screen.getByText('English Content')
      const traditionalChinese = screen.getByText('繁體中文內容')
      const simplifiedChinese = screen.getByText('简体中文内容')

      expect(englishContent).toHaveAttribute('lang', 'en')
      expect(traditionalChinese).toHaveAttribute('lang', 'zh-HK')
      expect(simplifiedChinese).toHaveAttribute('lang', 'zh-CN')
    })
  })
})
