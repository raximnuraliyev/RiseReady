const BASE_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? `${window.location.origin}/api` : 'http://localhost:4000/api')

export default class ApiClient {
  static async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('token')
    
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }))
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        })

        if (response.status === 401) {
          // Clear invalid auth data
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          if (window.location.pathname !== '/login') {
            window.location.href = '/login'
          }
          throw new Error(errorData.error || 'Session expired. Please login again.')
        }
        throw new Error(errorData.error || `API Error: ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('API Request failed:', error)
      throw error
    }
  }

  static async get<T>(endpoint: string): Promise<T> {
    return this.fetch<T>(endpoint)
  }

  static async post<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  static async put<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  }

  static async delete(endpoint: string) {
    return this.fetch(endpoint, {
      method: 'DELETE',
    })
  }
}