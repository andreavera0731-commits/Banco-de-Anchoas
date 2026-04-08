import { ref } from 'vue'

export function useSnackbar() {
  const visible = ref(false)
  const message = ref('')
  const color = ref<'success' | 'error'>('success')

  function show(msg: string, type: 'success' | 'error' = 'success') {
    message.value = msg
    color.value = type
    visible.value = true
  }

  return { visible, message, color, show }
}
