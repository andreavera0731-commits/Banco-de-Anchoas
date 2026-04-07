import api from './api'
import type {
  ApiResponse,
  SectorDto,
  UpdateSectorRequest,
} from '@/types/api.types'

export const sectorsService = {
  getById(id: number) {
    return api.get<ApiResponse<SectorDto>>(`/sectors/${id}`)
  },

  update(id: number, data: UpdateSectorRequest) {
    return api.put(`/sectors/${id}`, data)
  },

  delete(id: number) {
    return api.delete(`/sectors/${id}`)
  },
}
