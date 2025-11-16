import { useState, useEffect } from 'react'
import ApiClient from '../utils/apiClient'

type CheckIn = {
  _id: string
  mood: 'great' | 'good' | 'okay' | 'bad' | 'terrible'
  energy: number
  stress: number
  sleep?: number
  exercise: boolean
  notes: string
  date: string
}

type Streak = {
  streak: number
  lastCheckIn: string | null
}

type BestDay = {
  bestDay: string | null
  score: number
  mood?: string
  energy?: number
}

type Stats = {
  avgEnergy: number
  avgStress: number
  avgSleep: number
  exerciseDays: number
  totalCheckIns: number
}

export function useWellbeing() {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([])
  const [streak, setStreak] = useState<Streak>({ streak: 0, lastCheckIn: null })
  const [bestDay, setBestDay] = useState<BestDay>({ bestDay: null, score: 0 })
  const [stats, setStats] = useState<Stats>({ 
    avgEnergy: 0, 
    avgStress: 0, 
    avgSleep: 0, 
    exerciseDays: 0, 
    totalCheckIns: 0 
  })
  const [loading, setLoading] = useState(true)

  const fetchAll = async () => {
    try {
      const checkInsData = await ApiClient.get<CheckIn[]>('/checkins?days=30')
      const streakData = await ApiClient.get<Streak>('/checkins/streak')
      const bestDayData = await ApiClient.get<BestDay>('/checkins/best-day')
      const statsData = await ApiClient.get<Stats>('/checkins/stats?period=week')

      setCheckIns(Array.isArray(checkInsData) ? checkInsData : [])
      setStreak(streakData || { streak: 0, lastCheckIn: null })
      setBestDay(bestDayData || { bestDay: null, score: 0 })
      setStats(statsData || { avgEnergy: 0, avgStress: 0, avgSleep: 0, exerciseDays: 0, totalCheckIns: 0 })
    } catch (err) {
      console.error('Failed to fetch wellbeing data:', err)
    } finally {
      setLoading(false)
    }
  }

  const createCheckIn = async (checkInData: Omit<CheckIn, '_id' | 'date'>) => {
    try {
      await ApiClient.post('/checkins', checkInData)
      await fetchAll() // Refresh all data
  // notify global level refresh (check-ins can affect streak/points)
  try { window.dispatchEvent(new Event('refetchUserLevel')) } catch (err) { console.warn('refetchUserLevel dispatch failed', err) }
      return true
    } catch (err: unknown) {
      console.error('Failed to create check-in:', err)
      throw err
    }
  }

  const hasCheckedInToday = () => {
    if (checkIns.length === 0) return false
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const lastCheckIn = new Date(checkIns[0].date)
    lastCheckIn.setHours(0, 0, 0, 0)
    
    return today.getTime() === lastCheckIn.getTime()
  }

  useEffect(() => {
    fetchAll()
  }, [])

  return {
    checkIns,
    streak,
    bestDay,
    stats,
    loading,
    createCheckIn,
    hasCheckedInToday: hasCheckedInToday(),
    refetch: fetchAll
  }
}
