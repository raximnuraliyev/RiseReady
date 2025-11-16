import { useState, useEffect } from 'react'
import ApiClient from '../utils/apiClient'
import socketUtils from '../utils/socket'
import type { AppNotification } from '../types/notification'

type Notification = {
  _id: string
  type: 'reminder' | 'achievement' | 'alert' | 'social' | 'career'
  title: string
  message: string
  link?: string
  isRead: boolean
  priority: 'high' | 'medium' | 'low'
  createdAt: string
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = async () => {
    try {
      const data = await ApiClient.get<Notification[]>('/notifications')
      setNotifications(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await ApiClient.put(`/notifications/${id}/read`, {})
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, isRead: true } : n
      ))
    } catch (err) {
      console.error('Failed to mark as read:', err)
    }
  }

  const markAllAsRead = async () => {
    try {
      await ApiClient.post('/notifications/markAllRead', {})
      setNotifications(notifications.map(n => ({ ...n, isRead: true })))
    } catch (err) {
      console.error('Failed to mark all as read:', err)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      await ApiClient.delete(`/notifications/${id}`)
      setNotifications(notifications.filter(n => n._id !== id))
    } catch (err) {
      console.error('Failed to delete notification:', err)
    }
  }

  useEffect(() => {
    fetchNotifications()

    // Poll notifications regularly so scheduled reminders (created with a future createdAt)
    // become visible when their scheduled time arrives. Poll every 60 seconds.
    const interval = setInterval(() => {
      fetchNotifications()
    }, 60 * 1000)

    // Also listen for socket notifications so they appear in realtime
    const off = socketUtils.onNotification((payload: AppNotification) => {
      if (!payload) return
      // Prepend new notification if not already present
      setNotifications((prev) => {
        // Avoid duplicates by _id
        if (prev.some((n) => n._id === payload._id)) return prev
        return [payload, ...prev]
      })
    })

    // Listen for manual refetch events dispatched by other app areas (calendar)
    const refetchHandler = () => fetchNotifications()
    window.addEventListener('refetchNotifications', refetchHandler)

    return () => {
      off()
      window.removeEventListener('refetchNotifications', refetchHandler)
      clearInterval(interval)
    }
  }, [])

  const unreadCount = notifications.filter(n => !n.isRead).length

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch: fetchNotifications
  }
}
