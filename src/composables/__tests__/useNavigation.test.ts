import { describe, it, expect } from 'vitest'
import { filterNavItems, navItems, type NavItem } from '../useNavigation'

describe('useNavigation', () => {
  describe('navItems', () => {
    it('contains all expected routes', () => {
      const routes = navItems.map(item => item.route)
      expect(routes).toEqual([
        'products',
        'stock',
        'warehouses',
        'categories',
        'users',
        'notifications',
      ])
    })

    it('marks categories and users as Admin-only', () => {
      const adminOnly = navItems.filter(item => item.role === 'Admin')
      expect(adminOnly.map(i => i.route)).toEqual(['categories', 'users'])
    })

    it('has no role restriction on shared items', () => {
      const shared = navItems.filter(item => !item.role)
      expect(shared.map(i => i.route)).toEqual([
        'products',
        'stock',
        'warehouses',
        'notifications',
      ])
    })
  })

  describe('filterNavItems', () => {
    const items: NavItem[] = [
      { route: 'products', icon: 'mdi-package-variant', titleKey: 'nav.products' },
      { route: 'categories', icon: 'mdi-tag-multiple-outline', titleKey: 'nav.categories', role: 'Admin' },
      { route: 'users', icon: 'mdi-account-group-outline', titleKey: 'nav.users', role: 'Admin' },
      { route: 'notifications', icon: 'mdi-bell-outline', titleKey: 'nav.notifications' },
    ]

    it('shows all items for Admin role', () => {
      const result = filterNavItems(items, 'Admin')
      expect(result).toHaveLength(4)
      expect(result.map(i => i.route)).toEqual([
        'products',
        'categories',
        'users',
        'notifications',
      ])
    })

    it('hides Admin-only items for Almacenista role', () => {
      const result = filterNavItems(items, 'Almacenista')
      expect(result).toHaveLength(2)
      expect(result.map(i => i.route)).toEqual(['products', 'notifications'])
    })

    it('hides Admin-only items when role is null', () => {
      const result = filterNavItems(items, null)
      expect(result).toHaveLength(2)
      expect(result.map(i => i.route)).toEqual(['products', 'notifications'])
    })

    it('returns empty array for empty items', () => {
      const result = filterNavItems([], 'Admin')
      expect(result).toHaveLength(0)
    })

    it('does not mutate the original array', () => {
      const original = [...items]
      filterNavItems(items, 'Almacenista')
      expect(items).toEqual(original)
    })
  })
})
