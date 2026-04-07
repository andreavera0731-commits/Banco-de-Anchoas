import api from './api'
import type { ApiResponse, CategoryDto, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/api.types'

export const categoriesService = {
  // Obtener todas las categorías
  getCategories() {
    return api.get<ApiResponse<CategoryDto[]>>('/categories')
  },

  // Obtener una categoría por ID
  getCategory(id: number) {
    return api.get<ApiResponse<CategoryDto>>(`/categories/${id}`)
  },

  // Crear una nueva categoría
  createCategory(data: CreateCategoryRequest) {
    return api.post<ApiResponse<number>>('/categories', data)
  },

  // Actualizar una categoría
  updateCategory(id: number, data: UpdateCategoryRequest) {
    return api.put(`/categories/${id}`, data)
  },

  // Eliminar una categoría
  deleteCategory(id: number) {
    return api.delete(`/categories/${id}`)
  },
}
