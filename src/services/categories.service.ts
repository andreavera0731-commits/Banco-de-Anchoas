import api from './api'
import type {
  ApiResponse,
  CategoryDto,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/types/api.types'

export const categoriesService = {
  getAll() {
    return api.get<ApiResponse<CategoryDto[]>>('/categories')
  },

  getById(id: number) {
    return api.get<ApiResponse<CategoryDto>>(`/categories/${encodeURIComponent(id)}`)
  },

  create(data: CreateCategoryRequest) {
    return api.post<ApiResponse<number>>('/categories', data)
  },

  update(id: number, data: UpdateCategoryRequest) {
    return api.put(`/categories/${encodeURIComponent(id)}`, data)
  },

  delete(id: number) {
    return api.delete(`/categories/${encodeURIComponent(id)}`)
  },
}
