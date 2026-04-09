import { ref } from 'vue'
import { warehousesService } from '@/services/warehouses.service'
import { sectorsService } from '@/services/sectors.service'
import { extractError } from '@/utils/errors'
import type {
  WarehouseDto,
  SectorDto,
  CreateWarehouseRequest,
  UpdateWarehouseRequest,
  CreateSectorRequest,
  UpdateSectorRequest,
} from '@/types/api.types'

export function useWarehouses() {
  const warehouses = ref<WarehouseDto[]>([])
  const sectors = ref<SectorDto[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchWarehouses() {
    isLoading.value = true
    error.value = null
    try {
      const response = await warehousesService.getAll()
      warehouses.value = response.data.data
    } catch (err) {
      error.value = extractError(err)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchWarehouseSectors(warehouseId: number) {
    error.value = null
    try {
      const response = await warehousesService.getSectors(warehouseId)
      sectors.value = response.data.data
      return sectors.value
    } catch (err) {
      error.value = extractError(err)
    }
  }

  async function createWarehouse(data: CreateWarehouseRequest) {
    error.value = null
    try {
      const response = await warehousesService.create(data)
      await fetchWarehouses()
      return response.data.data
    } catch (err) {
      error.value = extractError(err)
      throw err
    }
  }

  async function updateWarehouse(id: number, data: UpdateWarehouseRequest) {
    error.value = null
    try {
      await warehousesService.update(id, data)
      await fetchWarehouses()
    } catch (err) {
      error.value = extractError(err)
      throw err
    }
  }

  async function deleteWarehouse(id: number) {
    error.value = null
    try {
      await warehousesService.delete(id)
      await fetchWarehouses()
    } catch (err) {
      error.value = extractError(err)
      throw err
    }
  }

  async function createSector(warehouseId: number, data: CreateSectorRequest) {
    error.value = null
    try {
      const response = await warehousesService.createSector(warehouseId, data)
      await fetchWarehouseSectors(warehouseId)
      return response.data.data
    } catch (err) {
      error.value = extractError(err)
      throw err
    }
  }

  async function updateSector(id: number, data: UpdateSectorRequest) {
    error.value = null
    try {
      await sectorsService.update(id, data)
    } catch (err) {
      error.value = extractError(err)
      throw err
    }
  }

  async function deleteSector(id: number) {
    error.value = null
    try {
      await sectorsService.delete(id)
    } catch (err) {
      error.value = extractError(err)
      throw err
    }
  }

  return {
    warehouses,
    sectors,
    isLoading,
    error,
    fetchWarehouses,
    fetchWarehouseSectors,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
    createSector,
    updateSector,
    deleteSector,
  }
}
