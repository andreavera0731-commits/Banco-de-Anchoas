import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { productsService } from '@/services/products.service'
import type { ProductListDto, ProductDto, GetProductsParams } from '@/types/api.types'

export function useProducts() {
  const { t } = useI18n()
  const products = ref<ProductListDto[]>([])
  const productDetail = ref<ProductDto | null>(null)
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
    } finally {
      isLoading.value = false
    }
  }

  async function fetchProduct(id: number) {
    isLoading.value = true
    error.value = null
    try {
      const response = await productsService.getById(id)
      productDetail.value = response.data.data
      return productDetail.value
    } catch (err: any) {
      error.value = err.response?.data?.message || t('errors.loadProduct')
    } finally {
      isLoading.value = false
    }
  }

  async function fetchProductByBarcode(barcode: string) {
    isLoading.value = true
    error.value = null
    try {
      const response = await productsService.getByBarcode(barcode)
      productDetail.value = response.data.data
      return productDetail.value
    } catch (err: any) {
      error.value = err.response?.data?.message || t('errors.productNotFound')
    } finally {
      isLoading.value = false
    }
  }

  async function fetchLowStockProducts() {
    isLoading.value = true
    error.value = null
    try {
      const response = await productsService.getLowStock()
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || t('errors.loadLowStock')
    } finally {
      isLoading.value = false
    }
  }

  async function fetchExpiringProducts() {
    isLoading.value = true
    error.value = null
    try {
      const response = await productsService.getExpiring()
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || t('errors.loadExpiring')
    } finally {
      isLoading.value = false
    }
  }

  async function createProduct(data: any) {
    error.value = null
    try {
      const response = await productsService.create(data)
      await fetchProducts()
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.errors || err.response?.data?.message || t('errors.createProduct')
      throw err
    }
  }

  async function updateProduct(id: number, data: any) {
    error.value = null
    try {
      await productsService.update(id, { ...data, id })
      await fetchProducts()
    } catch (err: any) {
      error.value = err.response?.data?.errors || err.response?.data?.message || t('errors.updateProduct')
      throw err
    }
  }

  async function deleteProduct(id: number) {
    error.value = null
    try {
      await productsService.delete(id)
      await fetchProducts()
    } catch (err: any) {
      error.value = err.response?.data?.message || t('errors.deleteProduct')
      throw err
    }
  }

  return {
    products,
    productDetail,
    isLoading,
    error,
    paginationInfo,
    fetchProducts,
    fetchProduct,
    fetchProductByBarcode,
    fetchLowStockProducts,
    fetchExpiringProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  }
}
