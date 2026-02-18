import { describe, it, expect } from 'vitest'
import { bookmarkService } from './bookmark'

describe('BookmarkService - Validation', () => {
  describe('validateBookmarkInput', () => {
    it('should validate correct URL and title', () => {
      const result = bookmarkService.validateBookmarkInput(
        'https://example.com',
        'Example Site'
      )
      expect(result.valid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('should reject empty URL', () => {
      const result = bookmarkService.validateBookmarkInput('', 'Example Site')
      expect(result.valid).toBe(false)
      expect(result.errors.url).toBe('URL is required')
    })

    it('should reject whitespace-only URL', () => {
      const result = bookmarkService.validateBookmarkInput('   ', 'Example Site')
      expect(result.valid).toBe(false)
      expect(result.errors.url).toBe('URL is required')
    })

    it('should reject invalid URL format', () => {
      const result = bookmarkService.validateBookmarkInput(
        'not-a-valid-url',
        'Example Site'
      )
      expect(result.valid).toBe(false)
      expect(result.errors.url).toBe('Invalid URL format')
    })

    it('should reject empty title', () => {
      const result = bookmarkService.validateBookmarkInput(
        'https://example.com',
        ''
      )
      expect(result.valid).toBe(false)
      expect(result.errors.title).toBe('Title is required')
    })

    it('should reject whitespace-only title', () => {
      const result = bookmarkService.validateBookmarkInput(
        'https://example.com',
        '   '
      )
      expect(result.valid).toBe(false)
      expect(result.errors.title).toBe('Title is required')
    })

    it('should reject both empty URL and title', () => {
      const result = bookmarkService.validateBookmarkInput('', '')
      expect(result.valid).toBe(false)
      expect(result.errors.url).toBe('URL is required')
      expect(result.errors.title).toBe('Title is required')
    })

    it('should accept URLs with different protocols', () => {
      const httpResult = bookmarkService.validateBookmarkInput(
        'http://example.com',
        'Example'
      )
      expect(httpResult.valid).toBe(true)

      const httpsResult = bookmarkService.validateBookmarkInput(
        'https://example.com',
        'Example'
      )
      expect(httpsResult.valid).toBe(true)
    })

    it('should accept URLs with paths and query parameters', () => {
      const result = bookmarkService.validateBookmarkInput(
        'https://example.com/path?query=value',
        'Example'
      )
      expect(result.valid).toBe(true)
    })

    it('should trim whitespace from inputs before validation', () => {
      const result = bookmarkService.validateBookmarkInput(
        '  https://example.com  ',
        '  Example Site  '
      )
      expect(result.valid).toBe(true)
    })
  })
})
