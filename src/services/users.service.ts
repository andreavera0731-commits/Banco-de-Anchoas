import api from './api'
import type { ApiResponse, UserDto, CreateUserRequest, UpdateUserRequest } from '@/types/api.types'

export const usersService = {
  // Obtener todos los usuarios
  getUsers() {
    return api.get<ApiResponse<UserDto[]>>('/users')
  },

  // Crear un nuevo usuario
  createUser(data: CreateUserRequest) {
    return api.post<ApiResponse<string>>('/users', data)
  },

  // Actualizar un usuario
  updateUser(id: string, data: UpdateUserRequest) {
    return api.put(`/users/${id}`, data)
  },

  // Eliminar un usuario
  deleteUser(id: string) {
    return api.delete(`/users/${id}`)
  },
}
