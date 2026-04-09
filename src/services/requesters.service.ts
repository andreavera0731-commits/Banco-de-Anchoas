import api from './api'
import type {
  ApiResponse,
  RequesterDto,
  CreateRequesterRequest,
  UpdateRequesterRequest,
} from '@/types/api.types'

export const requestersService = {
  getAll() {
    return api.get<ApiResponse<RequesterDto[]>>('/requesters')
  },

  getById(id: number) {
    return api.get<ApiResponse<RequesterDto>>(`/requesters/${encodeURIComponent(id)}`)
  },

  create(data: CreateRequesterRequest) {
    return api.post<ApiResponse<number>>('/requesters', data)
  },

  update(id: number, data: UpdateRequesterRequest) {
    return api.put(`/requesters/${encodeURIComponent(id)}`, data)
  },

  delete(id: number) {
    return api.delete(`/requesters/${encodeURIComponent(id)}`)
  },
}
