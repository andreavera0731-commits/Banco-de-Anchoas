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
  components/       # Shell: AppHeader, AppSidebar, AppFooter
  composables/      # Shared composables (useLoading, useNotification, useTheme)
  features/         # Feature modules (auth/, dashboard/, ...)
    <feature>/
      components/   # Feature-specific components
      composables/  # Feature-specific composables
      services/     # API service for this feature
      stores/       # Pinia store
      types/        # Feature types
      views/        # Route views
      __tests__/    # Unit tests
  i18n/             # Translations (es.ts, en.ts)
  layouts/          # AuthLayout, DefaultLayout
  plugins/          # Vuetify config, Pinia, plugin index
  router/           # Routes, guards
  services/         # Shared API services (api.ts, categories, products, stock, etc.)
  types/            # Shared types (api.types.ts, auth.types.ts)
  utils/            # Validators, formatters
  views/            # Shared views (Home, About, Unauthorized)
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
- Contains: brand logo + name, theme toggle (sun/moon), user menu dropdown
- No navigation controls — the sidebar manages itself

### AppSidebar
- **Always permanent rail mode** with `expand-on-hover`
- Collapsed: shows only icons (rail width ~56px)
- Hover: expands to 200px showing icon + label
- Items use `density="compact"`, minimal padding, tight icon-to-text spacing (12px gap)
- Each nav item: `prepend-icon`, `:title`, `rounded="lg"`, `color="primary"`

### AppFooter
- Ultra-compact: 24px height, `text-overline` at 0.6rem
- Only displays copyright text

### DefaultLayout
- Stacks: AppHeader → AppSidebar + v-main → AppFooter
- No drawer state management needed (sidebar is self-contained)

## Coding Conventions

1. **SFC order**: `<template>` → `<script setup lang="ts">` → `<style scoped>`
2. **Composition API only** — no Options API
3. **TypeScript strict** — properly type all props, emits, refs
4. **i18n all user-facing strings** — use `t('key')`, define keys in both `es.ts` and `en.ts`
5. **Feature-first organization** — new features go under `src/features/<name>/`
6. **Services return unwrapped data** — API responses follow `ApiResponse<T>` wrapper; services/stores unwrap `.data.data`
7. **Auth roles**: `'Admin'` and `'Almacenista'` (string, not enum)
8. **User IDs are string GUIDs**

## API Integration

- Base Axios instance in `src/services/api.ts` with Bearer token interceptor
- 401 responses auto-redirect to login
- All API types in `src/types/api.types.ts`
- Service modules: `categories`, `products`, `stock`, `warehouses`, `sectors`, `users`, `notifications`

## Testing

- Vitest with `happy-dom` environment
- Test files collocated: `__tests__/` inside each feature or util folder
- Currently 11 passing tests across 3 test files
- Run: `npx vitest run`

## Do NOT

- Hardcode colors — always use tokens or Vuetify theme
- Add a hamburger/toggle button for the sidebar
- Add excessive padding/margins — keep UI compact and dense
- Use Options API
- Skip i18n for visible text
- Add features, abstractions, or refactors beyond what was asked
