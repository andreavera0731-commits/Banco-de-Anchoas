import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { categoriesService } from '@/services/categories.service'
import type { CategoryDto } from '@/types/api.types'

export function useCategories() {
  const { t } = useI18n()
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
    } catch (err: any) {
      error.value = err.response?.data?.message || t('errors.loadCategories')
    } finally {
      isLoading.value = false
    }
  }

  async function createCategory(name: string, description?: string) {
    error.value = null
    try {
      const response = await categoriesService.create({
        name,
        description: description || null,
      })
      const newId = response.data.data
      await fetchCategories()
      return newId
    } catch (err: any) {
      error.value = err.response?.data?.message || t('errors.createCategory')
      throw err
    }
  }

  async function updateCategory(id: number, name: string, description?: string) {
    error.value = null
    try {
      await categoriesService.update(id, {
        id,
        name,
        description: description || null,
      })
      await fetchCategories()
    } catch (err: any) {
      error.value = err.response?.data?.message || t('errors.updateCategory')
      throw err
    }
  }

  async function deleteCategory(id: number) {
    error.value = null
    try {
      await categoriesService.delete(id)
      await fetchCategories()
    } catch (err: any) {
      error.value = err.response?.data?.message || t('errors.deleteCategory')
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
