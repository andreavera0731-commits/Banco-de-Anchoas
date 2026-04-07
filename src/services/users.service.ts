import api from './api'
import type {
  ApiResponse,
  UserDto,
  CreateUserRequest,
  UpdateUserRequest,
} from '@/types/api.types'

export const usersService = {
  getAll() {
    return api.get<ApiResponse<UserDto[]>>('/users')
  },

  create(data: CreateUserRequest) {
    return api.post<ApiResponse<string>>('/users', data)
  },

  update(id: string, data: UpdateUserRequest) {
    return api.put(`/users/${encodeURIComponent(id)}`, data)
  },

  delete(id: string) {
    return api.delete(`/users/${encodeURIComponent(id)}`)
  },
}
