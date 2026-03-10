import { describe, it, expect } from 'vitest'
import { isValidEmail, isValidPassword, isRequired } from '../validators'

describe('Validators', () => {
  describe('isValidEmail', () => {
    it('validates correct email', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
    })

    it('rejects invalid email', () => {
      expect(isValidEmail('invalid-email')).toBe(false)
    })
  })

  describe('isValidPassword', () => {
    it('validates password with 8+ characters', () => {
      expect(isValidPassword('password123')).toBe(true)
    })

    it('rejects password with less than 8 characters', () => {
      expect(isValidPassword('short')).toBe(false)
    })
  })

  describe('isRequired', () => {
    it('validates non-empty string', () => {
      expect(isRequired('value')).toBe(true)
    })

    it('rejects empty string', () => {
      expect(isRequired('')).toBe(false)
    })
  })
})
