import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Notification } from '@/types'
import { getNotifications, markAsRead, markAllAsRead } from '@/api/notification'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])
  const loading = ref(false)

  const unreadCount = computed(() =>
    notifications.value.filter(n => !n.isRead).length
  )

  async function fetchNotifications() {
    loading.value = true
    try {
      const res = await getNotifications()
      notifications.value = res.data.list
      return res
    } finally {
      loading.value = false
    }
  }

  async function markNotificationAsRead(id: number) {
    const res = await markAsRead(id)
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.isRead = true
    }
    return res
  }

  async function markAllNotificationsAsRead() {
    const res = await markAllAsRead()
    notifications.value.forEach(n => n.isRead = true)
    return res
  }

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