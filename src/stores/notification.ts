import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Notification } from '@/types'
import { getNotifications, markAsRead, markAllAsRead } from '@/api/notification'
import type { ApiResponse, PageResponse } from '@/types'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([]) // 通知列表
  const loading = ref(false) // 加载状态

  // 未读通知数量
  const unreadCount = computed(() =>
    notifications.value.filter(n => !n.isRead).length
  )

  // 获取通知列表
  async function fetchNotifications() {
    loading.value = true
    try {
      const res = (await getNotifications()) as unknown as ApiResponse<PageResponse<Notification>>
      notifications.value = res.data.list
      return res
    } finally {
      loading.value = false
    }
  }

  // 标记通知为已读
  async function markNotificationAsRead(id: number) {
    const res = (await markAsRead(id)) 
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.isRead = true
    }
    return res
  }

  // 标记所有通知为已读
  async function markAllNotificationsAsRead() {
    const res = await markAllAsRead()
    notifications.value.forEach(n => n.isRead = true)
    return res
  }

  // 添加新通知到列表
  function addNotification(notification: Notification) {
    notifications.value.unshift(notification)
  }

  return {
    notifications,
    loading,
    unreadCount,
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    addNotification
  }
})