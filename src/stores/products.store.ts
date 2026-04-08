import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { productsService } from '@/services/products.service'
import type { ProductListDto, ProductDto, GetProductsParams } from '@/types/api.types'

export const useProductsStore = defineStore('products', () => {
  const { t } = useI18n()
  const products = ref<ProductListDto[]>([])
  const productDetails = ref<Map<number, ProductDto>>(new Map())
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const pageNumber = ref(1)
  const pageSize = ref(20)
  const totalCount = ref(0)
  const totalPages = ref(0)

  const paginationInfo = computed(() => ({
    pageNumber: pageNumber.value,
    pageSize: pageSize.value,
    totalCount: totalCount.value,
    totalPages: totalPages.value,
  }))

  async function fetchProducts(params?: GetProductsParams) {
    isLoading.value = true
    error.value = null
    try {
      const response = await productsService.getAll(params)
      products.value = response.data.data.items
      pageNumber.value = response.data.data.pageNumber
      totalCount.value = response.data.data.totalCount
      totalPages.value = response.data.data.totalPages
    } catch (err: any) {
      error.value = err.response?.data?.message || t('errors.loadProducts')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function fetchProductDetail(id: number) {
    // Usar cache si existe
    if (productDetails.value.has(id)) {
      return productDetails.value.get(id)
    }

    isLoading.value = true
    error.value = null
    try {
      const response = await productsService.getById(id)
      const product = response.data.data
      productDetails.value.set(id, product)
      return product
    } catch (err: any) {
      error.value = err.response?.data?.message || t('errors.loadProduct')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function searchProducts(search: string, categoryId?: number) {
    return fetchProducts({
      search,
      categoryId,
      pageNumber: 1,
      pageSize: pageSize.value,
    })
  }

  function clearCache() {
    products.value = []
    productDetails.value.clear()
    pageNumber.value = 1
  }

  return {
    products,
    productDetails,
    isLoading,
    error,
    paginationInfo,
    fetchProducts,
    fetchProductDetail,
    searchProducts,
    clearCache,
  }
})
