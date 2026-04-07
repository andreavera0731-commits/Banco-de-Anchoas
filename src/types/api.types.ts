// ============================================================
// RESPUESTAS GENÉRICAS
// ============================================================

export interface ApiResponse<T> {
  data: T
  message: string | null
}

export interface PaginatedList<T> {
  items: T[]
  pageNumber: number
  totalPages: number
  totalCount: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface ErrorResponse {
  succeeded: false
  message: string
  errors: Record<string, string[]> | null
}

export interface ApiError {
  message: string
  code?: string
}

// ============================================================
// ENUMS
// ============================================================

export enum MovementType {
  Entry = 0,
  Exit = 1,
  WriteOff = 2,
  Relocation = 3,
  Adjustment = 4,
}

export enum AdjustmentType {
  Increase = 0,
  Decrease = 1,
}

export enum MovementReason {
  Expiration = 0,
  Damage = 1,
  Loss = 2,
  Other = 3,
}

export enum NotificationType {
  LowStock = 0,
  Expiring = 1,
  Expired = 2,
}

export enum OrderStatus {
  Pending = 0,
  Processing = 1,
  Completed = 2,
  Cancelled = 3,
}

export type UserRole = 'Admin' | 'Almacenista'
export type ProductUnit = 'kg' | 'g' | 'un' | 'lt' | 'ml'

// ============================================================
// CATEGORÍAS
// ============================================================

export interface CategoryDto {
  id: number
  name: string
  description: string | null
  createdAt: string
}

export interface CreateCategoryRequest {
  name: string
  description?: string | null
}

export interface UpdateCategoryRequest {
  id: number
  name: string
  description?: string | null
}

// ============================================================
// PRODUCTOS
// ============================================================

export interface ProductDto {
  id: number
  name: string
  description: string | null
  sku: string
  barcode: string | null
  price: number | null
  unit: ProductUnit
  stock: number
  minimumStock: number
  expirationDate: string | null
  supplier: string | null
  categoryId: number
  categoryName: string
  defaultSectorId: number | null
  createdAt: string
  updatedAt: string | null
}

export interface ProductListDto {
  id: number
  name: string
  sku: string
  barcode: string | null
  unit: ProductUnit
  stock: number
  minimumStock: number
  categoryName: string
}

export interface CreateProductRequest {
  name: string
  description?: string | null
  barcode?: string | null
  price?: number | null
  unit: ProductUnit
  stock: number
  minimumStock: number
  expirationDate?: string | null
  supplier?: string | null
  categoryId: number
  defaultSectorId?: number | null
}

export interface UpdateProductRequest {
  id: number
  name: string
  description?: string | null
  barcode?: string | null
  price?: number | null
  unit: ProductUnit
  minimumStock: number
  expirationDate?: string | null
  supplier?: string | null
  categoryId: number
  defaultSectorId?: number | null
}

export interface GetProductsParams {
  search?: string
  categoryId?: number
  pageNumber?: number
  pageSize?: number
}

// ============================================================
// STOCK / MOVIMIENTOS
// ============================================================

export interface StockMovementDto {
  id: number
  quantity: number
  type: MovementType
  adjustmentType: AdjustmentType | null
  reason: MovementReason | null
  notes: string | null
  productId: number
  productName: string
  sectorId: number
  sectorName: string
  fromSectorId: number | null
  fromSectorName: string | null
  userId: string
  createdAt: string
}

export interface RegisterMovementRequest {
  productId: number
  sectorId: number
  quantity: number
  type: MovementType.Entry | MovementType.Exit
  notes?: string | null
}

export interface RegisterWriteOffRequest {
  productId: number
  sectorId: number
  quantity: number
  reason: MovementReason
  notes?: string | null
}

export interface RegisterRelocationRequest {
  productId: number
  fromSectorId: number
  sectorId: number
  quantity: number
  notes?: string | null
}

export interface RegisterAdjustmentRequest {
  productId: number
  sectorId: number
  quantity: number
  adjustmentType: AdjustmentType
  reason?: MovementReason | null
  notes?: string | null
}

export interface GetMovementHistoryParams {
  productId?: number
  sectorId?: number
  type?: MovementType
  from?: string
  to?: string
  pageNumber?: number
  pageSize?: number
}

export interface GetWriteOffsParams {
  reason?: MovementReason
}

// ============================================================
// ALMACENES (WAREHOUSES)
// ============================================================

export interface WarehouseDto {
  id: number
  name: string
  location: string | null
  createdAt: string
}

export interface CreateWarehouseRequest {
  name: string
  location?: string | null
}

export interface UpdateWarehouseRequest {
  id: number
  name: string
  location?: string | null
}

// ============================================================
// SECTORES
// ============================================================

export interface SectorDto {
  id: number
  name: string
  warehouseId: number
  warehouseName: string
  categories: SectorCategoryDto[]
  createdAt: string
}

export interface SectorCategoryDto {
  id: number
  name: string
}

export interface CreateSectorRequest {
  name: string
  warehouseId: number
}

export interface UpdateSectorRequest {
  id: number
  name: string
}

// ============================================================
// USUARIOS
// ============================================================

export interface UserDto {
  id: string
  email: string
  name: string
  role: string
  isActive: boolean
}

export interface CreateUserRequest {
  email: string
  name: string
  password: string
  role: UserRole
}

export interface UpdateUserRequest {
  id: string
  name?: string | null
  email?: string | null
  role?: UserRole | null
}

// ============================================================
// NOTIFICACIONES
// ============================================================

export interface NotificationDto {
  id: number
  title: string
  message: string
  type: NotificationType
  productId: number | null
  isRead: boolean
  readAt: string | null
  createdAt: string
}

export interface GetNotificationsParams {
  isRead?: boolean
  pageNumber?: number
  pageSize?: number
}
