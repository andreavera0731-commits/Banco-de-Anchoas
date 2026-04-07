import api from '@/services/api'
import type { LoginRequest, LoginResponse, UserProfile } from '../types/auth.types'
import type { ApiResponse } from '@/types/api.types'

export const authService = {
  login(data: LoginRequest) {
    return api.post<ApiResponse<LoginResponse>>('/auth/login', data)
  },

  getProfile() {
    return api.get<ApiResponse<UserProfile>>('/auth/profile')
  },
}
