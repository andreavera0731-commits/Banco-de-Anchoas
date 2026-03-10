import type { RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/features/auth/stores/auth.store'

export function authGuard(to: RouteLocationNormalized) {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login' }
  }

  if (to.meta.role && !auth.hasRole(to.meta.role as string)) {
    return { name: 'unauthorized' }
  }
}
