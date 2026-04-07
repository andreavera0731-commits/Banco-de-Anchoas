import api from './api'
import type {
  ApiResponse,
  WarehouseDto,
  SectorDto,
  CreateWarehouseRequest,
  UpdateWarehouseRequest,
  CreateSectorRequest,
  UpdateSectorRequest,
} from '@/types/api.types'

export const warehousesService = {
  // Obtener todos los almacenes
  getWarehouses() {
    return api.get<ApiResponse<WarehouseDto[]>>('/warehouses')
  },

  // Obtener un almacén por ID
  getWarehouse(id: number) {
    return api.get<ApiResponse<WarehouseDto>>(`/warehouses/${id}`)
  },

  // Crear un nuevo almacén
  createWarehouse(data: CreateWarehouseRequest) {
    return api.post<ApiResponse<number>>('/warehouses', data)
  },

  // Actualizar un almacén
  updateWarehouse(id: number, data: UpdateWarehouseRequest) {
    return api.put(`/warehouses/${id}`, data)
  },

  // Eliminar un almacén
  deleteWarehouse(id: number) {
    return api.delete(`/warehouses/${id}`)
  },

  // Obtener sectores de un almacén
  getWarehouseSectors(id: number) {
    return api.get<ApiResponse<SectorDto[]>>(`/warehouses/${id}/sectors`)
  },

  // Crear un sector en un almacén
  createWarehouseSector(warehouseId: number, data: CreateSectorRequest) {
    return api.post<ApiResponse<number>>(`/warehouses/${warehouseId}/sectors`, data)
  },
}

export const sectorsService = {
  // Obtener un sector por ID
  getSector(id: number) {
    return api.get<ApiResponse<SectorDto>>(`/sectors/${id}`)
  },

  // Actualizar un sector
  updateSector(id: number, data: UpdateSectorRequest) {
    return api.put(`/sectors/${id}`, data)
  },

  // Eliminar un sector
  deleteSector(id: number) {
    return api.delete(`/sectors/${id}`)
  },
}
