import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../stores/auth.store'

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // Limpiar localStorage
    localStorage.clear()
  })

  it('starts unauthenticated', () => {
    const auth = useAuthStore()
    expect(auth.isAuthenticated).toBe(false)
  })

  it('sets session correctly', () => {
    const auth = useAuthStore()
    auth.setSession('test-token', {
      id: 1,
      email: 'a@b.com',
      name: 'Test',
      role: 'user',
    })
    expect(auth.isAuthenticated).toBe(true)
    expect(auth.userRole).toBe('user')
    expect(auth.user?.email).toBe('a@b.com')
  })

  it('logs out correctly', () => {
    const auth = useAuthStore()
    auth.setSession('test-token', {
      id: 1,
      email: 'a@b.com',
      name: 'Test',
      role: 'user',
    })
    expect(auth.isAuthenticated).toBe(true)

    auth.logout()
    expect(auth.isAuthenticated).toBe(false)
    expect(auth.user).toBe(null)
  })

  it('checks role correctly', () => {
    const auth = useAuthStore()
    auth.setSession('test-token', {
      id: 1,
      email: 'a@b.com',
      name: 'Test',
      role: 'admin',
    })
    expect(auth.hasRole('admin')).toBe(true)
    expect(auth.hasRole('user')).toBe(false)
  })
})
