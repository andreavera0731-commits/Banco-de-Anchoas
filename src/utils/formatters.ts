/**
 * Formatea una fecha al formato DD/MM/YYYY
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

/**
 * Formatea una fecha con hora DD/MM/YYYY HH:mm
 */
export function formatDateTime(date: string | Date): string {
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${minutes}`
}

/**
 * Formatea un número como moneda
 */
export function formatCurrency(amount: number, locale = 'es-ES', currency = 'EUR'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Capitaliza la primera letra de un string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Formatea un número con separadores de miles
 */
export function formatNumber(num: number, decimals = 2): string {
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)
}

/**
 * Trunca un string a una longitud máxima
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + '...'
}

/**
 * Calcula tiempo relativo (ej: hace 2 horas)
 * Requires a t() function from vue-i18n for localized output.
 */
export function formatRelativeTime(date: string | Date, t: (key: string, count?: number) => string): string {
  const d = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffSecs = Math.round(diffMs / 1000)
  const diffMins = Math.round(diffSecs / 60)
  const diffHours = Math.round(diffMins / 60)
  const diffDays = Math.round(diffHours / 24)

  if (diffSecs < 60) return t('relativeTime.justNow')
  if (diffMins < 60) return t('relativeTime.minutesAgo', diffMins)
  if (diffHours < 24) return t('relativeTime.hoursAgo', diffHours)
  if (diffDays < 7) return t('relativeTime.daysAgo', diffDays)
  
  return formatDate(d)
}

/**
 * Returns a Vuetify color name for a stock chip based on stock level.
 */
export function getStockColor(stock: number, minimumStock: number): string {
  return stock <= minimumStock && minimumStock > 0 ? 'error' : 'success'
}
