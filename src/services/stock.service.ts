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
  registerMovement(data: RegisterMovementRequest) {
    return api.post<ApiResponse<number>>('/stock/movements', data)
  },

  registerWriteOff(data: RegisterWriteOffRequest) {
    return api.post<ApiResponse<number>>('/stock/write-off', data)
  },

  relocate(data: RegisterRelocationRequest) {
    return api.post<ApiResponse<number>>('/stock/relocate', data)
  },

  adjust(data: RegisterAdjustmentRequest) {
    return api.post<ApiResponse<number>>('/stock/adjustment', data)
  },

  getHistory(params?: GetMovementHistoryParams) {
    return api.get<ApiResponse<PaginatedList<StockMovementDto>>>('/stock/history', { params })
  },

  getWriteOffs(params?: GetWriteOffsParams) {
    return api.get<ApiResponse<StockMovementDto[]>>('/stock/write-offs', { params })
  },
}
