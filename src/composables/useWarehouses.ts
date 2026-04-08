import { ref } from 'vue'
import { warehousesService, sectorsService } from '@/services/warehouses.service'
import type { WarehouseDto, SectorDto } from '@/types/api.types'

export function useWarehouses() {
  const warehouses = ref<WarehouseDto[]>([])
  const sectors = ref<SectorDto[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchWarehouses() {
    isLoading.value = true
    error.value = null
    try {
      const response = await warehousesService.getWarehouses()
      warehouses.value = response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar almacenes'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchWarehouse(id: number) {
    isLoading.value = true
    error.value = null
    try {
      const response = await warehousesService.getWarehouse(id)
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar almacén'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchWarehouseSectors(warehouseId: number) {
    isLoading.value = true
    error.value = null
    try {
      const response = await warehousesService.getWarehouseSectors(warehouseId)
      sectors.value = response.data.data
      return sectors.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar sectores'
    } finally {
      isLoading.value = false
    }
  }

  async function createWarehouse(name: string, location?: string) {
    error.value = null
    try {
      const response = await warehousesService.createWarehouse({
        name,
        location: location || null,
      })
      await fetchWarehouses()
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al crear almacén'
      throw err
    }
  }

  async function updateWarehouse(id: number, name: string, location?: string) {
    error.value = null
    try {
      await warehousesService.updateWarehouse(id, {
        id,
        name,
        location: location || null,
      })
      await fetchWarehouses()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al actualizar almacén'
      throw err
    }
  }

  async function deleteWarehouse(id: number) {
    error.value = null
    try {
      await warehousesService.deleteWarehouse(id)
      await fetchWarehouses()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al eliminar almacén'
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
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchSector(id: number) {
    isLoading.value = true
    error.value = null
    try {
      const response = await sectorsService.getSector(id)
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar sector'
    } finally {
      isLoading.value = false
    }
  }

  async function updateSector(id: number, name: string) {
    error.value = null
    try {
      await sectorsService.updateSector(id, { id, name })
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al actualizar sector'
      throw err
    }
  }

  async function deleteSector(id: number) {
    error.value = null
    try {
      await sectorsService.deleteSector(id)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al eliminar sector'
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
