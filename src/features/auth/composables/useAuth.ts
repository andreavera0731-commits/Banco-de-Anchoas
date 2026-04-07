import { ref } from 'vue'
import { useAuthStore } from '../stores/auth.store'
import { authService } from '../services/auth.service'
import type { LoginRequest } from '../types/auth.types'

export function useAuth() {
  const auth = useAuthStore()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function login(credentials: LoginRequest) {
    isLoading.value = true
    error.value = null
    try {
      const response = await authService.login(credentials)
      const { token, user } = response.data.data
      auth.setSession(token, user)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al iniciar sesión'
      return false
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    auth.logout()
  }

  return {
    isAuthenticated: auth.isAuthenticated,
    userRole: auth.userRole,
    user: auth.user,
    isLoading,
    error,
    login,
    logout,
    hasRole: auth.hasRole,
  }
}
