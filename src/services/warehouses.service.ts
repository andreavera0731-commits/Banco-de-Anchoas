import api from './api'
import type {
  ApiResponse,
  WarehouseDto,
  CreateWarehouseRequest,
  UpdateWarehouseRequest,
  SectorDto,
  CreateSectorRequest,
} from '@/types/api.types'

export const warehousesService = {
  getAll() {
    return api.get<ApiResponse<WarehouseDto[]>>('/warehouses')
  },

  getById(id: number) {
    return api.get<ApiResponse<WarehouseDto>>(`/warehouses/${id}`)
  },

  create(data: CreateWarehouseRequest) {
    return api.post<ApiResponse<number>>('/warehouses', data)
  },

  update(id: number, data: UpdateWarehouseRequest) {
    return api.put(`/warehouses/${id}`, data)
  },

  delete(id: number) {
    return api.delete(`/warehouses/${id}`)
  },

  getSectors(warehouseId: number) {
    return api.get<ApiResponse<SectorDto[]>>(`/warehouses/${warehouseId}/sectors`)
  },

  createSector(warehouseId: number, data: CreateSectorRequest) {
    return api.post<ApiResponse<number>>(`/warehouses/${warehouseId}/sectors`, data)
  },
}
