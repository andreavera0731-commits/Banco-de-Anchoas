import { ref, computed } from 'vue'
import { productsService } from '@/services/products.service'
import { extractError } from '@/utils/errors'
import type {
  ProductListDto,
  ProductDto,
  CreateProductRequest,
  UpdateProductRequest,
  GetProductsParams,
} from '@/types/api.types'

export function useProducts() {
  const products = ref<ProductListDto[]>([])
  const productDetail = ref<ProductDto | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const pageNumber = ref(1)
  const pageSize = ref(20)
  const totalCount = ref(0)
  const totalPages = ref(0)
  let lastParams: GetProductsParams | undefined

  const paginationInfo = computed(() => ({
    pageNumber: pageNumber.value,
    pageSize: pageSize.value,
    totalCount: totalCount.value,
    totalPages: totalPages.value,
  }))

  async function fetchProducts(params?: GetProductsParams) {
    if (params) lastParams = params
    isLoading.value = true
    error.value = null
    try {
      const response = await productsService.getAll(params ?? lastParams)
      products.value = response.data.data.items
      pageNumber.value = response.data.data.pageNumber
      totalCount.value = response.data.data.totalCount
      totalPages.value = response.data.data.totalPages
    } catch (err) {
      error.value = extractError(err)
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
    } catch (err) {
      error.value = extractError(err)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchProductByBarcode(barcode: string) {
    error.value = null
    try {
      const response = await productsService.getByBarcode(barcode)
      productDetail.value = response.data.data
      return productDetail.value
    } catch (err) {
      error.value = extractError(err)
    }
  }

  async function fetchLowStockProducts() {
    error.value = null
    try {
      const response = await productsService.getLowStock()
      return response.data.data
    } catch (err) {
      error.value = extractError(err)
    }
  }

  async function fetchExpiringProducts() {
    error.value = null
    try {
      const response = await productsService.getExpiring()
      return response.data.data
    } catch (err) {
      error.value = extractError(err)
    }
  }

  async function createProduct(data: CreateProductRequest) {
    error.value = null
    try {
      const response = await productsService.create(data)
      await fetchProducts()
      return response.data.data
    } catch (err) {
      error.value = extractError(err)
      throw err
    }
  }

  async function updateProduct(id: number, data: UpdateProductRequest) {
    error.value = null
    try {
      await productsService.update(id, data)
      await fetchProducts()
    } catch (err) {
      error.value = extractError(err)
      throw err
    }
  }

  async function deleteProduct(id: number) {
    error.value = null
    try {
      await productsService.delete(id)
      await fetchProducts()
    } catch (err) {
      error.value = extractError(err)
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
