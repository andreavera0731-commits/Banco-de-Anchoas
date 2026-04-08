import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { notificationsService } from '@/services/notifications.service'
import type { NotificationDto } from '@/types/api.types'

export const useNotificationsStore = defineStore('notifications', () => {
  const { t } = useI18n()
  const notifications = ref<NotificationDto[]>([])
  const unreadCount = ref(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const pageNumber = ref(1)
  const pageSize = ref(20)
  const totalPages = ref(0)

  const hasUnread = computed(() => unreadCount.value > 0)
  const unreadNotifications = computed(() =>
    notifications.value.filter((n) => !n.isRead),
  )

  async function fetchNotifications(isRead?: boolean) {
    isLoading.value = true
    error.value = null
    try {
      const response = await notificationsService.getAll({
        isRead,
        pageNumber: pageNumber.value,
        pageSize: pageSize.value,
      })
      notifications.value = response.data.data.items
      pageNumber.value = response.data.data.pageNumber
      totalPages.value = response.data.data.totalPages
    } catch (err: any) {
      error.value = err.response?.data?.message || t('errors.loadNotifications')
    } finally {
      isLoading.value = false
    }
  }

  async function fetchUnreadCount() {
    try {
      const response = await notificationsService.getUnreadCount()
      unreadCount.value = response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || t('errors.loadUnreadCount')
    }
  }

  async function markAsRead(id: number) {
    error.value = null
    try {
      await notificationsService.markAsRead(id)
      // Actualizar estado local
      const notification = notifications.value.find((n) => n.id === id)
      if (notification) {
        notification.isRead = true
        notification.readAt = new Date().toISOString()
        unreadCount.value = Math.max(0, unreadCount.value - 1)
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || t('errors.markAsRead')
    }
  }

  async function markAllAsRead() {
    error.value = null
    try {
      await notificationsService.markAllAsRead()
      // Actualizar estado local
      const now = new Date().toISOString()
      notifications.value.forEach((n) => {
        n.isRead = true
        n.readAt = now
      })
      unreadCount.value = 0
    } catch (err: any) {
      error.value = err.response?.data?.message || t('errors.markAllAsRead')
    }
  }

  function clearCache() {
    notifications.value = []
    unreadCount.value = 0
    pageNumber.value = 1
  }

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    pageNumber,
    totalPages,
    hasUnread,
    unreadNotifications,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    clearCache,
  }
})
