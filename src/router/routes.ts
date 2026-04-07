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
    name: 'dashboard',
    component: () => import('@/features/dashboard/views/DashboardView.vue'),
    meta: { requiresAuth: true, layout: 'default' },
  },
  {
    path: '/products',
    name: 'products',
    component: () => import('@/views/HomeView.vue'),
    meta: { requiresAuth: true, layout: 'default' },
  },
  {
    path: '/products/:id',
    name: 'product-detail',
    component: () => import('@/views/AboutView.vue'),
    meta: { requiresAuth: true, layout: 'default' },
  },
  {
    path: '/stock',
    name: 'stock',
    component: () => import('@/views/HomeView.vue'),
    meta: { requiresAuth: true, layout: 'default' },
  },
  {
    path: '/warehouses',
    name: 'warehouses',
    component: () => import('@/views/HomeView.vue'),
    meta: { requiresAuth: true, layout: 'default' },
  },
  {
    path: '/categories',
    name: 'categories',
    component: () => import('@/views/HomeView.vue'),
    meta: { requiresAuth: true, role: 'Admin', layout: 'default' },
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/views/HomeView.vue'),
    meta: { requiresAuth: true, role: 'Admin', layout: 'default' },
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('@/views/HomeView.vue'),
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
    component: () => import('@/views/HomeView.vue'),
    meta: { layout: 'default' },
  },
]
