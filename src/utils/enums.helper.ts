import type {
  MovementType,
  AdjustmentType,
  MovementReason,
  NotificationType,
  OrderStatus,
} from '@/types/api.types'

// Movement Type Labels
export const movementTypeLabels: Record<number, string> = {
  0: 'Entrada',
  1: 'Salida',
  2: 'Baja',
  3: 'Reubicación',
  4: 'Ajuste',
}

export function getMovementTypeLabel(type: number): string {
  return movementTypeLabels[type] || 'Desconocido'
}

// Adjustment Type Labels
export const adjustmentTypeLabels: Record<number, string> = {
  0: 'Incremento',
  1: 'Decremento',
}

export function getAdjustmentTypeLabel(type: number): string {
  return adjustmentTypeLabels[type] || 'Desconocido'
}

// Movement Reason Labels
export const movementReasonLabels: Record<number, string> = {
  0: 'Expiración',
  1: 'Daño',
  2: 'Pérdida',
  3: 'Otro',
}

export function getMovementReasonLabel(reason: number): string {
  return movementReasonLabels[reason] || 'Desconocido'
}

// Notification Type Labels
export const notificationTypeLabels: Record<number, string> = {
  0: 'Stock bajo',
  1: 'Próximo a vencer',
  2: 'Vencido',
}

export function getNotificationTypeLabel(type: number): string {
  return notificationTypeLabels[type] || 'Desconocido'
}

// Notification Type Colors
export const notificationTypeColors: Record<number, string> = {
  0: 'warning',
  1: 'info',
  2: 'error',
}

export function getNotificationTypeColor(type: number): string {
  return notificationTypeColors[type] || 'default'
}

// Order Status Labels
export const orderStatusLabels: Record<number, string> = {
  0: 'Pendiente',
  1: 'En proceso',
  2: 'Completado',
  3: 'Cancelado',
}

export function getOrderStatusLabel(status: number): string {
  return orderStatusLabels[status] || 'Desconocido'
}

// User Role Labels
export const userRoleLabels: Record<string, string> = {
  Admin: 'Administrador',
  Almacenista: 'Almacenista',
}

export function getUserRoleLabel(role: string): string {
  return userRoleLabels[role] || 'Desconocido'
}

// Product Unit Labels
export const productUnitLabels: Record<string, string> = {
  kg: 'Kilogramos',
  g: 'Gramos',
  un: 'Unidades',
  lt: 'Litros',
  ml: 'Mililitros',
}

export function getProductUnitLabel(unit: string): string {
  return productUnitLabels[unit] || unit
}
