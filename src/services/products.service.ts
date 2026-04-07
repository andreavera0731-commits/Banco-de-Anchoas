import api from './api'
import type {
  ApiResponse,
  PaginatedList,
  ProductDto,
  ProductListDto,
  CreateProductRequest,
  UpdateProductRequest,
  GetProductsParams,
} from '@/types/api.types'

export const productsService = {
  getAll(params?: GetProductsParams) {
    return api.get<ApiResponse<PaginatedList<ProductListDto>>>('/products', { params })
  },

  getById(id: number) {
    return api.get<ApiResponse<ProductDto>>(`/products/${id}`)
  },

  getByBarcode(barcode: string) {
    return api.get<ApiResponse<ProductDto>>(`/products/by-barcode/${encodeURIComponent(barcode)}`)
  },

  getLowStock() {
    return api.get<ApiResponse<ProductListDto[]>>('/products/low-stock')
  },

  getExpiring() {
    return api.get<ApiResponse<ProductListDto[]>>('/products/expiring')
  },

  create(data: CreateProductRequest) {
    return api.post<ApiResponse<number>>('/products', data)
  },

  update(id: number, data: UpdateProductRequest) {
    return api.put(`/products/${id}`, data)
  },

  delete(id: number) {
    return api.delete(`/products/${id}`)
  },
}
