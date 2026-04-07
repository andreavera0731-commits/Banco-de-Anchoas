import type { App } from 'vue'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import { authService } from '@/features/auth/services/auth.service'

export function authPlugin(app: App) {
  // Inicializar autenticación al cargar la aplicación
  const auth = useAuthStore()

  if (auth.isAuthenticated && !auth.user) {
    authService
      .getProfile()
      .then((response) => {
        auth.user = response.data.data
      })
      .catch(() => {
        auth.logout()
      })
  }
}
