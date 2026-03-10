import api from '@/services/api'
import type { LoginRequest, LoginResponse } from '../types/auth.types'

export const authService = {
  login(data: LoginRequest) {
    return api.post<LoginResponse>('/auth/login', data)
  },
  getProfile() {
    return api.get('/auth/profile')
  },
}
