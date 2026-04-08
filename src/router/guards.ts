import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import { authService } from '@/features/auth/services/auth.service'

export async function authGuard(to: RouteLocationNormalized): Promise<RouteLocationRaw | true | void> {
  const auth = useAuthStore()

  // Si requiere autenticación y no está autenticado
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login' }
  }

  // Si ya está autenticado y es login, redirigir a productos
  if (to.name === 'login' && auth.isAuthenticated) {
    return { name: 'products' }
  }

  // Si está autenticado pero no tiene datos del usuario, cargar perfil
  if (auth.isAuthenticated && !auth.user) {
    try {
      const response = await authService.getProfile()
      const userProfile = response.data.data
      auth.user = userProfile
    } catch (error) {
      auth.logout()
      return { name: 'login' }
    }
  }

  // Si requiere rol específico y no tiene ese rol
  if (to.meta.role) {
    const requiredRole = to.meta.role as string
    if (!auth.hasRole(requiredRole as any)) {
      return { name: 'unauthorized' }
    }
  }
}
