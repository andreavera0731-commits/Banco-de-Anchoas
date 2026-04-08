import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { warehousesService } from '@/services/warehouses.service'
import { sectorsService } from '@/services/sectors.service'
import type { WarehouseDto, SectorDto } from '@/types/api.types'

export function useWarehouses() {
  const { t } = useI18n()
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
    } catch (err: any) {
      error.value = err.response?.data?.message || t('errors.loadWarehouses')
    } finally {
      isLoading.value = false
    }
  }

  async function fetchWarehouse(id: number) {
    isLoading.value = true
    error.value = null
    try {
      const response = await warehousesService.getById(id)
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || t('errors.loadWarehouse')
    } finally {
      isLoading.value = false
    }
  }

  async function fetchWarehouseSectors(warehouseId: number) {
    isLoading.value = true
    error.value = null
    try {
      const response = await warehousesService.getSectors(warehouseId)
      sectors.value = response.data.data
      return sectors.value
    } catch (err: any) {
      error.value = err.response?.data?.message || t('errors.loadSectors')
    } finally {
      isLoading.value = false
    }
  }

  async function createWarehouse(name: string, location?: string) {
    error.value = null
    try {
      const response = await warehousesService.create({
        name,
        location: location || null,
      })
      await fetchWarehouses()
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || t('errors.createWarehouse')
      throw err
    }
  }

  async function updateWarehouse(id: number, name: string, location?: string) {
    error.value = null
    try {
      await warehousesService.update(id, {
        id,
        name,
        location: location || null,
      })
      await fetchWarehouses()
    } catch (err: any) {
      error.value = err.response?.data?.message || t('errors.updateWarehouse')
      throw err
    }
  }

  async function deleteWarehouse(id: number) {
    error.value = null
    try {
      await warehousesService.delete(id)
      await fetchWarehouses()
    } catch (err: any) {
      error.value = err.response?.data?.message || t('errors.deleteWarehouse')
      throw err
    }
  }

  return {
    warehouses,
    sectors,
    isLoading,
    error,
    fetchWarehouses,
    fetchWarehouse,
    fetchWarehouseSectors,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
  }
}

export function useSectors() {
  const { t } = useI18n()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchSector(id: number) {
    isLoading.value = true
    error.value = null
    try {
      const response = await sectorsService.getById(id)
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || t('errors.loadSector')
    } finally {
      isLoading.value = false
    }
  }

  async function updateSector(id: number, name: string) {
    error.value = null
    try {
      await sectorsService.update(id, { id, name })
    } catch (err: any) {
      error.value = err.response?.data?.message || t('errors.updateSector')
      throw err
    }
  }

  async function deleteSector(id: number) {
    error.value = null
    try {
      await sectorsService.delete(id)
    } catch (err: any) {
      error.value = err.response?.data?.message || t('errors.deleteSector')
      throw err
    }
  }

  return {
    isLoading,
    error,
    fetchSector,
    updateSector,
    deleteSector,
  }
}
