import api from './api'
import type {
  ApiResponse,
  PaginatedList,
  NotificationDto,
  GetNotificationsParams,
} from '@/types/api.types'

export const notificationsService = {
  getAll(params?: GetNotificationsParams) {
    return api.get<ApiResponse<PaginatedList<NotificationDto>>>('/notifications', { params })
  },

  getUnreadCount() {
    return api.get<ApiResponse<number>>('/notifications/unread-count')
  },

  markAsRead(id: number) {
    return api.put(`/notifications/${id}/read`)
  },

  markAllAsRead() {
    return api.put('/notifications/read-all')
  },
}
