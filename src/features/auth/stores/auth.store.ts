import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '../types/auth.types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  const isAuthenticated = computed(() => !!token.value)
  const userRole = computed(() => user.value?.role ?? null)

  function setSession(newToken: string, userData: User) {
    token.value = newToken
    user.value = userData
    localStorage.setItem('token', newToken)
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  function hasRole(role: string): boolean {
    return user.value?.role === role
  }

  return { user, token, isAuthenticated, userRole, setSession, logout, hasRole }
})
