import api from './api'
import type { ApiResponse, PaginatedList, NotificationDto, GetNotificationsParams } from '@/types/api.types'

export const notificationsService = {
  // Obtener notificaciones paginadas
  getNotifications(params?: GetNotificationsParams) {
    return api.get<ApiResponse<PaginatedList<NotificationDto>>>('/notifications', { params })
  },

  // Obtener cantidad de notificaciones no leídas
  getUnreadCount() {
    return api.get<ApiResponse<number>>('/notifications/unread-count')
  },

  // Marcar una notificación como leída
  markAsRead(id: number) {
    return api.put(`/notifications/${id}/read`)
  },

  // Marcar todas las notificaciones como leídas
  markAllAsRead() {
    return api.put('/notifications/read-all')
  },
}
