# Estado Actual del Sistema — Banco de Anchoas

> Revisión técnica del estado actual: tecnologías, arquitectura, patrones de desarrollo y bases de UI/UX.
> Fecha: 2026-08-05 · Rama: `main` (21 commits) · Ámbito: repositorio completo (revisión de lectura)

---

## Resumen ejecutivo

El proyecto es un **frontend Vue 3 + TypeScript maduro y notablemente consistente**: 9 módulos de features con patrones uniformes, i18n completo es/en, sistema propio de design tokens y una capa de servicios tipada que consume una API REST con autenticación JWT definida por contrato.

Los tres hallazgos que deben guiar las decisiones de las próximas fases son:

1. **P0 — No hay backend que implemente el contrato que el frontend ya espera.** El `app.py` presente es un stub Flask legacy (JSON file, puerto 5000, sin auth ni CORS) totalmente desconectado del contrato REST real (`http://localhost:5128/api`, JWT). Todo trabajo end-to-end depende de definir/confirmar la API real.
2. **P1 — Las dependencias core están en versión beta/new-major**: Vue 3.6-beta, Vite 7 (beta), Vue Router 5, Vuetify 4, Pinia 3, ESLint 10, Vitest 4. Reproducible (overrides), pero con riesgo de breaking changes.
3. **P1 — La documentación está desactualizada** (puertos 5001 vs 5128, stores inexistentes, features marcadas "STUB" que ya están implementadas). Confiar en los docs actuales lleva a decisiones erróneas.

### Hallazgos priorizados

| Prioridad | Hallazgo | Impacto para las próximas fases |
|---|---|---|
| P0 | No existe backend que implemente el contrato REST esperado (JWT, `:5128/api`) | Bloquea features end-to-end; definir la API real antes de planificar integraciones |
| P1 | Dependencias core en beta/new-major (Vue 3.6-beta, Vite beta, Router 5, Vuetify 4, Pinia 3) | Riesgo de breaking changes y de supply chain al avanzar |
| P1 | Documentación desactualizada (puertos, stores fantasma, features "STUB" inexistentes) | Onboarding lento y decisiones basadas en datos falsos |
| P2 | Suite de tests mínima y parcialmente rota (1 test stale, 1 stub, sin tests de componentes) | Regresiones silenciosas al sumar features |
| P2 | Tipos duplicados y `any` residuales | Deuda que crece en mantenimiento |

---

## Cómo usar este documento

1. Leé la sección 2 (stack) para confirmar versiones y riesgos de dependencias.
2. Leé la sección 3 (arquitectura) para entender qué existe y qué falta (especialmente 3.3 Backend).
3. Usá la sección 8 (decisiones pendientes) como agenda de la próxima reunión técnica.
4. Verificá los puntos de la sección 9 (checklist) antes de planificar features nuevos.

---

## 1. Stack tecnológico

Versiones resueltas desde `package-lock.json` y `requirements.txt`.

| Capa | Tecnología | Versión | Notas |
|---|---|---|---|
| Framework | Vue 3 `<script setup lang="ts">` | **3.6.0-beta.7** | `package.json` pinnea `vue: "beta"`; el bloque `overrides` pinnea toda la familia `@vue/*` (compiler-core/dom/sfc/ssr/vapor, reactivity, runtime) a beta |
| Build | Vite | **7.3.1** | `vite: "beta"`; plugin `@vitejs/plugin-vue 6.0.4` |
| UI | Vuetify | **4.0.1** | Registro completo de componentes y directivas |
| Router | Vue Router | **5.0.3** | `createWebHistory`, rutas lazy |
| Estado | Pinia | **3.0.4** | Solo existe UN store (auth); el resto vive en composables |
| i18n | vue-i18n | **11.3.0** | `legacy: false`, locale `es`, fallback `en` |
| HTTP | Axios | **1.13.6** | Interceptor JWT en `src/services/api.ts` |
| Lenguaje | TypeScript | **5.9.3** | Estricto vía `@vue/tsconfig`, `noUncheckedIndexedAccess: true` |
| Testing | Vitest | **4.0.18** | Env `jsdom`; instalados también `happy-dom 20.8.3` y `jsdom 28.1.0` (redundante) |
| Lint/Format | ESLint 10.0.3 (flat config) + Prettier 3.8.1 | | |
| Estilos | Sass 1.97.3 | | + `@mdi/font 7.4.47` (iconos) |
| QR | qrcode 1.5.4 | | Diálogo de QR de sector |
| Type-check | vue-tsc 3.2.5 | | `build` = type-check + build |
| Runtime | Node | `^20.19.0 \|\| >=22.12.0` | |
| **Backend** | **Flask** | **3.0.0** | Única dependencia de `requirements.txt` — stub legacy (ver 3.3) |

**Configs relevantes**: `vite.config.ts` (alias `@`→`./src`), `vitest.config.ts` (jsdom, globals), `tsconfig.app.json` (excluye `src/**/__tests__/*` del type-check), `eslint.config.js`, `.prettierrc` (sin semicolons, single quote, printWidth 100).

---

## 2. Arquitectura

### 2.1 Estructura del frontend (`src/`, 84 archivos)

```
src/
├── main.ts                    # createApp → registerPlugins → router → mount
├── App.vue                    # switch de layout por route.meta.layout; transiciones de página
├── assets/                    # base.css (design tokens --bda-*), main.css (utilidades/animaciones), logo.svg
├── components/                # Shell + reutilizables
│   ├── AppHeader.vue  AppSidebar.vue  AppFooter.vue
│   ├── BaseDataTable.vue      # wrapper de v-data-table (toolbar/skeleton/empty)
│   └── DatePickerField.vue    # wrapper v-menu + v-date-picker (emite ISO)
├── composables/               # TODO el estado de entidades vive acá
│   ├── useProducts/useStock/useCategories/useUsers/useRequesters
│   ├── useWarehouses/useNotifications/useNavigation/useSnackbar/useTheme
├── features/                  # Organización feature-first (views + componentes)
│   ├── auth/                  # ÚNICA feature autocontenida: store + service + composable + types
│   ├── products/  stock/  warehouses/  categories/
│   ├── users/  requesters/  reports/  notifications/
├── i18n/                      # index.ts + locales/es.ts y en.ts (640 líneas c/u, paralelas)
├── layouts/                   # DefaultLayout.vue, AuthLayout.vue
├── plugins/                   # index.ts, vuetify.ts, pinia.ts, auth.ts (profile al boot)
├── router/                    # index.ts, routes.ts (12 rutas), guards.ts
├── services/                  # api.ts (instancia axios) + 10 services tipados
├── types/                     # api.types.ts (367 líneas), auth.types.ts, index.ts
├── utils/                     # errors.ts, formatters.ts, validators.ts, enums.helper.ts
└── views/                     # NotFoundView.vue, UnauthorizedView.vue
```

### 2.2 Frontend — cómo funciona

- **Routing** (`src/router/routes.ts`, 12 rutas): `/login` (layout auth) · `/` → redirect a `/products` · `/products`, `/stock`, `/warehouses` (requieren auth) · `/categories`, `/users`, `/requesters`, `/reports` (auth + rol `Admin`) · `/notifications` (auth) · `/unauthorized` · 404. Todas las rutas son lazy.
- **Guards** (`guards.ts`): (1) sin token + `requiresAuth` → login; (2) autenticado yendo a login → products; (3) token sin usuario → fetch de profile (logout si falla); (4) chequeo de `meta.role` vía `hasRole()`.
- **Estado** — dato arquitectónico clave: existe **un solo store Pinia** (`src/features/auth/stores/auth.store.ts`, estilo setup). **Todo el estado de entidades vive en composables** (`useProducts`, `useStock`, etc.), cada uno envuelve su service con refs locales (`items`, `isLoading`, `error`, paginación + memo `lastParams`) y expone `fetch*` + mutaciones que refetchean al terminar.
- **Capa API** (`src/services/api.ts`): baseURL `import.meta.env.VITE_API_BASE_URL || 'http://localhost:5128/api'`; interceptor de request agrega `Authorization: Bearer <token>`; interceptor de response hace logout en 401. Los services devuelven respuestas tipadas `ApiResponse<T>` / `ApiResponse<PaginatedList<T>>` y los composables desempaquetan `.data.data`.
- **Tipos** (`src/types/api.types.ts`): DTOs y enums completos por entidad (`MovementType 0-4`, `AdjustmentType 0-1`, `MovementReason 0-3`, `NotificationType 0-2`, `OrderStatus 0-3`, `ReportFormat 0csv/1excel/2pdf`, `UserRole = 'Admin'|'Almacenista'`, `ProductUnit`). Split `ProductListDto` vs `ProductDto` para lista/detalle.
- **i18n**: `legacy: false`, default `es`, fallback `en`. Ambos locales con **estructura de claves idéntica** (verificado por diff) y claves namespaced (`app`, `auth`, `products`, `enums.*`, `errors`, etc.).

### 2.3 Backend — LA BRECHA

`app.py` (35 líneas) es un **stub Flask legacy, completamente desconectado del frontend**:

- Almacenamiento en `inventario.json`.
- Rutas: `GET /` → `render_template("index.html")`; `POST /agregar`; `GET /listar`.
- Corre en puerto 5000. Sin auth, sin CORS, sin prefijo `/api`, sin paginación.
- **`render_template("index.html")` rompería en runtime: no existe directorio `templates/` en el repo** (verificado). La ruta raíz está rota incluso para su propio propósito.
- `requirements.txt` = solo `Flask==3.0.0`.

El frontend espera una **API REST real en `http://localhost:5128/api` con JWT** y el mapa de endpoints de la tabla siguiente. Nada en el repo implementa esa API. El target de integración implícito es una API .NET externa (mencionada en `.github/copilot-instructions.md` y en el commit 818c00b "Updated .env API URL to port 5128").

### 2.4 Contrato de integración (lo que el frontend ya espera)

| Recurso | Endpoints |
|---|---|
| Auth | `POST /auth/login`, `GET /auth/profile` |
| Categorías | CRUD `/categories` |
| Productos | CRUD `/products`, `GET /products/by-barcode/:barcode`, `/low-stock`, `/expiring` |
| Stock | `POST /stock/movements`, `/write-off`, `/relocate`, `/adjustment`, `/history`, `/write-offs` |
| Almacenes | CRUD `/warehouses`, `GET /warehouses/:id/sectors`, `/sectors/:id` |
| Usuarios | CRUD `/users` (create devuelve GUID como string) |
| Notificaciones | `GET /notifications`, `/unread-count`, `POST /:id/read`, `/read-all` |
| Solicitantes | CRUD `/requesters` |
| Reportes | `GET /reports/movements/export` (blob, filename vía Content-Disposition) |

---

## 3. Patrones de desarrollo

Inventario de los patrones vigentes, con ejemplos concretos. **Nuevos features deberían seguir estos patrones existentes** — están uniformes en los 9 módulos.

| Patrón | Descripción | Ejemplos |
|---|---|---|
| Feature-first | `src/features/<name>/` contiene solo `views/` + `components/`; lo compartido vive en `src/{services,composables,types}`. Auth es la única excepción autocontenida | `features/products/`, `features/stock/` |
| Composable-as-state | Estado de entidad en composables con refs locales, `fetch*`, mutación + refetch, re-throw de errores | `useProducts.ts`, `useStock.ts` (refs paginación + `lastParams`) |
| Service pattern | Objetos literales tipados, `encodeURIComponent()` en params, `ApiResponse<T>`/`PaginatedList<T>`, barrel export | `src/services/*.service.ts`, `src/services/index.ts` |
| Error handling | `extractError()` (`src/utils/errors.ts`) devuelve `response.data.message ?? errors ?? null`; los views caen a `t('errors.generic')` en snackbar | Views de products/stock/reports |
| Diálogos | Form dialogs: `v-model` + emit `update:modelValue`, `persistent`, max-width 520 (form) / 800 (stepper) / 400 (delete). Delete dialogs "tontos" (solo props + emits). Botones: cancel `variant="text"`, submit `variant="flat"` `:loading`, min-width 100 | `ProductDeleteDialog`, `UserFormDialog` |
| CRUD patrón A | Lista plana sin paginación, un form dialog | Users, Categories, Requesters |
| CRUD patrón B | Server-paginado, lista vs detalle (split DTO), stepper con lookup por barcode | Products (`ProductFormStepper` 4 pasos, `ProductDetailPanel`) |
| Tabla base | Wrapper con toolbar/skeleton/empty y passthrough de slots/attrs | `BaseDataTable.vue` |
| Layout de vista | `v-container fluid` → `.page-header` (avatar + h1 + subtítulo) → `v-row lg=8` tabla + `lg=4` panel de info → snackbar | `ReportsView.vue`, `NotificationsView.vue`, `StockView.vue` |
| Fechas | `DatePickerField` emite ISO; normalización `expirationDate?.split('T')[0]` | `ProductFormStepper.vue:354,395` |
| Validación | `useValidationRules()`: email, password ≥8, required, numberMin, numberPositive, selectRequired; mensajes i18n | `src/utils/validators.ts` |
| Formateo | `formatDate` DD/MM/YYYY, `formatDateTime`, `formatCurrency` (es-ES EUR), `formatRelativeTime` ("hace X minutos"), `getStockColor` | `src/utils/formatters.ts` |
| Enums en UI | Mapeos de color puros (`getMovementTypeColor`) + labels vía i18n (`useEnumLabels()`) | `src/utils/enums.helper.ts` |
| Auth plumbing | Profile fetch al boot (`plugins/auth.ts`), guard con fetch on-demand, sidebar filtrada por rol (`useNavigation`, 8 items, 4 Admin-only) | `AppHeader.vue:72-99` |

---

## 4. Bases de UI/UX

### 4.1 Temas

- **Light** (default): `primary #b8860b` (dorado/bronce), `secondary #1a1a2e`, `accent #d4a84b`, `background #faf8f5`, `surface #ffffff`, `surface-variant #f5f0e8`.
- **Dark**: `primary #d4a84b`, `background #121212`, `surface #1e1e2e`, `surface-variant #2a2a3e`.
- Defaults globales de componentes (`src/plugins/vuetify.ts`): VBtn `rounded="lg"` sin text-transform; VTextField/VSelect outlined + comfortable; VCard `rounded="xl"` sin elevación; VChip pill; VAlert tonal; VDataTable hover.

### 4.2 Design tokens (`src/assets/base.css`)

- Tipografía Inter con escala completa (`--bda-font-*`: display 2rem → caption 0.75rem).
- Grilla de espaciado de 4px (`--bda-space-{1..16}`).
- Radios (`--bda-radius-{sm,md,lg,xl,2xl,pill}`), transiciones (150/250/400/500ms), escala z-index (drawer 100 / appbar 200 / modal 300 / toast 400), touch targets 44px.
- Variantes light/dark vía `.v-theme--light/.v-theme--dark`.
- Utilidades (`main.css`): `.bda-gradient-btn`, `.bda-card-hover`, `.bda-truncate`, animaciones `page-*`, `stagger-*`, `toast-*`; scrollbar de 6px.

### 4.3 Shell y patrones de pantalla

- **Shell**: `DefaultLayout` (Header limpio sin hamburguesa + Sidebar rail permanente 200px con expand-on-hover + Footer 24px) y `AuthLayout` (login centrado).
- **Header** (`AppHeader.vue`): brand izquierdo; menú usuario con avatar por iniciales, toggle de tema (sol/luna), toggle ES↔EN, logout.
- **Login**: split-screen (form a la izquierda, panel promo derecha `d-none d-md-flex`), pills de features, toggle de idioma.
- **Idiomas UX**: skeleton loaders en tablas y paneles de detalle; chips de estado con colores semánticos (entry=success, exit=warning, write-off=error, relocation=info, adjustment=secondary); cantidades con color `+/-`; paneles de info con ícono de bombilla y listas con viñetas; snackbars top-end con timeout 3s.
- **Responsive**: grilla Vuetify (breakpoints estándar), panel de detalle pasa debajo de la tabla en pantallas chicas.

### 4.4 i18n como base de UX

- Locale default `es`, fallback `en`, claves paralelas al 100% (640 líneas por locale, estructura idéntica verificada).
- Claves namespaced por dominio (`products`, `stock`, `warehouses`...) + `enums.*` para labels de enums y `errors.*` para mensajes de error.

---

## 5. Estado de calidad y pruebas

| Área | Estado | Detalle |
|---|---|---|
| TypeScript | Fuerte | Estricto, `noUncheckedIndexedAccess`; sin `ts-ignore` ni `console.*` en `src/` |
| Lint/Format | Configurado | ESLint flat config + Prettier; se ejecuta en `npm run build` |
| Pruebas | **Mínima y parcialmente rota** | 4 archivos: `auth.store.test.ts` (4 casos) y `validators.test.ts` reales; `useNavigation.test.ts` **stale** (espera 6 items de nav, hay 8); `LoginForm.test.ts` es un **stub** (`expect(true).toBe(true)`) |
| Cobertura de componentes | Ausente | No hay tests de montaje de componentes |
| Git | Limpio | 21 commits conventional commits; sin TODOs ni FIXMEs; working tree limpio salvo `.atl/` y `.codegraph/` (artefactos de tooling, candidatos a gitignore) |

> Nota: `node_modules` no está instalado en el entorno de revisión; las afirmaciones sobre tests stale son de lectura estática, no de ejecución. El type-check no cubre `src/**/__tests__/*` (excluido en `tsconfig.app.json`), así que los tests pueden romper sin que `npm run build` lo detecte.

### Deuda técnica conocida

- **Tipos duplicados**: `src/types/auth.types.ts` es byte-idéntico a `src/features/auth/types/auth.types.ts`. Consolidar para evitar drift.
- **`any` residuales**: `as any` en `guards.ts:33`; `catch (err: any)` en `useNotifications.ts:29,40,51,63` y `useAuth.ts:21` (inconsistente con la convención `extractError`).
- **Dependencia redundante**: `happy-dom` y `jsdom` instalados; vitest usa jsdom.
- **`index.html`**: `lang=""` (vacío) — detalle de a11y/SEO.
- **Entorno**: existe `.env` (44 B) y `.env.example` (170 B); en la revisión no fueron legibles por política de sandbox — validar el contenido real como equipo (el default de código es `:5128`).

---

## 6. Hallazgos detallados

### P0 — Backend inexistente vs. contrato del frontend

El `app.py` no puede servir ni su propia ruta raíz (falta `templates/`), y su modelo (JSON file, sin auth) no se acerca al contrato JWT paginado de la tabla 2.4. El repositorio no contiene ningún backend que haga funcionar la aplicación de punta a punta. **Decisión requerida**: quién construye/provee la API real (¿back .NET existente en otro repo? ¿equipo externo? ¿definir un nuevo backend en este repo?), y con qué spec formal (el contrato está implícito en los services + `API_INTEGRATION.md`).

### P1 — Dependencias en beta/new-major

Vue 3.6-beta, Vite 7 beta, Vue Router 5, Vuetify 4, Pinia 3, ESLint 10, Vitest 4. El bloque `overrides` de `package.json` congela toda la familia `@vue/*` en beta: los builds son reproducibles, pero hay riesgo de breaking changes entre betas, de incompatibilidades entre majors recién salidas y de supply chain. **Decisión requerida**: política de versiones (congelar y migrar a estables cuando salgan, o asumir el beta y blindarse con tests).

### P1 — Drift de documentación (lo que dice vs. lo que es)

| Doc | Error |
|---|---|
| `QUICK_START.md:14-19,70` y `API_INTEGRATION.md:20-25,50,77,149,173,243` | Referencian `src/stores/{categories,products,notifications,warehouses}.store.ts` y `@/stores` — **no existen**; el estado vive en composables |
| Ambos docs | `VITE_API_BASE_URL=http://localhost:5001/api`; el código usa `:5128` (commit 818c00b confirma 5128) |
| `API_INTEGRATION.md:77` | `router.push({ name: 'dashboard' })` — no existe ruta dashboard (`/` redirige a products) |
| `QUICK_START.md:107` | Import duplicado/roto (`import { useStock, MovementType } from '@/composables'`) |
| `.github/copilot-instructions.md` | Marca categories/warehouses/stock/notifications como "STUB" (están implementadas); referencia `useLoading.ts`/`useNotification.ts` inexistentes; dice 11 rutas (hay 12) |
| `README.md` | Es el scaffold de Vite sin tocar (`# vue-mvp`) |

### P2 — Suite de tests

1 test que rompería hoy (`useNavigation`), 1 stub (`LoginForm`), 0 tests de montaje de componentes, y el type-check no cubre los `__tests__`. La suite actual no protege las features que sí están implementadas.

---

## 7. Decisiones pendientes para las próximas fases

Ordenadas por dependencia (resolver la anterior desbloquea la siguiente):

1. **Definir el backend real** (P0): ¿quién provee la API REST del contrato 2.4? ¿Backend existente fuera del repo, o construir uno? Esto condiciona todos los features end-to-end.
2. **Política de dependencias** (P1): ¿migrar a estables cuando existan, o avanzar en beta con la versión congelada actual? Requiere decisión antes de tocar `package.json`.
3. **Sanear documentación** (P1): actualizar puertos, eliminar referencias a stores fantasma, corregir marcas "STUB" y reescribir `README.md`. Bajo costo, alto impacto en onboarding.
4. **Reparar y ampliar tests** (P2): arreglar `useNavigation.test.ts`, reemplazar el stub de `LoginForm`, agregar al menos un test de montaje por feature y sacar `__tests__` de la exclusión de type-check.
5. **Consolidar tipos y limpiar `any`** (P2): unificar `auth.types.ts`, tipar los catches con `extractError`.
6. **Repositorio**: gitignore de `.atl/` y `.codegraph/`.

**Positivos a preservar** (son la base para escalar features): consistencia de patrones en los 9 módulos, i18n paralelo completo, TS estricto, única convención documentada de errores, historial git limpio.

---

## 8. Checklist de verificación del equipo

- [ ] El equipo validó la tabla de stack (sección 1) contra el entorno real de desarrollo.
- [ ] Se definió quién provee el backend del contrato 2.4 y con qué spec.
- [ ] Se acordó la política de dependencias beta.
- [ ] Los docs (README/QUICK_START/API_INTEGRATION/copilot-instructions) fueron actualizados.
- [ ] `useNavigation.test.ts` pasa y `LoginForm.test.ts` dejó de ser stub.
- [ ] `npm run build` y `npm test` pasan en un entorno con `node_modules` instalado.
- [ ] Se validó el contenido real de `.env` (default de código: `:5128`).

---

## 9. Fuentes y archivos clave

| Archivo | Rol |
|---|---|
| `package.json` / `package-lock.json` | Dependencias y versiones resueltas |
| `vite.config.ts`, `vitest.config.ts`, `tsconfig*.json`, `eslint.config.js` | Configuración de tooling |
| `src/main.ts`, `src/App.vue`, `src/plugins/*` | Bootstrap y registro de plugins |
| `src/router/routes.ts`, `src/router/guards.ts` | Rutas y guards |
| `src/services/api.ts` + `src/services/*.service.ts` | Capa HTTP y contrato API |
| `src/composables/*` | Estado de entidades |
| `src/features/auth/stores/auth.store.ts` | Único store Pinia |
| `src/types/api.types.ts` | DTOs y enums |
| `src/i18n/locales/{es,en}.ts` | Traducciones |
| `src/plugins/vuetify.ts`, `src/assets/base.css` | Temas y design tokens |
| `app.py`, `requirements.txt` | Backend legacy (stub) |
| `README.md`, `QUICK_START.md`, `API_INTEGRATION.md`, `.github/copilot-instructions.md` | Documentación (con drift) |
