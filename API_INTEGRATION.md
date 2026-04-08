# Integración de Backend - Guía de Desarrollo

## Descripción General

Este proyecto Frontend está completamente integrado con el API de BancoAnchoas. A continuación se detalla la estructura de servicios, stores y composables implementados.

## 📁 Estructura del Proyecto

```
src/
├── services/           # Servicios API
│   ├── api.ts         # Configuración axios + interceptores
│   ├── categories.service.ts
│   ├── products.service.ts
│   ├── stock.service.ts
│   ├── warehouses.service.ts
│   ├── users.service.ts
│   ├── notifications.service.ts
│   └── index.ts       # Exportación centralizada
├── stores/            # Stores Pinia (estado global)
│   ├── categories.store.ts
│   ├── products.store.ts
│   ├── notifications.store.ts
│   ├── warehouses.store.ts
│   └── index.ts       # Exportación centralizada
├── composables/       # Composables reutilizables
│   ├── useAuth.ts
│   ├── useCategories.ts
│   ├── useProducts.ts
│   ├── useStock.ts
│   ├── useWarehouses.ts
│   ├── useUsers.ts
│   ├── useNotifications.ts
│   └── index.ts       # Exportación centralizada
├── types/
│   └── api.types.ts   # Interfaces y enums del API
└── utils/
    ├── formatters.ts
    ├── enums.helper.ts
    └── validators.ts
```

## 🚀 Configuración Inicial

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto basado en `.env.example`:

```bash
VITE_API_BASE_URL=http://localhost:5001/api
VITE_APP_NAME=BancoAnchoas
VITE_APP_ENV=development
VITE_API_TIMEOUT=30000
```

### Instalación de Dependencias

```bash
npm install
```

## 🔐 Autenticación

### Flujo de Login

```typescript
import { useAuth } from '@/composables'

export default {
  setup() {
    const { login, isLoading, error } = useAuth()

    async function handleLogin(credentials: { email: string; password: string }) {
      const success = await login(credentials)
      if (success) {
        // Redirigir a dashboard
        router.push({ name: 'dashboard' })
      }
    }

    return { login: handleLogin, isLoading, error }
  }
}
```

### Verificación de Autenticación

```typescript
import { useAuth } from '@/composables'

export default {
  setup() {
    const { isAuthenticated, user, hasRole } = useAuth()

    const isAdmin = hasRole('Admin')
    const isAlmacenista = hasRole('Almacenista')

    return { isAuthenticated, user, isAdmin, isAlmacenista }
  }
}
```

## 📦 Uso de Servicios

### Opciones 1: Directamente en componentes

```typescript
import { productsService } from '@/services'

// Obtener lista de productos
const { data } = await productsService.getProducts({
  pageNumber: 1,
  pageSize: 20,
  search: 'anchoas'
})

// Crear un producto
const newId = await productsService.createProduct({
  name: 'Mi Producto',
  sku: 'PROD-001',
  categoryId: 1,
  stock: 100,
  minimumStock: 10,
  unit: 'un'
})
```

### Opciones 2: Usando Composables (Recomendado)

```typescript
import { useProducts } from '@/composables'

export default {
  setup() {
    const { products, isLoading, error, fetchProducts } = useProducts()

    onMounted(() => {
      fetchProducts({ pageNumber: 1, pageSize: 20 })
    })

    return { products, isLoading, error, fetchProducts }
  }
}
```

### Opciones 3: Usando Stores (Para estado global)

```typescript
import { useProductsStore } from '@/stores'

export default {
  setup() {
    const productsStore = useProductsStore()

    onMounted(() => {
      productsStore.fetchProducts()
    })

    return {
      products: computed(() => productsStore.products),
      isLoading: computed(() => productsStore.isLoading)
    }
  }
}
```

## 🛒 Ejemplos de Uso Comunes

### Obtener Categorías

```typescript
// Opción 1: Store (recomendado para datos que se reutilizan)
const categoriesStore = useCategoriesStore()
await categoriesStore.fetchCategories()

const options = computed(() =>
  categoriesStore.categories.map(cat => ({
    value: cat.id,
    title: cat.name
  }))
)

// Opción 2: Composable (para componentes específicos)
const { categories, fetchCategories } = useCategories()
await fetchCategories()
```

### Registrar Movimiento de Stock

```typescript
import { useStock } from '@/composables'
import { MovementType } from '@/types/api.types'

export default {
  setup() {
    const { registerMovement, isLoading, error } = useStock()

    async function registerEntry() {
      try {
        const movementId = await registerMovement({
          productId: 1,
          sectorId: 3,
          quantity: 50,
          type: MovementType.Entry,
          notes: 'Recepción de pedido'
        })
        // Success!
      } catch (err) {
        console.error('Error:', error.value)
      }
    }

    return { registerEntry, isLoading, error }
  }
}
```

### Buscar Productos

```typescript
import { useProducts } from '@/composables'

export default {
  setup() {
    const { fetchProducts } = useProducts()

    async function searchProducts(query: string) {
      await fetchProducts({
        search: query,
        pageNumber: 1,
        pageSize: 20
      })
    }

    return { searchProducts }
  }
}
```

### Obtener Notificaciones

```typescript
import { useNotificationsStore } from '@/stores'

export default {
  setup() {
    const notifStore = useNotificationsStore()

    onMounted(() => {
      notifStore.fetchUnreadCount()
      notifStore.fetchNotifications()
    })

    return {
      hasUnread: computed(() => notifStore.hasUnread),
      unreadCount: computed(() => notifStore.unreadCount),
      notifications: computed(() => notifStore.notifications)
    }
  }
}
```

## 📋 API Types

Todos los tipos están disponibles en `@/types/api.types`:

```typescript
import type {
  CategoryDto,
  ProductDto,
  StockMovementDto,
  WarehouseDto,
  UserDto,
  NotificationDto,
  MovementType,
  AdjustmentType,
  MovementReason,
  NotificationType
} from '@/types/api.types'
```

## 🛠️ Helpers Disponibles

### Formatters

```typescript
import { 
  formatDate, 
  formatDateTime, 
  formatCurrency, 
  formatNumber,
  truncate,
  formatRelativeTime 
} from '@/utils/formatters'

formatDate('2026-04-07T10:30:00Z') // "07/04/2026"
formatDateTime('2026-04-07T10:30:00Z') // "07/04/2026 10:30"
formatCurrency(1234.56) // "1.234,56 €"
formatNumber(1234.56, 2) // "1.234,56"
```

### Enum Helpers

```typescript
import {
  getMovementTypeLabel,
  getMovementReasonLabel,
  getNotificationTypeLabel,
  getUserRoleLabel,
  getProductUnitLabel
} from '@/utils/enums.helper'

getMovementTypeLabel(0) // "Entrada"
getMovementReasonLabel(1) // "Daño"
getNotificationTypeLabel(0) // "Stock bajo"
getUserRoleLabel('Admin') // "Administrador"
getProductUnitLabel('kg') // "Kilogramos"
```

## 🔄 Guards y Protección de Rutas

Las rutas están protegidas automáticamente basadas en `meta`:

```typescript
{
  path: '/categories',
  name: 'categories',
  meta: {
    requiresAuth: true,  // Requiere estar autenticado
    role: 'Admin'        // Requiere rol Admin
  }
}
```

Si un usuario no autenticado intenta acceder → redirige a login
Si un usuario sin permisos intenta acceder → redirige a unauthorized

## ⚠️ Manejo de Errores

### En Servicios

```typescript
try {
  await productsService.createProduct(data)
} catch (err: any) {
  // err.response?.data?.errors -> Errores de validación
  // err.response?.status -> 400, 403, 404, 500, etc.
  // err.message -> Mensaje de error
}
```

### En Composables

```typescript
const { error } = useProducts()

// El error se actualiza automáticamente
watch(() => error.value, (newError) => {
  if (newError) {
    // Mostrar notificación de error
  }
})
```

## 📱 Integración con Vuetify

Los componentes están optimizados para Vuetify. Ejemplo:

```vue
<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="products"
          :loading="isLoading"
          :items-per-page="pageSize"
        >
          <template v-slot:item.price="{ item }">
            {{ formatCurrency(item.price) }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useProducts } from '@/composables'
import { formatCurrency } from '@/utils/formatters'

const { products, isLoading, pageSize, fetchProducts } = useProducts()

const headers = [
  { title: 'Nombre', key: 'name' },
  { title: 'SKU', key: 'sku' },
  { title: 'Stock', key: 'stock' },
  { title: 'Precio', key: 'price' }
]
</script>
```

## 🔗 Endpoints Disponibles

| Módulo | Servicios |
|--------|-----------|
| **Auth** | login, getProfile |
| **Categorías** | getCategories, getCategory, createCategory, updateCategory, deleteCategory |
| **Productos** | getProducts, getProduct, getProductByBarcode, getLowStockProducts, getExpiringProducts, createProduct, updateProduct, deleteProduct |
| **Stock** | registerMovement, registerWriteOff, registerRelocation, registerAdjustment, getMovementHistory, getWriteOffs |
| **Almacenes** | getWarehouses, getWarehouse, createWarehouse, updateWarehouse, deleteWarehouse, getWarehouseSectors |
| **Usuarios** | getUsers, createUser, updateUser, deleteUser |
| **Notificaciones** | getNotifications, getUnreadCount, markAsRead, markAllAsRead |

## 📚 Documentación Completa del Backend

Consultar `frontend-api-guide.md` para la especificación completa del API, incluyendo:
- Estructura de respuestas
- Validaciones
- Reglas de negocio
- Tipos avanzados

## 🐛 Debugging

### Ver estado de autenticación

```typescript
import { useAuthStore } from '@/stores'

const auth = useAuthStore()
console.log({
  token: auth.token,
  user: auth.user,
  isAuthenticated: auth.isAuthenticated
})
```

### Ver valores del store

```typescript
import { useProductsStore } from '@/stores'

const store = useProductsStore()
console.log({
  products: store.products,
  isLoading: store.isLoading,
  error: store.error
})
```

## ✅ Checklist para Iniciar un Componente

- [ ] Importar composable o store necesario
- [ ] Llamar a `fetch*` en `onMounted`
- [ ] Mostrar loader mientras `isLoading` sea true
- [ ] Mostrar `error` si ocurre
- [ ] Formatear datos con helpers (dates, currency, etc.)
- [ ] Usar tipos TypeScript para props y events
- [ ] Proteger rutas en router si es necesario

---

**Última actualización:** 7 de abril de 2026
**Versión del API:** 1.0
