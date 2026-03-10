import { ref } from 'vue'

export interface Notification {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

const notifications = ref<Notification[]>([])

export function useNotification() {
  function addNotification(
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
    duration = 5000,
  ) {
    const id = Date.now().toString()
    const notification: Notification = { id, message, type, duration }
    notifications.value.push(notification)

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }

    return id
  }

  function removeNotification(id: string) {
    notifications.value = notifications.value.filter((n) => n.id !== id)
  }

  return {
    notifications,
    addNotification,
    removeNotification,
  }
}
