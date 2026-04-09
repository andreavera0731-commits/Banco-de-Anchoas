import { ref, computed } from 'vue'
import { categoriesService } from '@/services/categories.service'
import { extractError } from '@/utils/errors'
import type { CategoryDto, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/api.types'

export function useCategories() {
  const categories = ref<CategoryDto[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const categoryOptions = computed(() =>
    categories.value.map((cat) => ({
      value: cat.id,
      title: cat.name,
    })),
  )

  async function fetchCategories() {
    isLoading.value = true
    error.value = null
    try {
      const response = await categoriesService.getAll()
      categories.value = response.data.data
    } catch (err) {
      error.value = extractError(err)
    } finally {
      isLoading.value = false
    }
  }

  async function createCategory(data: CreateCategoryRequest) {
    error.value = null
    try {
      await categoriesService.create(data)
      await fetchCategories()
    } catch (err) {
      error.value = extractError(err)
      throw err
    }
  }

  async function updateCategory(id: number, data: UpdateCategoryRequest) {
    error.value = null
    try {
      await categoriesService.update(id, data)
      await fetchCategories()
    } catch (err) {
      error.value = extractError(err)
      throw err
    }
  }

  async function deleteCategory(id: number) {
    error.value = null
    try {
      await categoriesService.delete(id)
      await fetchCategories()
    } catch (err) {
      error.value = extractError(err)
      throw err
    }
  }

  return {
    categories,
    categoryOptions,
    isLoading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  }
}
