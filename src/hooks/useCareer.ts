import { useState, useEffect } from 'react'
import ApiClient from '../utils/apiClient'

export type Mentor = {
  _id: string
  name: string
  title: string
  company: string
  expertise: string[]
  bio: string
  avatar: string
  discordId: string
  availability: string
  rating: number
  sessionsCount: number
}

export type Resource = {
  _id: string
  title: string
  description: string
  url: string
  type: 'article' | 'video' | 'course' | 'tool' | 'template'
  category: string
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export type CareerTask = {
  _id: string
  userId: string
  title: string
  description: string
  category: string
  completed: boolean
  dueDate?: string
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  updatedAt: string
}

// use ApiClient with BASE_URL instead of building API_URL here

export function useCareer() {
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [tasks, setTasks] = useState<CareerTask[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all career data via ApiClient (avoids duplicate /api prefix issues)
  const fetchCareerData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [mentorsData, resourcesData, tasksData] = await Promise.all([
        ApiClient.get<Mentor[]>('/career/mentors'),
        ApiClient.get<Resource[]>('/career/resources'),
        ApiClient.get<CareerTask[]>('/career/tasks')
      ])

      setMentors(mentorsData || [])
      setResources(resourcesData || [])
      setTasks(tasksData || [])
      // inform other parts of the app that career data (and possibly points) updated
      try { window.dispatchEvent(new Event('refetchUserLevel')) } catch (err) { console.warn('refetchUserLevel dispatch failed', err) }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err || 'Failed to load career data')
      setError(message)
      console.error('Error fetching career data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCareerData()
  }, [])

  // Task CRUD operations
  const createTask = async (taskData: Partial<CareerTask>) => {
    try {
      const newTask = await ApiClient.post<CareerTask>('/career/tasks', taskData as unknown as Record<string, unknown>)
      setTasks([newTask, ...tasks])
      try { window.dispatchEvent(new Event('refetchUserLevel')) } catch (err) { console.warn('refetchUserLevel dispatch failed', err) }
      return newTask
    } catch (err: unknown) {
      console.error('Error creating task:', err)
      throw err
    }
  }

  const updateTask = async (taskId: string, updates: Partial<CareerTask>) => {
    try {
      const updatedTask = await ApiClient.put<CareerTask>(`/career/tasks/${taskId}`, updates as unknown as Record<string, unknown>)
      setTasks(tasks.map(t => t._id === taskId ? updatedTask : t))
      try { window.dispatchEvent(new Event('refetchUserLevel')) } catch (err) { console.warn('refetchUserLevel dispatch failed', err) }
      return updatedTask
    } catch (err: unknown) {
      console.error('Error updating task:', err)
      throw err
    }
  }

  const toggleTask = async (taskId: string) => {
    try {
      const task = tasks.find(t => t._id === taskId)
      if (!task) return

      const updatedTask = await ApiClient.put<CareerTask>(`/career/tasks/${taskId}`, { completed: !task.completed } as unknown as Record<string, unknown>)
      setTasks(tasks.map(t => t._id === taskId ? updatedTask : t))
    try { window.dispatchEvent(new Event('refetchUserLevel')) } catch (err) { console.warn('refetchUserLevel dispatch failed', err) }
      return updatedTask
    } catch (err: unknown) {
      console.error('Error toggling task:', err)
      throw err
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      await ApiClient.delete(`/career/tasks/${taskId}`)
      setTasks(tasks.filter(t => t._id !== taskId))
      try { window.dispatchEvent(new Event('refetchUserLevel')) } catch (err) { console.warn('refetchUserLevel dispatch failed', err) }
    } catch (err: unknown) {
      console.error('Error deleting task:', err)
      throw err
    }
  }

  return {
    mentors,
    resources,
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
    refetch: fetchCareerData
  }
}
