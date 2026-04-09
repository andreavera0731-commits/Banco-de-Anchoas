import { ref, computed } from 'vue'
import { stockService } from '@/services/stock.service'
import { extractError } from '@/utils/errors'
import type {
  StockMovementDto,
  RegisterMovementRequest,
  RegisterWriteOffRequest,
  RegisterRelocationRequest,
  RegisterAdjustmentRequest,
  GetMovementHistoryParams,
} from '@/types/api.types'

export function useStock() {
  const movements = ref<StockMovementDto[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const pageNumber = ref(1)
  const pageSize = ref(20)
  const totalCount = ref(0)
  const totalPages = ref(0)
  let lastParams: GetMovementHistoryParams | undefined

  const paginationInfo = computed(() => ({
    pageNumber: pageNumber.value,
    pageSize: pageSize.value,
    totalCount: totalCount.value,
    totalPages: totalPages.value,
  }))

  async function fetchMovementHistory(params?: GetMovementHistoryParams) {
    if (params) lastParams = params
    isLoading.value = true
    error.value = null
    try {
      const response = await stockService.getHistory(params ?? lastParams)
      movements.value = response.data.data.items
      pageNumber.value = response.data.data.pageNumber
      totalCount.value = response.data.data.totalCount
      totalPages.value = response.data.data.totalPages
    } catch (err) {
      error.value = extractError(err)
    } finally {
      isLoading.value = false
    }
  }

  async function registerMovement(data: RegisterMovementRequest) {
    error.value = null
    try {
      await stockService.registerMovement(data)
      await fetchMovementHistory()
    } catch (err) {
      error.value = extractError(err)
      throw err
    }
  }

  async function registerWriteOff(data: RegisterWriteOffRequest) {
    error.value = null
    try {
      await stockService.registerWriteOff(data)
      await fetchMovementHistory()
    } catch (err) {
      error.value = extractError(err)
      throw err
    }
  }

  async function registerRelocation(data: RegisterRelocationRequest) {
    error.value = null
    try {
      await stockService.relocate(data)
      await fetchMovementHistory()
    } catch (err) {
      error.value = extractError(err)
      throw err
    }
  }

  async function registerAdjustment(data: RegisterAdjustmentRequest) {
    error.value = null
    try {
      await stockService.adjust(data)
      await fetchMovementHistory()
    } catch (err) {
      error.value = extractError(err)
      throw err
    }
  }

  return {
    movements,
    isLoading,
    error,
    paginationInfo,
    fetchMovementHistory,
    registerMovement,
    registerWriteOff,
    registerRelocation,
    registerAdjustment,
  }
}
