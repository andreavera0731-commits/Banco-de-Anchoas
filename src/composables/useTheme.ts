import { useTheme } from 'vuetify'
import { computed } from 'vue'

export function useThemeToggle() {
  const theme = useTheme()

  const isDark = computed(() => theme.global.current.value.dark)

  function toggle() {
    const next = isDark.value ? 'light' : 'dark'
    theme.change(next)
    localStorage.setItem('bda-theme', next)
  }

  function init() {
    const saved = localStorage.getItem('bda-theme')
    if (saved === 'light' || saved === 'dark') {
      theme.change(saved)
    } else if (globalThis.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme.change('dark')
    }
  }

  return { isDark, toggle, init }
}
