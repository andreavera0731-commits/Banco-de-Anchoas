import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/features/auth/views/LoginView.vue'),
    meta: { layout: 'auth' },
  },
  {
    path: '/',
    redirect: { name: 'products' },
  },
  {
    path: '/products',
    name: 'products',
    component: () => import('@/features/products/views/ProductsView.vue'),
    meta: { requiresAuth: true, layout: 'default' },
  },
  {
    path: '/stock',
    name: 'stock',
    component: () => import('@/features/stock/views/StockView.vue'),
    meta: { requiresAuth: true, layout: 'default' },
  },
  {
    path: '/warehouses',
    name: 'warehouses',
    component: () => import('@/features/warehouses/views/WarehousesView.vue'),
    meta: { requiresAuth: true, layout: 'default' },
  },
  {
    path: '/categories',
    name: 'categories',
    component: () => import('@/features/categories/views/CategoriesView.vue'),
    meta: { requiresAuth: true, role: 'Admin', layout: 'default' },
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/features/users/views/UsersView.vue'),
    meta: { requiresAuth: true, role: 'Admin', layout: 'default' },
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('@/features/notifications/views/NotificationsView.vue'),
    meta: { requiresAuth: true, layout: 'default' },
  },
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: () => import('@/views/UnauthorizedView.vue'),
    meta: { layout: 'auth' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { layout: 'default' },
  },
]
