import { computed } from 'vue'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import type { UserRole } from '@/types/api.types'

export interface NavItem {
  route: string
  icon: string
  titleKey: string
  role?: UserRole
}

export const navItems: readonly NavItem[] = [
  { route: 'products', icon: 'mdi-package-variant', titleKey: 'nav.products' },
  { route: 'stock', icon: 'mdi-swap-horizontal', titleKey: 'nav.stock' },
  { route: 'warehouses', icon: 'mdi-warehouse', titleKey: 'nav.warehouses' },
  { route: 'categories', icon: 'mdi-tag-multiple-outline', titleKey: 'nav.categories', role: 'Admin' },
  { route: 'users', icon: 'mdi-account-group-outline', titleKey: 'nav.users', role: 'Admin' },
  { route: 'notifications', icon: 'mdi-bell-outline', titleKey: 'nav.notifications' },
]

export function filterNavItems(items: readonly NavItem[], userRole: string | null): NavItem[] {
  return items.filter(item => !item.role || item.role === userRole)
}

export function useNavigation() {
  const auth = useAuthStore()

  const visibleItems = computed(() => filterNavItems(navItems, auth.userRole))

  return { visibleItems, navItems }
}
