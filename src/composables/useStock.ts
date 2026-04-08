import { ref } from 'vue'
import { stockService } from '@/services/stock.service'
import type {
  RegisterMovementRequest,
  RegisterWriteOffRequest,
  RegisterRelocationRequest,
  RegisterAdjustmentRequest,
  GetMovementHistoryParams,
  StockMovementDto,
} from '@/types/api.types'

export function useStock() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const movements = ref<StockMovementDto[]>([])
  const totalPages = ref(0)
  const currentPage = ref(1)

  async function registerMovement(data: RegisterMovementRequest) {
    isLoading.value = true
    error.value = null
    try {
      const response = await stockService.registerMovement(data)
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.errors || err.response?.data?.message || 'Error al registrar movimiento'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function registerWriteOff(data: RegisterWriteOffRequest) {
    isLoading.value = true
    error.value = null
    try {
      const response = await stockService.registerWriteOff(data)
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.errors || err.response?.data?.message || 'Error al registrar baja'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function registerRelocation(data: RegisterRelocationRequest) {
    isLoading.value = true
    error.value = null
    try {
      const response = await stockService.registerRelocation(data)
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.errors || err.response?.data?.message || 'Error al registrar reubicación'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function registerAdjustment(data: RegisterAdjustmentRequest) {
    isLoading.value = true
    error.value = null
    try {
      const response = await stockService.registerAdjustment(data)
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.errors || err.response?.data?.message || 'Error al registrar ajuste'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function fetchMovementHistory(params?: GetMovementHistoryParams) {
    isLoading.value = true
    error.value = null
    try {
      const response = await stockService.getMovementHistory(params)
      movements.value = response.data.data.items
      totalPages.value = response.data.data.totalPages
      currentPage.value = response.data.data.pageNumber
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar historial'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchWriteOffs(reason?: number) {
    isLoading.value = true
    error.value = null
    try {
      const response = await stockService.getWriteOffs({ reason })
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar bajas'
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    movements,
    totalPages,
    currentPage,
    registerMovement,
    registerWriteOff,
    registerRelocation,
    registerAdjustment,
    fetchMovementHistory,
    fetchWriteOffs,
  }
}
