import { useState, useEffect } from 'react'
import ApiClient from '../utils/apiClient'

type Skill = {
  _id: string
  name: string
  category: string
  level: number
  practiced: number
  lastPracticed?: string
  notes: string
}

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSkills = async () => {
    try {
      const data = await ApiClient.get<Skill[]>('/skills')
      setSkills(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to fetch skills:', err)
    } finally {
      setLoading(false)
    }
  }

  const createSkill = async (skillData: { name: string; category?: string; level?: number }) => {
    try {
      const newSkill = await ApiClient.post<Skill>('/skills', skillData)
      if (newSkill) setSkills([...skills, newSkill])
      return newSkill
    } catch (err) {
      console.error('Failed to create skill:', err)
    }
  }

  const updateSkill = async (id: string, updates: Partial<Skill>) => {
    try {
      const updated = await ApiClient.put<Skill>(`/skills/${id}`, updates)
      if (updated) setSkills(skills.map(s => s._id === id ? updated : s))
      return updated
    } catch (err) {
      console.error('Failed to update skill:', err)
    }
  }

  const deleteSkill = async (id: string) => {
    try {
      await ApiClient.delete(`/skills/${id}`)
      setSkills(skills.filter(s => s._id !== id))
    } catch (err) {
      console.error('Failed to delete skill:', err)
    }
  }

  const practiceSkill = async (id: string) => {
    try {
      const updated = await ApiClient.post<Skill>(`/skills/${id}/practice`, {})
      if (updated) setSkills(skills.map(s => s._id === id ? updated : s))
      return updated
    } catch (err) {
      console.error('Failed to practice skill:', err)
    }
  }

  useEffect(() => {
    fetchSkills()
  }, [])

  return {
    skills,
    loading,
    createSkill,
    updateSkill,
    deleteSkill,
    practiceSkill,
    refetch: fetchSkills
  }
}
