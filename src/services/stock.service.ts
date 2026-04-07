import api from './api'
import type {
  ApiResponse,
  PaginatedList,
  StockMovementDto,
  RegisterMovementRequest,
  RegisterWriteOffRequest,
  RegisterRelocationRequest,
  RegisterAdjustmentRequest,
  GetMovementHistoryParams,
  GetWriteOffsParams,
} from '@/types/api.types'

export const stockService = {
  // Registrar movimiento de entrada/salida
  registerMovement(data: RegisterMovementRequest) {
    return api.post<ApiResponse<number>>('/stock/movements', data)
  },

  // Registrar baja/merma
  registerWriteOff(data: RegisterWriteOffRequest) {
    return api.post<ApiResponse<number>>('/stock/write-off', data)
  },

  // Registrar reubicación entre sectores
  registerRelocation(data: RegisterRelocationRequest) {
    return api.post<ApiResponse<number>>('/stock/relocate', data)
  },

  // Registrar ajuste manual de stock (solo Admin)
  registerAdjustment(data: RegisterAdjustmentRequest) {
    return api.post<ApiResponse<number>>('/stock/adjustment', data)
  },

  // Obtener historial paginado de movimientos (solo Admin)
  getMovementHistory(params?: GetMovementHistoryParams) {
    return api.get<ApiResponse<PaginatedList<StockMovementDto>>>('/stock/history', { params })
  },

  // Obtener bajas/mermas (solo Admin)
  getWriteOffs(params?: GetWriteOffsParams) {
    return api.get<ApiResponse<StockMovementDto[]>>('/stock/write-offs', { params })
  },
}
