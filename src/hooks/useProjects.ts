import { useState, useEffect } from 'react'
import axios from 'axios'
import { Project, CreateProjectInput, UpdateProjectInput, AddTaskInput } from '../types/project'

const API_URL = '/api'

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}

// Transform backend data to frontend types
const transformProject = (data: any): Project => {
  return {
    id: data._id || data.id,
    title: data.title,
    description: data.description,
    dueDate: data.dueDate,
    members: (data.members || []).map((m: any) => ({
      id: m._id || m.id,
      name: m.name,
      avatar: m.avatar || ''
    })),
    leaderId: data.leaderId?._id || data.leaderId || '',
    progress: data.progress || 0,
    joinCode: data.joinCode,
    tasks: (data.tasks || []).map((t: any) => ({
      id: t._id || t.id,
      title: t.title,
      description: t.description || '',
      done: t.completed || t.done || false,
      assigneeId: t.assignedTo?._id || t.assignedTo || t.assigneeId,
      assigneeName: t.assignedTo?.name || undefined,
      importance: t.importance || 'medium',
      isGeneral: t.isGeneral || false,
      createdAt: t.createdAt,
      dueDate: t.dueDate,
      tags: t.tags || [],
      status: t.status || 'todo',
      subtasks: (t.subtasks || []).map((s: any) => ({
        id: s._id || s.id,
        title: s.title,
        completed: s.completed || false
      }))
    })),
    files: (data.files || []).map((f: any) => ({
      id: f._id || f.id,
      name: f.name,
      size: f.size || '',
      uploadedAt: f.uploadedAt || new Date().toISOString(),
      url: f.url
    })),
    messages: (data.messages || []).map((m: any) => ({
      id: m._id || m.id,
      author: {
        id: m.user?._id || m.user || m.author?._id || '',
        name: m.user?.name || m.author?.name || 'Unknown',
        avatar: m.user?.avatar || m.author?.avatar || ''
      },
      text: m.content || m.text || '',
      timestamp: m.createdAt || new Date().toISOString()
    })),
    createdAt: data.createdAt
  }
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/projects`, { headers: getAuthHeaders() })
      const transformed = (response.data || []).map(transformProject)
      setProjects(transformed)
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
      const response = await axios.post(`${API_URL}/projects`, data, { headers: getAuthHeaders() })
      const transformed = transformProject(response.data)
      setProjects(prev => [transformed, ...prev])
      return transformed
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create project'
      throw new Error(message)
    }
  }

  // Update project
  const updateProject = async (projectId: string, data: UpdateProjectInput) => {
    try {
      const response = await axios.put(`${API_URL}/projects/${projectId}`, data, { headers: getAuthHeaders() })
      const transformed = transformProject(response.data)
      setProjects(prev => 
        prev.map(p => p.id === projectId ? transformed : p)
      )
      return transformed
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update project'
      throw new Error(message)
    }
  }

  // Join project
  const joinProject = async (joinCode: string) => {
    try {
      const response = await axios.post(`${API_URL}/projects/join`, { joinCode }, { headers: getAuthHeaders() })
      const transformed = transformProject(response.data)
      setProjects(prev => [transformed, ...prev])
      return transformed
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to join project'
      throw new Error(message)
    }
  }

  // Leave project
  const leaveProject = async (projectId: string) => {
    try {
      await axios.post(`${API_URL}/projects/${projectId}/leave`, {}, { headers: getAuthHeaders() })
      setProjects(prev => prev.filter(p => p.id !== projectId))
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to leave project'
      throw new Error(message)
    }
  }

  // Add task
  const addTask = async (projectId: string, data: AddTaskInput) => {
    try {
      const response = await axios.post(`${API_URL}/projects/${projectId}/tasks`, data, { headers: getAuthHeaders() })
      const transformed = transformProject(response.data)
      setProjects(prev => 
        prev.map(p => p.id === projectId ? transformed : p)
      )
      return transformed
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to add task'
      throw new Error(message)
    }
  }

  // Toggle task
  const toggleTask = async (projectId: string, taskId: string) => {
    try {
      const response = await axios.put(`${API_URL}/projects/${projectId}/tasks/${taskId}`, {}, { headers: getAuthHeaders() })
      const transformed = transformProject(response.data)
      setProjects(prev => 
        prev.map(p => p.id === projectId ? transformed : p)
      )
      return transformed
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to toggle task'
      throw new Error(message)
    }
  }

  // Add message
  const addMessage = async (projectId: string, text: string) => {
    try {
      const response = await axios.post(`${API_URL}/projects/${projectId}/messages`, { text }, { headers: getAuthHeaders() })
      const transformed = transformProject(response.data)
      setProjects(prev => 
        prev.map(p => p.id === projectId ? transformed : p)
      )
      return transformed
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to add message'
      throw new Error(message)
    }
  }

  // Upload file
  const uploadFile = async (projectId: string, file: File) => {
    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', file)
      formData.append('name', file.name)
      formData.append('size', `${Math.round(file.size / 1024)}KB`)
      
      const config = {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data'
        }
      }
      
      const response = await axios.post(`${API_URL}/projects/${projectId}/files`, 
        { name: file.name, size: `${Math.round(file.size / 1024)}KB`, url: URL.createObjectURL(file) },
        { headers: getAuthHeaders() }
      )
      const transformed = transformProject(response.data)
      setProjects(prev => 
        prev.map(p => p.id === projectId ? transformed : p)
      )
      return transformed
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload file'
      throw new Error(message)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchProjects()
  }, [])

  // Remove a member from project
  const removeMember = async (projectId: string, memberId: string) => {
    try {
      const response = await axios.delete(`${API_URL}/projects/${projectId}/members/${memberId}`, 
        { headers: getAuthHeaders() }
      )
      const transformed = transformProject(response.data)
      setProjects(prev => 
        prev.map(p => p.id === projectId ? transformed : p)
      )
      return transformed
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to remove member'
      throw new Error(message)
    }
  }

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
    removeMember,
    refresh: fetchProjects
  }
}