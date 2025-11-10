import { useState, useEffect } from 'react'
import ApiClient from '../utils/apiClient'
import type { CalendarEvent } from '../pages/dashboard/CalendarPage'

export function useCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const data = await ApiClient.get<CalendarEvent[]>('/calendar/events')
      // Ensure dates are converted to Date objects
      const parsed = (data || []).map(e => ({ ...e, startTime: new Date(e.startTime), endTime: new Date(e.endTime) }))
      setEvents(parsed)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch calendar events', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch events')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const createEvent = async (event: Omit<CalendarEvent, 'id'>) => {
    try {
      const payload = { ...event }
      // convert Dates to ISO strings
      const body = { ...payload, startTime: payload.startTime.toISOString(), endTime: payload.endTime.toISOString() }
      const created = await ApiClient.post<CalendarEvent>('/calendar/events', body)
      const parsed = { ...created, startTime: new Date(created.startTime), endTime: new Date(created.endTime) }
      setEvents(prev => [...prev, parsed])
      // If a reminder time is due now or in the past, trigger an immediate notifications refetch
      try {
        const reminderMinutes = (payload.reminder ?? (created as unknown as { reminderMinutes?: number }).reminderMinutes) ?? null
        if (reminderMinutes) {
          const remindAt = new Date(parsed.startTime.getTime() - Number(reminderMinutes) * 60 * 1000)
          const now = new Date()
          if (remindAt.getTime() <= now.getTime()) {
            // fire a global event that notifications hook listens to
            window.dispatchEvent(new CustomEvent('refetchNotifications'))
          }
        }
      } catch (err) {
        // noop
      }
      return parsed
    } catch (err) {
      console.error('Failed to create event', err)
      throw err
    }
  }

  const updateEvent = async (event: CalendarEvent) => {
    try {
      const body = { ...event, startTime: event.startTime.toISOString(), endTime: event.endTime.toISOString() }
      const updated = await ApiClient.put<CalendarEvent>(`/calendar/events/${event.id}`, body)
      const parsed = { ...updated, startTime: new Date(updated.startTime), endTime: new Date(updated.endTime) }
      setEvents(prev => prev.map(e => (e.id === parsed.id ? parsed : e)))

      try {
        const reminderMinutes = (event.reminder ?? (updated as unknown as { reminderMinutes?: number }).reminderMinutes) ?? null
        if (reminderMinutes) {
          const remindAt = new Date(parsed.startTime.getTime() - Number(reminderMinutes) * 60 * 1000)
          const now = new Date()
          if (remindAt.getTime() <= now.getTime()) {
            window.dispatchEvent(new CustomEvent('refetchNotifications'))
          }
        }
      } catch {
        // noop
      }

      return parsed
    } catch (err) {
      console.error('Failed to update event', err)
      throw err
    }
  }

  const deleteEvent = async (id: string) => {
    try {
      await ApiClient.delete(`/calendar/events/${id}`)
      setEvents(prev => prev.filter(e => e.id !== id))
      // If a reminder was deleted, refetch notifications to remove it from the list
      try {
        window.dispatchEvent(new CustomEvent('refetchNotifications'))
      } catch {
        // noop
      }
      return true
    } catch (err) {
      console.error('Failed to delete event', err)
      throw err
    }
  }

  return { events, loading, error, fetchEvents, createEvent, updateEvent, deleteEvent }
}

export default useCalendar
