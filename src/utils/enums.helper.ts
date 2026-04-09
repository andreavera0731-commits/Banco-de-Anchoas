import { useI18n } from 'vue-i18n'

// Notification Type Colors (no i18n needed)
export const notificationTypeColors: Record<number, string> = {
  0: 'warning',
  1: 'info',
  2: 'error',
}

export function getNotificationTypeColor(type: number): string {
  return notificationTypeColors[type] || 'default'
}

// Movement Type Colors (no i18n needed)
export const movementTypeColors: Record<number, string> = {
  0: 'success',   // Entry
  1: 'warning',   // Exit
  2: 'error',     // WriteOff
  3: 'info',      // Relocation
  4: 'secondary', // Adjustment
}

export function getMovementTypeColor(type: number): string {
  return movementTypeColors[type] || 'default'
}

// Enum key mappings (index → translation key suffix)
const movementTypeKeys: Record<number, string> = {
  0: 'entry', 1: 'exit', 2: 'writeOff', 3: 'relocation', 4: 'adjustment',
}
const adjustmentTypeKeys: Record<number, string> = {
  0: 'increment', 1: 'decrement',
}
const movementReasonKeys: Record<number, string> = {
  0: 'expiration', 1: 'damage', 2: 'loss', 3: 'other',
}
const notificationTypeKeys: Record<number, string> = {
  0: 'lowStock', 1: 'expiringSoon', 2: 'expired',
}
const orderStatusKeys: Record<number, string> = {
  0: 'pending', 1: 'inProgress', 2: 'completed', 3: 'cancelled',
}
const userRoleKeys: Record<string, string> = {
  Admin: 'admin', Almacenista: 'warehouseWorker',
}
const productUnitKeys: Record<string, string> = {
  kg: 'kg', g: 'g', un: 'un', lt: 'lt', ml: 'ml',
}

/**
 * Composable that provides i18n-aware enum label getters.
 * Must be called within a component setup or composable context.
 */
export function useEnumLabels() {
  const { t } = useI18n()

  return {
    getMovementTypeLabel: (type: number) =>
      movementTypeKeys[type] ? t(`enums.movementType.${movementTypeKeys[type]}`) : t('enums.unknown'),
    getAdjustmentTypeLabel: (type: number) =>
      adjustmentTypeKeys[type] ? t(`enums.adjustmentType.${adjustmentTypeKeys[type]}`) : t('enums.unknown'),
    getMovementReasonLabel: (reason: number) =>
      movementReasonKeys[reason] ? t(`enums.movementReason.${movementReasonKeys[reason]}`) : t('enums.unknown'),
    getNotificationTypeLabel: (type: number) =>
      notificationTypeKeys[type] ? t(`enums.notificationType.${notificationTypeKeys[type]}`) : t('enums.unknown'),
    getOrderStatusLabel: (status: number) =>
      orderStatusKeys[status] ? t(`enums.orderStatus.${orderStatusKeys[status]}`) : t('enums.unknown'),
    getUserRoleLabel: (role: string) =>
      userRoleKeys[role] ? t(`enums.userRole.${userRoleKeys[role]}`) : t('enums.unknown'),
    getProductUnitLabel: (unit: string) =>
      productUnitKeys[unit] ? t(`enums.productUnit.${productUnitKeys[unit]}`) : unit,
  }
}
