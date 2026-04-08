import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { notificationsService } from '@/services/notifications.service'
import type { NotificationDto } from '@/types/api.types'

export function useNotifications() {
  const { t } = useI18n()
  const notifications = ref<NotificationDto[]>([])
  const unreadCount = ref(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const pageNumber = ref(1)
  const totalPages = ref(0)

  const hasUnread = computed(() => unreadCount.value > 0)

  async function fetchNotifications(isRead?: boolean, pageNum = 1) {
    isLoading.value = true
    error.value = null
    try {
      const response = await notificationsService.getAll({
        isRead,
        pageNumber: pageNum,
        pageSize: 20,
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
      await fetchUnreadCount()
      await fetchNotifications()
    } catch (err: any) {
      error.value = err.response?.data?.message || t('errors.markAsRead')
      throw err
    }
  }

  async function markAllAsRead() {
    error.value = null
    try {
      await notificationsService.markAllAsRead()
      unreadCount.value = 0
      await fetchNotifications()
    } catch (err: any) {
      error.value = err.response?.data?.message || t('errors.markAllAsRead')
      throw err
    }
  }

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    pageNumber,
    totalPages,
    hasUnread,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
  }
}
