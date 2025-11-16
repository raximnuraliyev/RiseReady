import { useState, useEffect } from 'react'
import type { UserStats } from '../types/dashboard'
import ApiClient from '../utils/apiClient'

export const useDashboardState = () => {
  const [stats, setStats] = useState<UserStats>({
    focus: { totalSessions: 0, streak: 0 },
    wellbeing: { checkIns: 0, streak: 0 },
    skills: { total: 0, inProgress: 0 },
    career: { tasks: 0, completed: 0 }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshStats = async () => {
    try {
      setLoading(true)
      const [focusStats, wellbeingStats, skillsStats, careerStats] = await Promise.all([
        ApiClient.get<{ totalSessions: number; streak: number }>('/focus/stats'),
        ApiClient.get<{ checkIns: number; streak: number }>('/wellbeing/stats'),
        ApiClient.get<{ total: number; inProgress: number }>('/skills/summary'),
        ApiClient.get<{ tasks: number; completed: number }>('/career/summary')
      ])
      
      setStats({
        focus: focusStats,
        wellbeing: wellbeingStats,
        skills: skillsStats,
        career: careerStats
      })
      setError(null)
    } catch (err) {
      setError('Failed to fetch dashboard stats')
      console.error('Dashboard stats error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshStats()
  }, [])

  return {
    stats,
    loading,
    error,
    refreshStats
  }
}

export default useDashboardState