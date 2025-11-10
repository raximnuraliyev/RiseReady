import { useState, useEffect } from 'react'
import ApiClient from '../utils/apiClient'
import { NotificationSettings, PrivacySettings } from '../types/settings'

export type Profile = {
  name: string
  pronouns?: string
  major?: string
  year?: string
  university?: string
  bio?: string
  linkedin?: string
  github?: string
  discord?: string
  telegram?: string
  avatar?: string
  avatarSource?: 'manual' | 'github' | 'linkedin'
  avatarGitHub?: string
  avatarLinkedIn?: string
}

export type Stat = {
  label: string
  value: string
}

export type Activity = {
  id: string
  text: string
  href: string
}

export type UserBadge = {
  _id: string
  badgeName: string
  earnedAt: string
}

export type LevelInfo = {
  level: number
  xp: number
  nextLevelXp: number
  progressPercent: number
}

export type UseProfileResult = {
  profile: Profile
  stats: Stat[]
  activity: Activity[]
  badges: UserBadge[]
  levelInfo: LevelInfo | null
  isLoading: boolean
  error: string | null
  updateProfile: (updates: Partial<Profile>) => Promise<void>
  updateSettings: (settings: { notifications?: Partial<NotificationSettings>; privacy?: Partial<PrivacySettings> }) => Promise<void>
  refreshData: () => Promise<void>
}

const defaultProfile: Profile = {
  name: '',
  pronouns: '',
  major: '',
  year: '',
  university: '',
  bio: '',
  linkedin: '',
  github: '',
  discord: '',
  telegram: '',
  avatarSource: 'manual',
  avatar: '',
}

export function useProfile(): UseProfileResult {
  const [profile, setProfile] = useState<Profile>(defaultProfile)
  const [stats, setStats] = useState<Stat[]>([])
  const [activity, setActivity] = useState<Activity[]>([])
  const [badges, setBadges] = useState<UserBadge[]>([])
  const [levelInfo, setLevelInfo] = useState<LevelInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      type ApiProfile = Profile & {
        avatarUrl?: string
        progress?: { level?: number; xp?: number; totalPoints?: number }
        level?: number
        xp?: number
      }
      const profileData = await ApiClient.get<ApiProfile>('/users/me')
  const statsData = await ApiClient.get<Stat[]>('/users/stats')
  const activityData = await ApiClient.get<Activity[]>('/users/activity')
  const badgesData = await ApiClient.get<UserBadge[]>('/focus/badges')

      setProfile({
        name: profileData.name || '',
        pronouns: profileData.pronouns || '',
        major: profileData.major || '',
        year: profileData.year || '',
        university: profileData.university || '',
        bio: profileData.bio || '',
        linkedin: profileData.linkedin || '',
        github: profileData.github || '',
        discord: profileData.discord || '',
        telegram: profileData.telegram || '',
        avatar: profileData.avatarUrl || '',
        avatarSource: 'manual',
      })

      setStats(statsData || [])
      setActivity(activityData || [])
      setBadges(badgesData || [])

      // Compute level info from profileData if available
  const prog = profileData?.progress || undefined
      const level = (prog && typeof prog.level === 'number') ? prog.level : (profileData?.level || 1)
      const xp = (prog && typeof prog.xp === 'number') ? prog.xp : (profileData?.xp || 0)
      const nextLevelXp = Math.floor(100 * Math.pow(1.2, level))
      const progressPercent = Math.max(0, Math.min(100, Math.round((xp / nextLevelXp) * 100)))
      setLevelInfo({ level, xp, nextLevelXp, progressPercent })
    } catch (err) {
      console.error('Failed to fetch profile data:', err)
      setError('Failed to load profile data')
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No auth token')
      
      const data = await ApiClient.put<ApiProfile>('/users/me', {
        name: updates.name,
        pronouns: updates.pronouns,
        major: updates.major,
        year: updates.year,
        university: updates.university,
        bio: updates.bio,
        linkedin: updates.linkedin,
        github: updates.github,
        discord: updates.discord,
        telegram: updates.telegram,
        avatarUrl: updates.avatar,
      })
      // Update localStorage user data
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      user.name = (data as ApiProfile).name
      user.avatarUrl = (data as ApiProfile).avatarUrl
      localStorage.setItem('user', JSON.stringify(user))
      
      await fetchData() // Refresh all data
    } catch (err) {
      console.error('Failed to update profile:', err)
      throw err
    }
  }

  const updateSettings = async (settings: { notifications?: Partial<NotificationSettings>; privacy?: Partial<PrivacySettings> }) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No auth token')
      
      await ApiClient.put('/users/me/settings', settings)
    } catch (err) {
      console.error('Failed to update settings:', err)
      throw err
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    profile,
    stats,
    activity,
    badges,
    levelInfo,
    isLoading,
    error,
    updateProfile,
    updateSettings,
    refreshData: fetchData
  }
}

export type ApiProfile = Profile & {
  avatarUrl?: string
  progress?: { level?: number; xp?: number; totalPoints?: number }
  level?: number
  xp?: number
}