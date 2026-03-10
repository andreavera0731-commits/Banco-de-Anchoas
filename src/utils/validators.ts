import { useI18n } from 'vue-i18n'

/**
 * Valida que un email sea válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valida que una contraseña tenga al menos 8 caracteres
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 8
}

/**
 * Valida que un campo no esté vacío
 */
export function isRequired(value: string): boolean {
  return value.trim().length > 0
}

/**
 * Reglas de validación para formularios (legacy, sin i18n)
 */
export const formValidationRules = {
  email: [
    (v: string) => !!v || 'Email es requerido',
    (v: string) => isValidEmail(v) || 'Email no es válido',
  ],
  password: [
    (v: string) => !!v || 'Contraseña es requerida',
    (v: string) => isValidPassword(v) || 'Contraseña debe tener al menos 8 caracteres',
  ],
  required: [(v: string) => isRequired(v) || 'Este campo es requerido'],
}

/**
 * Reglas de validación con i18n (composable)
 */
export function useValidationRules() {
  const { t } = useI18n()

  return {
    email: [
      (v: string) => !!v || t('validation.emailRequired'),
      (v: string) => isValidEmail(v) || t('validation.emailInvalid'),
    ],
    password: [
      (v: string) => !!v || t('validation.passwordRequired'),
      (v: string) => isValidPassword(v) || t('validation.passwordMinLength'),
    ],
    required: [(v: string) => isRequired(v) || t('validation.fieldRequired')],
  }
}
