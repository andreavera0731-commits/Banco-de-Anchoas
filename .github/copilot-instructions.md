# Banco de Anchoas — Copilot Instructions

## Project Overview

Warehouse/inventory management system ("Banco de Anchoas") with a Vue 3 frontend and .NET backend API.

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Vue 3 (`<script setup>` + TypeScript) | beta |
| UI Library | Vuetify | 4.0.1 |
| State | Pinia | 3 |
| Router | Vue Router | 5 |
| i18n | vue-i18n | 11 |
| HTTP | Axios (JWT interceptor) | 1.13 |
| Build | Vite | latest |
| Tests | Vitest | 4 |
| Icons | @mdi/font (Material Design Icons) | |
| Backend URL | `http://localhost:5128/api` | |

## Project Structure

```
src/
  assets/             # base.css (design tokens), main.css (globals, animations, utilities)
  components/         # Shell + reusable: AppHeader, AppSidebar, AppFooter, BaseDataTable
  composables/        # ALL data composables live here (useProducts, useUsers, useCategories, etc.)
    index.ts          # Re-exports all composables
    useSnackbar.ts    # Feedback toast (every CRUD view uses this)
    useNavigation.ts  # Sidebar nav items + role filtering
    useTheme.ts       # Dark/light toggle + localStorage persistence
    useLoading.ts     # Simple isLoading state (rarely used)
    useNotification.ts # Global notification array (in-app, NOT API notifications)
    useProducts.ts    # Products CRUD + pagination + barcode lookup
    useUsers.ts       # Users CRUD (no pagination)
    useCategories.ts  # Categories CRUD
    useWarehouses.ts  # Warehouses + sectors CRUD
    useStock.ts       # Stock movements, write-offs, relocations, adjustments
    useNotifications.ts # API notifications (fetch, markAsRead, unreadCount)
  features/           # Feature modules (views + feature-specific components)
    auth/             # ✅ COMPLETE — Login, store, service, composable, types, tests
    products/         # ✅ COMPLETE — List + detail + stepper form + delete dialog
    users/            # ✅ COMPLETE — List + form dialog + delete dialog
    categories/       # ⬜ STUB — View placeholder only
    warehouses/       # ⬜ STUB — View placeholder only
    stock/            # ⬜ STUB — View placeholder only
    notifications/    # ⬜ STUB — View placeholder only
    dashboard/        # ⬜ STUB — Unused (/ redirects to products)
  i18n/               # index.ts + locales/ (es.ts, en.ts)
  layouts/            # AuthLayout (login), DefaultLayout (shell with header+sidebar+footer)
  plugins/            # vuetify.ts (theme + component defaults), pinia.ts, index.ts
  router/             # index.ts, routes.ts (11 routes), guards.ts (auth + role check)
  services/           # ALL API services live here (api.ts + one per entity)
    index.ts          # Re-exports all services
    api.ts            # Axios instance, Bearer interceptor, 401 auto-logout
    products.service.ts, users.service.ts, categories.service.ts,
    warehouses.service.ts, sectors.service.ts, stock.service.ts,
    notifications.service.ts
  stores/             # Pinia stores (only auth.store is fully implemented)
  types/              # api.types.ts (ALL DTOs, enums, request types), auth.types.ts
  utils/              # errors.ts, formatters.ts, validators.ts, enums.helper.ts
  views/              # UnauthorizedView, NotFoundView (both link to products)
```

### Key Architecture Decisions

- **Services** live in `src/services/` (not inside features) — shared across the app
- **Data composables** live in `src/composables/` (not inside features) — they wrap services
- **Only auth** keeps its service/composable/store/types inside `src/features/auth/` (self-contained feature)
- **Feature folders** (`src/features/<name>/`) contain only `views/` and `components/` specific to that feature
- **Barrel exports**: `src/composables/index.ts` and `src/services/index.ts` re-export everything

## Design System Rules

### Tokens — NEVER hardcode colors or sizes

- **Vuetify theme colors**: `rgb(var(--v-theme-primary))`, `rgb(var(--v-theme-surface))`, etc.
- **Custom tokens** (`--bda-*`): Defined in `src/assets/base.css`. Typography, spacing (4px grid), radii, shadows, transitions, z-index.
- **Light/Dark variants**: Token values change automatically via `.v-theme--light` / `.v-theme--dark` selectors.

### Typography Scale

| Token | Size |
|-------|------|
| `--bda-font-display` | 2rem |
| `--bda-font-h1` | 1.5rem |
| `--bda-font-h2` | 1.25rem |
| `--bda-font-h3` | 1.1rem |
| `--bda-font-body` | 0.875rem |
| `--bda-font-caption` | 0.75rem |

### Spacing (4px base)

`--bda-space-{1..16}` → 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px

### Component Defaults (in `plugins/vuetify.ts`)

Global defaults are set for VBtn (`rounded="lg"`), VTextField/VSelect (`variant="outlined"`, `density="comfortable"`, `rounded="lg"`), VCard (`rounded="xl"`, `elevation=0`), VChip (`rounded="pill"`), VAlert (`variant="tonal"`, `rounded="lg"`), VNavigationDrawer (`elevation=0`), VDataTable (`hover=true`), VSkeletonLoader. **Do not repeat** props that already match defaults.

### Color Palette

Light: primary=#b8860b (gold), secondary=#1a1a2e, error=#c62828, success=#2e7d32, warning=#f57f17, info=#1565c0
Dark: primary=#d4a84b, secondary=#e0e0e0, error=#ef5350

### Utility Classes (in `main.css`)

- `.bda-gradient-btn` — Primary gradient CTA button
- `.bda-card-hover` — Card with hover lift effect
- `.bda-gradient-text` — Primary gradient text
- `.bda-truncate` — Single-line text ellipsis

### Transitions (in `main.css`)

- `page-*` — Route page transitions (fade + slide up)
- `stagger-*` — Staggered fade-in for lists
- `slide-right-*` — Drawer/panel slide
- `toast-*` — Notification toast pop

## Shell Layout Architecture

### AppHeader
- Clean app bar (elevation=0, border-bottom), no hamburger menu
- Left: app logo icon + name
- Right: user menu dropdown card with avatar (initials from name), theme toggle (sun/moon icon), language toggle (ES↔EN), logout
- Avatar initials: split name by whitespace, take first letter of first two words, uppercase
- Theme switching via `useThemeToggle()` → `theme.change(themeName)` (Vuetify 4 API)

### AppSidebar
- **Always permanent rail mode** with `expand-on-hover`, width=200
- Collapsed: icon only (~56px). Hover: expands showing icon + label
- Items: `density="compact"`, `prepend-icon`, `:title`, `rounded="lg"`, `color="primary"`
- **Role-filtered** via `useNavigation()` composable — items with `role: 'Admin'` only visible to admins

### AppFooter
- Ultra-compact: 24px height, `text-overline` at 0.6rem, copyright text only

### DefaultLayout
- Stacks: AppHeader → AppSidebar + v-main → AppFooter
- Both DefaultLayout and AuthLayout call `useThemeToggle().init()` on mount

## Coding Conventions

1. **SFC order**: `<template>` → `<script setup lang="ts">` → `<style scoped>`
2. **Composition API only** — no Options API
3. **TypeScript strict** — properly type all props, emits, refs. Use `UserRole` type (not raw strings)
4. **i18n all user-facing strings** — `t('key')` for strings, `tm('key')` for arrays. Define in both `es.ts` and `en.ts`
5. **Feature-first organization** — views + components go in `src/features/<name>/`
6. **Services return raw Axios response** — composables unwrap `.data.data`
7. **Auth roles**: `type UserRole = 'Admin' | 'Almacenista'` (in `api.types.ts`)
8. **User IDs are string GUIDs**, all other entity IDs are `number`
9. **Error extraction**: use shared `extractError()` from `src/utils/errors.ts` — returns `null` for unknown errors, views fallback to `t('errors.generic')`
10. **Home route is `products`** — `/` redirects to `products`, no dashboard

## API Integration

- Base Axios instance in `src/services/api.ts` with Bearer token interceptor
- 401 responses auto-redirect to login via `authStore.logout()`
- All API types in `src/types/api.types.ts`
- URL params always use `encodeURIComponent()`
- Response wrapper: `ApiResponse<T> { data: T; message: string | null }`
- Paginated responses: `PaginatedList<T> { items: T[]; pageNumber; totalPages; totalCount; hasPreviousPage; hasNextPage }`

### Available Services

| Service | Methods | Notes |
|---------|---------|-------|
| `productsService` | getAll(params?), getById, getByBarcode, getLowStock, getExpiring, create, update, delete | **Paginated** getAll with `GetProductsParams` |
| `usersService` | getAll, create, update, delete | **Not paginated** — flat array |
| `categoriesService` | getAll, getById, create, update, delete | Not paginated |
| `warehousesService` | getAll, getById, create, update, delete, getSectors, createSector | Sectors are children of warehouses |
| `sectorsService` | getById, update, delete | CRUD minus create (via warehousesService) |
| `stockService` | registerMovement, registerWriteOff, relocate, adjust, getHistory, getWriteOffs | History is **paginated** |
| `notificationsService` | getAll, getUnreadCount, markAsRead, markAllAsRead | **Paginated** getAll |

## Auth & Guards

- Auth store (`src/features/auth/stores/auth.store.ts`): `user`, `token`, `isAuthenticated`, `userRole`, `setSession()`, `logout()`, `hasRole(role)`
- Auth guard in `src/router/guards.ts`:
  1. No token + requiresAuth → redirect to `login`
  2. Authenticated going to login → redirect to `products`
  3. Authenticated but no user profile → fetch it (or logout on failure)
  4. Route has `meta.role` → check `hasRole()`, else redirect to `unauthorized`
- Routes declare `meta: { requiresAuth: true, role?: UserRole, layout: 'default' | 'auth' }`

---

## Shared Utilities

### `src/utils/errors.ts` — Error Extraction

```ts
import type { AxiosError } from 'axios'

interface ApiErrorData {
  message?: string
  errors?: string | Record<string, string[]>
}

export function extractError(err: unknown): string | null {
  const axiosErr = err as AxiosError<ApiErrorData>
  const data = axiosErr?.response?.data
  return data?.message ?? (typeof data?.errors === 'string' ? data.errors : null) ?? null
}
```

Used by data composables to extract error messages without importing i18n. Returns `null` on unknown errors — views provide i18n fallback.

### `src/utils/formatters.ts` — Display Formatters

| Function | Signature | Returns |
|----------|-----------|---------|
| `formatDate` | `(date: string \| Date)` | `DD/MM/YYYY` |
| `formatDateTime` | `(date: string \| Date)` | `DD/MM/YYYY HH:mm` |
| `formatCurrency` | `(amount, locale?, currency?)` | Formatted currency string |
| `formatNumber` | `(num, decimals?)` | Formatted number (es-ES) |
| `capitalize` | `(str)` | First letter uppercase |
| `truncate` | `(str, maxLength)` | Truncated with `...` |
| `formatRelativeTime` | `(date, t)` | `"hace X minutos"` etc. |
| `getStockColor` | `(stock, minimumStock)` | `'error'` if low, else `'success'` |

### `src/utils/validators.ts` — Validation Rules

Pure functions: `isValidEmail(email)`, `isValidPassword(password)`, `isRequired(value)`

Composable `useValidationRules()` returns Vuetify-compatible rule arrays:
- `rules.email` — required + valid format
- `rules.password` — required + min 8 chars
- `rules.required` — non-empty
- `rules.numberMin(min)` — required + >= min
- `rules.numberPositive` — required + > 0
- `rules.selectRequired` — not null/undefined/empty

### `src/utils/enums.helper.ts` — Enum Label Helpers

- `getNotificationTypeColor(type: number)` → Vuetify color string (pure function)
- `useEnumLabels()` composable → returns i18n-aware label getters for all enums:
  `getMovementTypeLabel`, `getAdjustmentTypeLabel`, `getMovementReasonLabel`, `getNotificationTypeLabel`, `getOrderStatusLabel`, `getUserRoleLabel`, `getProductUnitLabel`

---

## CRUD Patterns — Two Variants

The project uses two CRUD patterns depending on complexity. When building a new screen, choose the appropriate variant.

### Pattern A: Simple CRUD (Reference: Users)

Use for entities with few fields, no pagination, flat form. Files: `UsersView.vue`, `UserFormDialog.vue`, `UserDeleteDialog.vue`, `useUsers.ts`, `users.service.ts`.

### Pattern B: Complex CRUD (Reference: Products)

Use for entities with many fields, server pagination, multi-step form, detail view. Files: `ProductsView.vue`, `ProductDetailView.vue`, `ProductFormStepper.vue`, `ProductDeleteDialog.vue`, `useProducts.ts`, `products.service.ts`.

| Aspect | Pattern A (Simple) | Pattern B (Complex) |
|--------|-------------------|---------------------|
| **Pagination** | None — flat array | Server-side `PaginatedList<T>` |
| **Form dialog** | Single `FormDialog` (max-width=520) | Multi-step `FormStepper` (max-width=800) |
| **Detail view** | None | Separate `<Entity>DetailView.vue` |
| **List DTO vs Full DTO** | Same type for list and edit | `ProductListDto` (table) vs `ProductDto` (detail/edit) |
| **Edit flow** | Open dialog with list item data | Fetch full detail via `fetchProduct(id)` then open stepper |
| **Special getters** | None | byBarcode, lowStock, expiring |
| **Filter UI** | Search only | Search + category chip filter |

---

### 1. Service Layer (`src/services/<entity>.service.ts`)

```ts
import api from './api'
import type { ApiResponse, EntityDto, CreateEntityRequest, UpdateEntityRequest } from '@/types/api.types'

export const entityService = {
  getAll() {
    return api.get<ApiResponse<EntityDto[]>>('/endpoint')
  },
  // For paginated: getAll(params?) → api.get<ApiResponse<PaginatedList<EntityListDto>>>('/endpoint', { params })
  create(data: CreateEntityRequest) {
    return api.post<ApiResponse<number>>('/endpoint', data)
  },
  update(id: number, data: UpdateEntityRequest) {
    return api.put(`/endpoint/${encodeURIComponent(id)}`, data)
  },
  delete(id: number) {
    return api.delete(`/endpoint/${encodeURIComponent(id)}`)
  },
}
```

**Rules:**
- Plain object with methods, not a class
- Always `encodeURIComponent()` on URL params
- Type response with `ApiResponse<T>` or `ApiResponse<PaginatedList<T>>`
- Register in `src/services/index.ts` barrel export

### 2. Data Composable (`src/composables/use<Entity>.ts`)

```ts
import { ref } from 'vue'
import { entityService } from '@/services/entity.service'
import { extractError } from '@/utils/errors'
import type { EntityDto } from '@/types/api.types'

export function useEntity() {
  const items = ref<EntityDto[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchItems() {
    isLoading.value = true
    error.value = null
    try {
      const response = await entityService.getAll()
      items.value = response.data.data
    } catch (err) {
      error.value = extractError(err)
    } finally {
      isLoading.value = false
    }
  }

  async function createItem(data: CreateEntityRequest) {
    error.value = null
    try {
      await entityService.create(data)
      await fetchItems() // auto-refresh list
    } catch (err) {
      error.value = extractError(err)
      throw err // re-throw so the view catch block runs
    }
  }
  // updateItem, deleteItem follow the same pattern

  return { items, isLoading, error, fetchItems, createItem, updateItem, deleteItem }
}
```

**Rules:**
- Import `extractError` from `src/utils/errors.ts` — do NOT define locally
- NO `useI18n()` inside data composables — keep them i18n-free (views provide i18n fallbacks)
- Mutations always call `fetchItems()` to refresh, then `throw err`
- `fetchItems()` manages `isLoading` — mutations don't (views have their own `formLoading`/`deleteLoading` refs)
- Register in `src/composables/index.ts` barrel export

**For paginated composables** (see `useProducts.ts`):
- Track `pageNumber`, `pageSize`, `totalCount`, `totalPages` as refs
- Expose `paginationInfo` as computed
- Store `lastParams` so mutations re-fetch the same page/filter context
- Secondary getters (e.g. `fetchByBarcode`) should NOT set the shared `isLoading`

### 3. View Layer (`src/features/<entity>/views/<Entity>View.vue`)

```html
<v-container fluid>
  <!-- Page header: v-avatar (primary, tonal) + icon + title + subtitle -->
  <div class="page-header">...</div>

  <v-row style="margin-top: 32px;">
    <!-- Left: BaseDataTable -->
    <v-col cols="12" lg="8">
      <BaseDataTable :headers="headers" :items="items" :search="search" :loading="isLoading">
        <template #toolbar>
          <v-text-field v-model="search" ... style="max-width: 280px" />
          <v-spacer />
          <v-btn color="primary" @click="openCreate">{{ t('entity.createEntity') }}</v-btn>
        </template>
        <template #empty>icon + message + create button</template>
        <template #item.columnName="{ item }">custom cell rendering</template>
      </BaseDataTable>
      <!-- For paginated: v-pagination below table (only if totalPages > 1) -->
    </v-col>

    <!-- Right: info panel -->
    <v-col cols="12" lg="4">
      <div class="info-panel">
        <div class="info-section">
          <v-avatar ...> <v-icon ... /> </v-avatar>
          <span>Section title</span>
        </div>
        <p>Description</p>
        <ul class="info-list">
          <li v-for="item in tm('entity.infoItems')" :key="item">{{ item }}</li>
        </ul>
      </div>
    </v-col>
  </v-row>

  <!-- Snackbar — ALWAYS present -->
  <v-snackbar v-model="snackbar.visible.value" :color="snackbar.color.value" location="top end" :timeout="3000">
    {{ snackbar.message.value }}
  </v-snackbar>

  <!-- Dialogs -->
  <EntityFormDialog v-model="formDialog" :entity="selectedItem" :loading="formLoading" @submit="handleSubmit" />
  <EntityDeleteDialog v-model="deleteDialog" :entity="selectedItem" :loading="deleteLoading" @confirm="handleDelete" />
</v-container>
```

**Rules:**
- Headers are `computed()` for i18n reactivity
- `onMounted(fetchItems)` to load data
- `formLoading` and `deleteLoading` are separate refs managed by the view
- Error handling: `catch { snackbar.show(error.value ?? t('errors.generic'), 'error') }`
- Success: close dialog + `snackbar.show(t('entity.xxxSuccess'))`
- `finally { formLoading.value = false }`
- Info panel uses `.info-panel`, `.info-section`, `.info-list` CSS classes (see existing views for exact styles)
- Info panel content: array translations via `tm('entity.infoItems')`, NOT `t()`
- Admin-only actions: check `auth.hasRole('Admin')` before showing delete buttons

### 4. Form Dialog — Simple (`<Entity>FormDialog.vue`)

```html
<v-dialog :model-value="modelValue" max-width="520" persistent @update:model-value="$emit('update:modelValue', $event)">
  <v-card rounded="lg">
    <v-card-title class="d-flex align-center ga-3">
      <v-avatar color="primary" variant="tonal" size="32"><v-icon ... /></v-avatar>
      {{ isEditing ? t('entity.editEntity') : t('entity.createEntity') }}
    </v-card-title>
    <v-card-text>
      <v-form ref="formRef" class="d-flex flex-column ga-5" @submit.prevent>
        <!-- fields with :rules="rules.xxx" -->
      </v-form>
    </v-card-text>
    <v-card-actions class="px-6 pb-4">
      <v-spacer />
      <v-btn @click="close">{{ t('entity.cancel') }}</v-btn>
      <v-btn color="primary" :loading="loading" @click="submit">
        {{ isEditing ? t('entity.save') : t('entity.create') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
```

**Rules:**
- Always `persistent` — prevent accidental close
- Title: `v-avatar` tonal + icon + create/edit text
- Form `ga-5` gap between fields
- `watch(() => props.modelValue)` to reset form + validation on open
- `isEditing = computed(() => !!props.entity)`
- Emit typed data (use `UserRole` type, not `string`)
- Validation via `useValidationRules()` from `src/utils/validators.ts`

### 5. Form Stepper — Complex (`<Entity>FormStepper.vue`)

Used when forms have 3+ logical groups (e.g. Products has 4 steps).

```html
<v-dialog :model-value="modelValue" max-width="800" persistent @update:model-value="$emit(...)">
  <v-card rounded="lg">
    <v-card-title>avatar + title</v-card-title>
    <v-card-text class="pt-3">
      <v-stepper v-model="currentStep" flat>
        <v-stepper-header> <v-stepper-item ... /> per step </v-stepper-header>
        <v-stepper-window>
          <v-stepper-window-item :value="1">
            <v-form ref="step1Ref" class="d-flex flex-column ga-4">...</v-form>
          </v-stepper-window-item>
          <!-- more steps -->
        </v-stepper-window>
      </v-stepper>
    </v-card-text>
    <v-card-actions>
      <v-btn v-if="currentStep > 1" @click="currentStep--">{{ t('entity.back') }}</v-btn>
      <v-spacer />
      <v-btn @click="close">{{ t('entity.cancel') }}</v-btn>
      <v-btn v-if="currentStep < totalSteps" color="primary" @click="goNext">{{ t('entity.next') }}</v-btn>
      <v-btn v-else color="primary" :loading="loading" @click="submit">{{ submitLabel }}</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
```

**Rules:**
- `max-width="800"`, form gap `ga-4`, card-text `pt-3`
- One `v-form` ref per step for step-level validation
- `goNext()` validates current step before advancing
- `isEditing = computed(() => !!props.entity)` or from dynamic data (e.g. barcode lookup match)
- Stepper fields: all `v-select` have `:menu-props="{ location: 'top' }"` to open upward
- Dependent dropdowns: load child data on parent change (e.g. sectors when warehouse changes)
- Watch `modelValue` to reset ALL steps and state on dialog open
- Read-only fields on edit where business rules apply (e.g. stock field)

### 6. Delete Dialog (`<Entity>DeleteDialog.vue`)

```html
<v-dialog :model-value="modelValue" max-width="400" persistent @update:model-value="$emit(...)">
  <v-card rounded="lg">
    <v-card-title class="d-flex align-center ga-3">
      <v-avatar color="error" variant="tonal" size="32"><v-icon icon="mdi-alert" /></v-avatar>
      {{ t('entity.deleteEntity') }}
    </v-card-title>
    <v-card-text>
      {{ t('entity.confirmDelete', { name: entity?.name ?? '' }) }}
      <p class="text-medium-emphasis mt-2">{{ t('entity.confirmDeleteDescription') }}</p>
    </v-card-text>
    <v-card-actions class="px-6 pb-4">
      <v-spacer />
      <v-btn @click="close">{{ t('entity.cancel') }}</v-btn>
      <v-btn color="error" :loading="loading" @click="$emit('confirm')">{{ t('entity.delete') }}</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
```

### 7. BaseDataTable (`src/components/BaseDataTable.vue`)

Reusable table wrapper with skeleton loading, empty state, and toolbar.

**Props:** `headers`, `items`, `search`, `loading`, `noDataText`, `itemsPerPage`, `skeletonRows` (default: 5)
**Slots:** `#toolbar`, `#empty`, `#item.<columnKey>` (pass-through to v-data-table)
**Behavior:** Skeleton when `loading && items.length === 0` (initial only). Empty slot when `!loading && items.length === 0`. All `$attrs` forwarded to v-data-table.

### 8. Navigation (`src/composables/useNavigation.ts`)

```ts
export const navItems: readonly NavItem[] = [
  { route: 'products', icon: 'mdi-package-variant', titleKey: 'nav.products' },
  { route: 'stock', icon: 'mdi-swap-horizontal', titleKey: 'nav.stock' },
  { route: 'warehouses', icon: 'mdi-warehouse', titleKey: 'nav.warehouses' },
  { route: 'categories', icon: 'mdi-tag-multiple-outline', titleKey: 'nav.categories', role: 'Admin' },
  { route: 'users', icon: 'mdi-account-group-outline', titleKey: 'nav.users', role: 'Admin' },
  { route: 'notifications', icon: 'mdi-bell-outline', titleKey: 'nav.notifications' },
]
```

- `filterNavItems(items, userRole)`: pure function (exported for unit testing)
- `useNavigation()`: returns `{ visibleItems, navItems }`
- To add a new nav item, add to the `navItems` array

---

## i18n Conventions

- Default locale: `es`, fallback: `en`. Both files must stay in sync
- Every feature has a top-level key (e.g., `products: { ... }`, `users: { ... }`)
- Error keys go under global `errors.` namespace: `errors.loadEntity`, `errors.create Entity`, `errors.generic`
- Enum labels under `enums.` namespace: `enums.movementType.entry`, `enums.productUnit.kg`
- Accessibility keys under `a11y.` namespace
- Relative time keys under `relativeTime.` namespace

### CRUD Key Naming Convention

```
<entity>.title                    # Page title
<entity>.subtitle                 # Page subtitle
<entity>.create<Entity>           # "Create product" dialog title
<entity>.edit<Entity>             # "Edit product" dialog title
<entity>.delete<Entity>           # "Delete product" dialog title
<entity>.name, .email, etc.       # Field labels
<entity>.search                   # Search placeholder
<entity>.no<Entity>s              # Empty state: "No products registered"
<entity>.noResults                # No search matches
<entity>.confirmDelete            # Delete confirmation with {name} interpolation
<entity>.confirmDeleteDescription # Secondary delete explanation
<entity>.createSuccess            # Snackbar: "Product created successfully"
<entity>.updateSuccess            # Snackbar: "Product updated successfully"
<entity>.deleteSuccess            # Snackbar: "Product deleted successfully"
<entity>.cancel, .save, .create, .delete  # Button labels
<entity>.infoTitle                # Info panel title
<entity>.infoDescription          # Info panel description
<entity>.infoHowTitle             # Info panel section heading
<entity>.infoHowItems             # Info panel items (ARRAY — use tm(), not t())
<entity>.infoRulesTitle           # Info panel "Important" section heading
<entity>.infoRulesItems           # Info panel rules (ARRAY — use tm(), not t())
```

## Routes

```ts
// All routes use layout: 'default' except login and unauthorized which use 'auth'
{ path: '/', redirect: { name: 'products' } }
{ path: '/login', name: 'login', layout: 'auth' }
{ path: '/products', name: 'products', requiresAuth: true }
{ path: '/products/:id', name: 'product-detail', requiresAuth: true }
{ path: '/stock', name: 'stock', requiresAuth: true }
{ path: '/warehouses', name: 'warehouses', requiresAuth: true }
{ path: '/categories', name: 'categories', requiresAuth: true, role: 'Admin' }
{ path: '/users', name: 'users', requiresAuth: true, role: 'Admin' }
{ path: '/notifications', name: 'notifications', requiresAuth: true }
{ path: '/unauthorized', name: 'unauthorized', layout: 'auth' }
{ path: '/:pathMatch(.*)*', name: 'not-found' }
```

## API Types (Key Shapes in `src/types/api.types.ts`)

```ts
type UserRole = 'Admin' | 'Almacenista'
type ProductUnit = 'kg' | 'g' | 'un' | 'lt' | 'ml'
enum MovementType { Entry = 0, Exit = 1, WriteOff = 2, Relocation = 3, Adjustment = 4 }
enum AdjustmentType { Increase = 0, Decrease = 1 }
enum MovementReason { Expiration = 0, Damage = 1, Loss = 2, Other = 3 }
enum NotificationType { LowStock = 0, Expiring = 1, Expired = 2 }

// Products have TWO DTOs:
interface ProductListDto { id, name, sku, barcode?, unit, stock, minimumStock, categoryName }
interface ProductDto { ...all fields including price, supplier, expirationDate, defaultSectorId, etc. }

// Users:
interface UserDto { id: string, email, name, role: UserRole, isActive }
```

## Testing

- Vitest with `happy-dom` environment
- Test files: `__tests__/` inside each feature or composable folder
- Run: `npx vitest run`
- Pure functions exported alongside composables for unit testing (e.g., `filterNavItems`, `isValidEmail`)

## Implementation Status

| Feature | View | Service | Composable | Components | Status |
|---------|------|---------|------------|------------|--------|
| Auth | LoginView | ✅ | ✅ useAuth | LoginForm | ✅ Complete |
| Products | ProductsView + ProductDetailView | ✅ | ✅ useProducts | ProductFormStepper, ProductDeleteDialog | ✅ Complete |
| Users | UsersView | ✅ | ✅ useUsers | UserFormDialog, UserDeleteDialog | ✅ Complete |
| Categories | ⬜ Stub | ✅ | ✅ useCategories | — | Service + composable ready, needs view |
| Warehouses | ⬜ Stub | ✅ | ✅ useWarehouses | — | Service + composable ready, needs view |
| Stock | ⬜ Stub | ✅ | ✅ useStock | — | Service + composable ready, needs view |
| Notifications | ⬜ Stub | ✅ | ✅ useNotifications | — | Service + composable ready, needs view |

Stub views are placeholders with only an icon + `t('<entity>.placeholder')` text.

## Do NOT

- Hardcode colors — always use tokens or Vuetify theme
- Add a hamburger/toggle button for the sidebar
- Add excessive padding/margins — keep UI compact and dense
- Use Options API
- Skip i18n for visible text
- Add features, abstractions, or refactors beyond what was asked
- Use `useI18n()` inside data composables — keep i18n in views/components only
- Hardcode error strings in composables — use shared `extractError()` from `src/utils/errors.ts`
- Use `as any` casts — properly type data from the start
- Use deprecated `theme.global.name.value` — use `theme.change()` for Vuetify 4
- Define `extractError` locally in composables — import from `src/utils/errors.ts`
- Put data composables inside feature folders — they live in `src/composables/`
- Put services inside feature folders — they live in `src/services/`
