import request from '@/utils/request'
import type { ApiResponse, Notification, PageResponse } from '@/types'

export function getNotifications() {
  return request.get<ApiResponse<PageResponse<Notification>>>('/notifications')
}

export function markAsRead(id: number) {
  return request.put<ApiResponse>(`/notifications/${id}/read`)
}

export function markAllAsRead() {
  return request.put<ApiResponse>('/notifications/read-all')
}

export function deleteNotification(id: number) {
  return request.delete<ApiResponse>(`/notifications/${id}`)
}