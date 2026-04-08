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
| Icons | @mdi/font (Material Design Icons) |  |
| Backend URL | `http://localhost:5128/api` |  |

## Project Structure

```
src/
  assets/           # base.css (design tokens), main.css (globals, animations, utilities)
  components/       # Shell (AppHeader, AppSidebar, AppFooter) + reusable (BaseDataTable)
  composables/      # Shared composables (useSnackbar, useNavigation, useLoading, useNotification, useTheme)
  features/         # Feature modules (auth/, users/, dashboard/, ...)
    <feature>/
      components/   # Feature-specific components (XxxFormDialog, XxxDeleteDialog)
      composables/  # Feature-specific composables
      services/     # API service for this feature
      stores/       # Pinia store
      types/        # Feature types
      views/        # Route views (XxxView.vue)
      __tests__/    # Unit tests
  i18n/             # Translations (es.ts, en.ts)
  layouts/          # AuthLayout, DefaultLayout
  plugins/          # Vuetify config, Pinia, plugin index
  router/           # Routes, guards
  services/         # Shared API services (api.ts, users.service.ts, etc.)
  types/            # Shared types (api.types.ts, auth.types.ts)
  utils/            # Validators, formatters
  views/            # Shared views (Home, About, Unauthorized, NotFound)
```

## Design System Rules

### Tokens — NEVER hardcode colors or sizes

- **Vuetify theme colors**: Use `rgb(var(--v-theme-primary))`, `rgb(var(--v-theme-surface))`, etc.
- **Custom tokens** (`--bda-*`): Defined in `src/assets/base.css`. Covers typography, spacing (4px grid), radii, shadows, transitions, z-index.
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

Global defaults are set for VBtn, VTextField, VSelect, VCard, VChip, VAlert, VNavigationDrawer, VDataTable, VSkeletonLoader. **Do not repeat** `variant`, `density`, `rounded` props that already match defaults.

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
- Clean app bar without hamburger menu
- Contains: brand logo + name, theme toggle (sun/moon), language toggle, user menu dropdown
- Avatar initials derived from `auth.user?.name` (not email)
- Theme switching via `theme.change(themeName)` (Vuetify 4 API)

### AppSidebar
- **Always permanent rail mode** with `expand-on-hover`
- Collapsed: shows only icons (rail width ~56px)
- Hover: expands to 200px showing icon + label
- Items use `density="compact"`, minimal padding, tight icon-to-text spacing (12px gap)
- Each nav item: `prepend-icon`, `:title`, `rounded="lg"`, `color="primary"`
- **Role-filtered**: uses `useNavigation()` composable — items with `role` property only visible to matching roles

### AppFooter
- Ultra-compact: 24px height, `text-overline` at 0.6rem
- Only displays copyright text

### DefaultLayout
- Stacks: AppHeader → AppSidebar + v-main → AppFooter
- No drawer state management needed (sidebar is self-contained)

## Coding Conventions

1. **SFC order**: `<template>` → `<script setup lang="ts">` → `<style scoped>`
2. **Composition API only** — no Options API
3. **TypeScript strict** — properly type all props, emits, refs. Use `UserRole` type (not raw strings) for role fields
4. **i18n all user-facing strings** — use `t('key')`, define keys in both `es.ts` and `en.ts`
5. **Feature-first organization** — new features go under `src/features/<name>/`
6. **Services return unwrapped data** — API responses follow `ApiResponse<T>` wrapper; composables unwrap `.data.data`
7. **Auth roles**: `type UserRole = 'Admin' | 'Almacenista'` (defined in `api.types.ts`)
8. **User IDs are string GUIDs**, all other entity IDs are `number`
9. **No hardcoded error messages** — `extractError()` returns `null` for unknown errors, views fallback to `t('errors.generic')`
10. **Home route is `products`** — no dashboard. `/` redirects to `products`

## API Integration

- Base Axios instance in `src/services/api.ts` with Bearer token interceptor
- 401 responses auto-redirect to login
- All API types in `src/types/api.types.ts`
- Service modules: `categories`, `products`, `stock`, `warehouses`, `sectors`, `users`, `notifications`
- URL params use `encodeURIComponent()` for safety

## Auth & Guards

- Auth guard in `src/router/guards.ts` loads user profile BEFORE checking roles
- Routes declare `meta: { requiresAuth: true, role?: UserRole }`
- On 403 → redirect to `unauthorized` view
- On 404 → redirect to `notFound` view
- Both views link back to `products` (not dashboard)

---

## CRUD Implementation Pattern (Canonical Reference: Users)

All CRUD modules MUST follow this architecture. The Users module (`src/features/users/`) is the canonical reference.

### 1. Service Layer (`src/services/<entity>.service.ts`)

```ts
import api from './api'
import type { ApiResponse, EntityDto, CreateEntityRequest, UpdateEntityRequest } from '@/types/api.types'

export const entityService = {
  getAll() {
    return api.get<ApiResponse<EntityDto[]>>('/endpoint')
  },
  create(data: CreateEntityRequest) {
    return api.post<ApiResponse<string>>('/endpoint', data)
  },
  update(id: string | number, data: UpdateEntityRequest) {
    return api.put(`/endpoint/${encodeURIComponent(id)}`, data)
  },
  delete(id: string | number) {
    return api.delete(`/endpoint/${encodeURIComponent(id)}`)
  },
}
```

**Rules:**
- Plain object with methods, not a class
- Always `encodeURIComponent()` on URL params
- Type the response shape with `ApiResponse<T>`

### 2. Data Composable (`src/composables/use<Entity>.ts`)

```ts
import { ref } from 'vue'
import { entityService } from '@/services/entity.service'
import type { EntityDto } from '@/types/api.types'

function extractError(err: unknown): string | null {
  const res = (err as any)?.response?.data
  return res?.message ?? res?.errors ?? null
}

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

  // updateItem, deleteItem follow the same try/catch/throw pattern

  return { items, isLoading, error, fetchItems, createItem, updateItem, deleteItem }
}
```

**Rules:**
- NO `useI18n()` inside data composables — keep them i18n-free
- `extractError()` returns `null` for unknown errors (never hardcoded English)
- Mutations (create/update/delete) always call `fetchItems()` to refresh, then `throw err` so the view can react
- `fetchItems()` sets `isLoading` — mutations don't (views manage their own loading refs)
- Each composable returns `{ items, isLoading, error, ...methods }`

### 3. Snackbar Composable (`src/composables/useSnackbar.ts`)

Reusable notification state. Every CRUD view uses this — no manual refs.

```ts
const snackbar = useSnackbar()
snackbar.show(t('entity.createSuccess'))           // green success
snackbar.show(error.value ?? t('errors.generic'), 'error')  // red error
```

### 4. View Layer (`src/features/<entity>/views/<Entity>View.vue`)

Structure:

```
<v-container fluid>
  <!-- Page header: avatar + title + subtitle -->
  <div class="page-header">...</div>

  <v-row style="margin-top: 32px;">
    <!-- Left: BaseDataTable with toolbar, skeleton, empty, column slots -->
    <v-col cols="12" lg="8">
      <BaseDataTable ...>
        <template #toolbar>search + create button</template>
        <template #empty>icon + message + create button</template>
        <template #item.columnName="{ item }">custom cell</template>
      </BaseDataTable>
    </v-col>

    <!-- Right: info panel (optional) -->
    <v-col cols="12" lg="4">...</v-col>
  </v-row>

  <v-snackbar v-model="snackbar.visible.value" :color="snackbar.color.value" location="top end" :timeout="3000">
    {{ snackbar.message.value }}
  </v-snackbar>

  <EntityFormDialog v-model="formDialog" :entity="selectedItem" :loading="formLoading" @submit="handleSubmit" />
  <EntityDeleteDialog v-model="deleteDialog" :entity="selectedItem" :loading="deleteLoading" @confirm="handleDelete" />
</v-container>
```

**Rules:**
- Headers are `computed()` (for i18n reactivity)
- `onMounted(fetchItems)` to load data on page enter
- `formLoading` and `deleteLoading` are separate refs managed by the view
- Error handling: `catch { snackbar.show(error.value ?? t('errors.generic'), 'error') }`
- Close dialog on success: `formDialog.value = false`
- `finally { formLoading.value = false }`

### 5. Form Dialog (`src/features/<entity>/components/<Entity>FormDialog.vue`)

```
<v-dialog :model-value="modelValue" max-width="520" persistent @update:model-value="$emit(...)">
  <v-card rounded="lg">
    <v-card-title> avatar + title (create vs edit) </v-card-title>
    <v-card-text> <v-form> fields with validation rules </v-form> </v-card-text>
    <v-card-actions> cancel + submit button with :loading </v-card-actions>
  </v-card>
</v-dialog>
```

**Rules:**
- Always `persistent` — prevent accidental close
- `max-width="520"`, `rounded="lg"` on the card
- Title has `v-avatar` tonal with icon + text
- Form uses `ga-5` (gap 20px) between fields
- `watch(() => props.modelValue)` to reset form and validation on open
- `isEditing` derived from `!!props.entity`
- Emit typed data (use proper TypeScript types like `UserRole`, not `string`)
- Validation via `useValidationRules()` from `src/utils/validators.ts`

### 6. Delete Dialog (`src/features/<entity>/components/<Entity>DeleteDialog.vue`)

```
<v-dialog :model-value="modelValue" max-width="400" persistent @update:model-value="$emit(...)">
  <v-card rounded="lg">
    <v-card-title> error avatar + "Delete entity" </v-card-title>
    <v-card-text> confirmation message with interpolated {name} </v-card-text>
    <v-card-actions> cancel + delete button (color="error", :loading) </v-card-actions>
  </v-card>
</v-dialog>
```

**Rules:**
- Always `persistent` — prevent close during loading
- `max-width="400"`, `rounded="lg"` on the card
- Error-colored avatar in title
- Interpolated name: `t('entity.confirmDelete', { name: entity?.name ?? '' })`
- Emit `confirm` event (no data needed — view has `selectedItem`)

### 7. BaseDataTable (`src/components/BaseDataTable.vue`)

Reusable wrapper that handles:
- **Skeleton loading**: Shown when `loading && items.length === 0` (initial load only)
- **Empty state**: Shown when `items.length === 0 && !loading` — has `#empty` slot with fallback icon
- **Table**: Vuetify `v-data-table` with consistent bordered styling
- **Toolbar**: `#toolbar` slot for search/actions above the table

Props: `headers`, `items`, `search`, `loading`, `noDataText`, `itemsPerPage`, `skeletonRows` (default: 5)

Pass-through: All `$attrs` forwarded to `v-data-table`. Column slots like `#item.xxx` work directly.

### 8. Navigation (`src/composables/useNavigation.ts`)

Data-driven sidebar with role filtering:
- `navItems`: readonly array of `NavItem` with optional `role` property
- `filterNavItems(items, userRole)`: pure function (testable)
- `useNavigation()`: composable returning `visibleItems` computed

To add a new nav item, just add to the `navItems` array. Items with `role: 'Admin'` are only shown to admins.

---

## i18n Conventions

- Every feature has a top-level key in both `es.ts` and `en.ts` (e.g., `users: { ... }`)
- CRUD keys follow this naming pattern:
  - `title`, `subtitle` — page header
  - `createEntity`, `editEntity`, `deleteEntity` — dialog titles
  - `name`, `email`, etc. — field labels
  - `search` — search placeholder
  - `noEntity` — empty state (no data at all)
  - `noResults` — no search matches
  - `confirmDelete` — delete confirmation with `{name}` interpolation
  - `confirmDeleteDescription` — secondary explanation
  - `createSuccess`, `updateSuccess`, `deleteSuccess` — snackbar messages
  - `cancel`, `save`, `create`, `delete` — button labels
- Error keys go under `errors.` namespace: `errors.loadEntity`, `errors.generic`
- Array translations (like permissions lists) use `tm('key')` not `t('key')`

## Testing

- Vitest with `happy-dom` environment
- Test files collocated: `__tests__/` inside each feature or composable folder
- Currently 19 passing tests across 4 test files
- Run: `npx vitest run`
- Pure functions exported alongside composables for easier unit testing (e.g., `filterNavItems`)

## Do NOT

- Hardcode colors — always use tokens or Vuetify theme
- Add a hamburger/toggle button for the sidebar
- Add excessive padding/margins — keep UI compact and dense
- Use Options API
- Skip i18n for visible text
- Add features, abstractions, or refactors beyond what was asked
- Use `useI18n()` inside data composables — keep i18n in views/components only
- Hardcode error strings in composables — return `null` and let views provide i18n fallbacks
- Use `as any` casts — properly type data from the start
- Use deprecated `theme.global.name.value` — use `theme.change()` for Vuetify 4
