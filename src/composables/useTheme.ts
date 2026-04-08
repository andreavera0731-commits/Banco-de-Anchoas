import { useTheme } from 'vuetify'
import { computed } from 'vue'

export function useThemeToggle() {
  const theme = useTheme()

  const isDark = computed(() => theme.global.current.value.dark)

  function toggle() {
    const next = isDark.value ? 'light' : 'dark'
    theme.global.name.value = next
    localStorage.setItem('bda-theme', next)
  }

  function init() {
    const saved = localStorage.getItem('bda-theme')
    if (saved === 'light' || saved === 'dark') {
      theme.global.name.value = saved
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme.global.name.value = 'dark'
    }
  }

  return { isDark, toggle, init }
}
