import axios from 'axios'
import type { AxiosError } from 'axios'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import router from '@/router'
import type { ErrorResponse } from '@/types/api.types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api',
  headers: { 'Content-Type': 'application/json' },
})

// Interceptor: agrega token a cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor: maneja 401 (token expirado)
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    if (error.response?.status === 401) {
      const auth = useAuthStore()
      auth.logout()
      router.push({ name: 'login' })
    }
    return Promise.reject(error)
  },
)

export default api
