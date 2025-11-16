import { useState, useEffect } from 'react'
import axios from 'axios'
import { Project, CreateProjectInput, UpdateProjectInput, AddTaskInput } from '../types/project'

const API_URL = '/api'

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/projects`)
      setProjects(response.data)
      setError(null)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch projects'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  // Create new project
  const createProject = async (data: CreateProjectInput) => {
    try {
      const response = await axios.post(`${API_URL}/projects`, data)
      setProjects(prev => [response.data, ...prev])
      return response.data
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create project'
      throw new Error(message)
    }
  }

  // Update project
  const updateProject = async (projectId: string, data: UpdateProjectInput) => {
    try {
      const response = await axios.put(`${API_URL}/projects/${projectId}`, data)
      setProjects(prev => 
        prev.map(p => p.id === projectId ? response.data : p)
      )
      return response.data
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update project'
      throw new Error(message)
    }
  }

  // Join project
  const joinProject = async (joinCode: string) => {
    try {
      const response = await axios.post(`${API_URL}/projects/join`, { joinCode })
      setProjects(prev => [response.data, ...prev])
      return response.data
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to join project'
      throw new Error(message)
    }
  }

  // Leave project
  const leaveProject = async (projectId: string) => {
    try {
      await axios.post(`${API_URL}/projects/${projectId}/leave`)
      setProjects(prev => prev.filter(p => p.id !== projectId))
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to leave project'
      throw new Error(message)
    }
  }

  // Add task
  const addTask = async (projectId: string, data: AddTaskInput) => {
    try {
      const response = await axios.post(`${API_URL}/projects/${projectId}/tasks`, data)
      setProjects(prev => 
        prev.map(p => p.id === projectId ? response.data : p)
      )
      return response.data
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to add task'
      throw new Error(message)
    }
  }

  // Toggle task
  const toggleTask = async (projectId: string, taskId: string) => {
    try {
      const response = await axios.put(`${API_URL}/projects/${projectId}/tasks/${taskId}`)
      setProjects(prev => 
        prev.map(p => p.id === projectId ? response.data : p)
      )
      return response.data
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to toggle task'
      throw new Error(message)
    }
  }

  // Add message
  const addMessage = async (projectId: string, text: string) => {
    try {
      const response = await axios.post(`${API_URL}/projects/${projectId}/messages`, { text })
      setProjects(prev => 
        prev.map(p => p.id === projectId ? response.data : p)
      )
      return response.data
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to add message'
      throw new Error(message)
    }
  }

  // Upload file
  const uploadFile = async (projectId: string, file: File) => {
    try {
      // TODO: Implement file upload service integration
      // For now, we'll just simulate with file metadata
      const data = {
        name: file.name,
        size: `${Math.round(file.size / 1024)}KB`,
        url: URL.createObjectURL(file) // Temporary URL for demo
      }
      const response = await axios.post(`${API_URL}/projects/${projectId}/files`, data)
      setProjects(prev => 
        prev.map(p => p.id === projectId ? response.data : p)
      )
      return response.data
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload file'
      throw new Error(message)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchProjects()
  }, [])

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    joinProject,
    leaveProject,
    addTask,
    toggleTask,
    addMessage,
    uploadFile,
    refresh: fetchProjects
  }
}