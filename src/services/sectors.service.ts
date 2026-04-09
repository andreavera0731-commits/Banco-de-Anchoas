import api from './api'
import type {
  ApiResponse,
  SectorDto,
  UpdateSectorRequest,
} from '@/types/api.types'

export const sectorsService = {
  getById(id: number) {
    return api.get<ApiResponse<SectorDto>>(`/sectors/${encodeURIComponent(id)}`)
  },

  update(id: number, data: UpdateSectorRequest) {
    return api.put(`/sectors/${encodeURIComponent(id)}`, data)
  },

  delete(id: number) {
    return api.delete(`/sectors/${encodeURIComponent(id)}`)
  },
}
