import { useState, useEffect } from 'react'
import ApiClient from '../utils/apiClient'

export function useUserLevel() {
  const [level, setLevel] = useState(1)
  const [points, setPoints] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchUserLevel = async () => {
    try {
      interface MeResp { level?: number; totalPoints?: number }
      const data = await ApiClient.get<MeResp>('/users/me')
      const remoteLevel = typeof data.level === 'number' ? data.level : 1
      const remotePoints = typeof data.totalPoints === 'number' ? data.totalPoints : 0
      setLevel(remoteLevel)
      setPoints(remotePoints)
      const userRaw = localStorage.getItem('user')
      try {
        const user = userRaw ? JSON.parse(userRaw) as Record<string, unknown> : {}
        user.level = remoteLevel
        user.totalPoints = remotePoints
        localStorage.setItem('user', JSON.stringify(user))
      } catch {
        // ignore local storage parse errors
      }
    } catch (err) {
      console.error('Failed to fetch user level:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserLevel()
  }, [])

  // Listen for a global event so other hooks/pages can request a refresh
  useEffect(() => {
    const handler = () => fetchUserLevel()
    window.addEventListener('refetchUserLevel', handler)
    return () => window.removeEventListener('refetchUserLevel', handler)
  }, [])

  const nextLevelPoints = level * 100
  const pointsIntoLevel = points - Math.max(0, (level - 1) * 100)
  const progressToNextLevel = Math.max(0, Math.min(100, Math.round((pointsIntoLevel / nextLevelPoints) * 100)))

  return {
    level,
    points,
    loading,
    nextLevelPoints,
    progressToNextLevel,
    refetch: fetchUserLevel
  }
}
