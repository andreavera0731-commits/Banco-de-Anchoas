import { defineStore } from 'pinia'
import { ref } from 'vue'
import { categoriesService } from '@/services/categories.service'
import type { CategoryDto } from '@/types/api.types'

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref<CategoryDto[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const lastFetch = ref<number>(0)

  // Cache por 5 minutos
  const CACHE_DURATION = 5 * 60 * 1000

  async function fetchCategories() {
    const now = Date.now()
    if (categories.value.length > 0 && now - lastFetch.value < CACHE_DURATION) {
      return categories.value
    }

    isLoading.value = true
    error.value = null
    try {
      const response = await categoriesService.getCategories()
      categories.value = response.data.data
      lastFetch.value = now
      return categories.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar categorías'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function clearCache() {
    categories.value = []
    lastFetch.value = 0
  }

  return {
    categories,
    isLoading,
    error,
    fetchCategories,
    clearCache,
  }
})
