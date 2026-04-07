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
  // Obtener productos paginados
  getProducts(params?: GetProductsParams) {
    return api.get<ApiResponse<PaginatedList<ProductListDto>>>('/products', { params })
  },

  // Obtener detalle de un producto
  getProduct(id: number) {
    return api.get<ApiResponse<ProductDto>>(`/products/${id}`)
  },

  // Obtener producto por código de barras
  getProductByBarcode(barcode: string) {
    return api.get<ApiResponse<ProductDto>>(`/products/by-barcode/${barcode}`)
  },

  // Obtener productos con stock bajo
  getLowStockProducts() {
    return api.get<ApiResponse<ProductListDto[]>>('/products/low-stock')
  },

  // Obtener productos próximos a vencer
  getExpiringProducts() {
    return api.get<ApiResponse<ProductListDto[]>>('/products/expiring')
  },

  // Crear un nuevo producto
  createProduct(data: CreateProductRequest) {
    return api.post<ApiResponse<number>>('/products', data)
  },

  // Actualizar un producto
  updateProduct(id: number, data: UpdateProductRequest) {
    return api.put(`/products/${id}`, data)
  },

  // Eliminar un producto
  deleteProduct(id: number) {
    return api.delete(`/products/${id}`)
  },
}
