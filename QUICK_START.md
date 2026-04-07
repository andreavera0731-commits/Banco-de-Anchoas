# 🚀 Guía Rápida de Inicio

## Estructura Implementada

### ✅ Servicios API (`src/services/`)
- `api.ts` - Configuración de Axios con interceptores JWT
- `categories.service.ts` - Gestión de categorías
- `products.service.ts` - Gestión de productos
- `stock.service.ts` - Movimientos y ajustes de stock
- `warehouses.service.ts` - Almacenes y sectores
- `users.service.ts` - Gestión de usuarios (Admin)
- `notifications.service.ts` - Notificaciones

### ✅ Stores Pinia (`src/stores/`)
- `auth.store.ts` - Estado de autenticación (en features/auth)
- `categories.store.ts` - Cache de categorías
- `products.store.ts` - Cache de productos
- `notifications.store.ts` - Notificaciones en tiempo real
- `warehouses.store.ts` - Almacenes y sectores

### ✅ Composables (`src/composables/`)
- `useAuth.ts` - Hook de autenticación (en features/auth)
- `useCategories.ts` - Lógica de categorías
- `useProducts.ts` - Lógica de productos
- `useStock.ts` - Lógica de movimientos de stock
- `useWarehouses.ts` - Lógica de almacenes
- `useUsers.ts` - Lógica de usuarios
- `useNotifications.ts` - Lógica de notificaciones

### ✅ Tipos (`src/types/api.types.ts`)
- Interfaces para todos los DTOs
- Enums: `MovementType`, `AdjustmentType`, `MovementReason`, etc.
- Tipos personalizados: `UserRole`, `ProductUnit`

### ✅ Utils
- `formatters.ts` - Formatos de fechas, moneda, etc.
- `enums.helper.ts` - Convertidores de enums a etiquetas
- `validators.ts` - Validaciones de formularios

### ✅ Router
- `guards.ts` - Protección de rutas
- `routes.ts` - Rutas actualizadas con roles

### ✅ Plugins
- `auth.ts` - Plugin para inicialización de autenticación

## Acceso Rápido

### Importar Servicios
```typescript
import { productsService, stockService } from '@/services'
```

### Usar Composables
```typescript
import { useProducts, useStock } from '@/composables'

const { products, isLoading, fetchProducts } = useProducts()
```

### Usar Stores
```typescript
import { useCategoriesStore, useNotificationsStore } from '@/stores'

const categoriesStore = useCategoriesStore()
```

### Variables de Entorno
```bash
VITE_API_BASE_URL=http://localhost:5001/api
```

## Flujos Comunes

### 1. Login
```typescript
import { useAuth } from '@/composables'

const { login, error } = useAuth()
await login({ email: 'user@example.com', password: 'pass123' })
```

### 2. Cargar Lista de Productos
```typescript
import { useProducts } from '@/composables'

const { fetchProducts, products } = useProducts()
await fetchProducts({ pageNumber: 1, pageSize: 20 })
```

### 3. Crear Producto
```typescript
import { useProducts } from '@/composables'

const { createProduct } = useProducts()
await createProduct({
  name: 'Mi Producto',
  categoryId: 1,
  stock: 100,
  minimumStock: 10,
  unit: 'un'
})
```

### 4. Registrar Entrada de Stock
```typescript
import { useStock, MovementType } from '@/composables'
import { MovementType } from '@/types/api.types'

const { registerMovement } = useStock()
await registerMovement({
  productId: 1,
  sectorId: 3,
  quantity: 50,
  type: MovementType.Entry
})
```

### 5. Obtener Notificaciones
```typescript
import { useNotificationsStore } from '@/stores'

const notifStore = useNotificationsStore()
await notifStore.fetchNotifications()
await notifStore.markAsRead(notificationId)
```

## Documentación Completa
→ Ver `API_INTEGRATION.md`

## Checklist Antes de Usar

- [ ] Variables de entorno configuradas en `.env`
- [ ] Backend corriendo en `http://localhost:5001`
- [ ] JWT interceptor funcionando
- [ ] Rutas protegidas por authGuard
- [ ] Stores inicializadas con Pinia
- [ ] i18n configurado

---

**¡Listo para desarrollar! 🎉**
