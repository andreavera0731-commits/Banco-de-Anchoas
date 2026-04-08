import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { warehousesService } from '@/services/warehouses.service'
import type { WarehouseDto, SectorDto } from '@/types/api.types'

export const useWarehousesStore = defineStore('warehouses', () => {
  const { t } = useI18n()
  const warehouses = ref<WarehouseDto[]>([])
  const currentWarehouse = ref<WarehouseDto | null>(null)
  const sectors = ref<SectorDto[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const sectorOptions = computed(() =>
    sectors.value.map((s) => ({
      value: s.id,
      title: s.name,
    })),
  )

  async function fetchWarehouses() {
    isLoading.value = true
    error.value = null
    try {
      const response = await warehousesService.getAll()
      warehouses.value = response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || t('errors.loadWarehouses')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function fetchWarehouseDetail(id: number) {
    isLoading.value = true
    error.value = null
    try {
      const response = await warehousesService.getById(id)
      currentWarehouse.value = response.data.data
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || t('errors.loadWarehouse')
      throw err
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
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function clearCache() {
    warehouses.value = []
    currentWarehouse.value = null
    sectors.value = []
  }

  return {
    warehouses,
    currentWarehouse,
    sectors,
    isLoading,
    error,
    sectorOptions,
    fetchWarehouses,
    fetchWarehouseDetail,
    fetchWarehouseSectors,
    clearCache,
  }
})
