import { useState, useEffect } from 'react'
import ApiClient from '../utils/apiClient'

type FocusSession = {
  _id: string
  duration: number
  type: string
  completed: boolean
  notes: string
  startTime: string
  endTime: string
}

type Badge = {
  _id: string
  badgeName: string
  earnedAt: string
}

export function useFocus() {
  const [sessions, setSessions] = useState<FocusSession[]>([])
  const [badges, setBadges] = useState<Badge[]>([])
  const [streak, setStreak] = useState({ streak: 0, lastSession: null as string | null })
  const [totalTime, setTotalTime] = useState({ totalMinutes: 0, totalHours: 0, totalSessions: 0 })
  const [loading, setLoading] = useState(true)

  const fetchAll = async () => {
    try {
      const sessionsData = await ApiClient.get<FocusSession[]>('/focus/sessions?days=30')
      const badgesData = await ApiClient.get<Badge[]>('/focus/badges')
      const streakData = await ApiClient.get<{ streak: number; lastSession: string | null }>('/focus/streak')
      const totalData = await ApiClient.get<{ totalMinutes: number; totalHours: number; totalSessions: number }>('/focus/total?period=week')

      setSessions(Array.isArray(sessionsData) ? sessionsData : [])
      setBadges(Array.isArray(badgesData) ? badgesData : [])
      setStreak(streakData || { streak: 0, lastSession: null })
      setTotalTime(totalData || { totalMinutes: 0, totalHours: 0, totalSessions: 0 })
    } catch (err) {
      console.error('Failed to fetch focus data:', err)
    } finally {
      setLoading(false)
    }
  }

  const createSession = async (sessionData: {
    duration: number
    type?: string
    completed?: boolean
    notes?: string
    startTime: Date
    endTime: Date
  }) => {
    try {
      const json = await ApiClient.post<FocusSession>('/focus/sessions', sessionData)
      if (json) {
        await fetchAll() // Refresh all data including badges
        // notify global level to refresh (points may have changed)
        try { window.dispatchEvent(new Event('refetchUserLevel')) } catch (err) { console.warn('refetchUserLevel dispatch failed', err) }
        return json
      }
    } catch (err) {
      console.error('Failed to create focus session:', err)
      throw err
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  return {
    sessions,
    badges,
    streak,
    totalTime,
    loading,
    createSession,
    refetch: fetchAll
  }
}
