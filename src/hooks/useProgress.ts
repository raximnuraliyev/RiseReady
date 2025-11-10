import { useState, useEffect } from 'react'
import ApiClient from '../utils/apiClient'

export type ProgressReminder = {
  id: string
  type: string
  message: string
  dueDate: string
  priority: 'low' | 'medium' | 'high'
  completed: boolean
}

export type UserProgress = {
  level: number
  experience: number
  nextLevelXp: number
  projects: {
    total: number
    completed: number
    active: number
    pending: number
  }
  history: Array<{
    date: string
    metric: string
    value: number
    change: number
  }>
}

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProgress = async () => {
    try {
      const data = await ApiClient.get<UserProgress>('/progress/progress')
      setProgress(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch progress')
    } finally {
      setLoading(false)
    }
  }

  const updateProjectStatus = async (projectId: string, status: 'completed' | 'active' | 'pending', change: number = 1) => {
    try {
      const data = await ApiClient.post<UserProgress['projects']>('/progress/project', { projectId, status, change })
      
      // Update local state
      setProgress(prev => prev ? {
        ...prev,
        projects: data
      } : null)
      
      // Refresh progress to get updated XP/level
      fetchProgress()
      
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project')
      return false
    }
  }

  const getReminders = async () => {
    try {
      const data = await ApiClient.get<ProgressReminder[]>('/progress/reminders')
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reminders')
      return []
    }
  }

  // Fetch initial progress
  useEffect(() => {
    fetchProgress()
  }, [])

  return {
    progress,
    loading,
    error,
    updateProjectStatus,
    getReminders,
    refresh: fetchProgress
  }
}