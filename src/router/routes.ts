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
    path: '/unauthorized',
    name: 'unauthorized',
    component: () => import('@/views/UnauthorizedView.vue'),
    meta: { layout: 'auth' },
  },
]
