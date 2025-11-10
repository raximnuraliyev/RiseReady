import { useState, useEffect } from 'react'
import ApiClient from '../utils/apiClient'

interface AuthUser {
  id: string
  email: string
  name: string
  avatar?: string
}

interface AuthResponse {
  token: string
  user: AuthUser
}

interface MeResponse {
  user: AuthUser
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (!token || !storedUser) {
      setLoading(false)
      return
    }

    try {
      // Verify the stored user data is valid
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)

      // Verify token is still valid with server
      const verifyAuth = async () => {
        try {
          console.log('Verifying auth status...');
          const response = await ApiClient.get<MeResponse>('/auth/me');
          console.log('Auth response:', response);
          
          if (!response || !response.user) {
            console.error('Invalid auth response:', response);
            throw new Error('Invalid authentication state');
          }

          // Normalize avatar property (some API responses use avatarUrl)
          const u = response.user as unknown as Record<string, unknown>
          const avatarFromResp = typeof u.avatar === 'string'
            ? u.avatar
            : typeof u.avatarUrl === 'string'
            ? u.avatarUrl
            : typeof u.avatarLinkedIn === 'string'
            ? u.avatarLinkedIn
            : ''
          const normalized: AuthUser = { ...response.user, avatar: avatarFromResp }
          setUser(normalized)
          localStorage.setItem('user', JSON.stringify(normalized))

        } catch (err) {
          console.error('Auth verification failed:', err);
          setError(err instanceof Error ? err.message : 'Authentication failed');
          logout();
        }
      }

      verifyAuth();
    } catch (err) {
      console.error('Auth initialization error:', err)
      logout()
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshUser = async () => {
    try {
      const response = await ApiClient.get<MeResponse>('/users/me')
      if (response && response.user) {
        const u = response.user as unknown as Record<string, unknown>
        const avatarFromResp = typeof u.avatar === 'string'
          ? u.avatar
          : typeof u.avatarUrl === 'string'
          ? u.avatarUrl
          : typeof u.avatarLinkedIn === 'string'
          ? u.avatarLinkedIn
          : ''
        const normalized: AuthUser = { ...response.user, avatar: avatarFromResp }
        setUser(normalized)
        localStorage.setItem('user', JSON.stringify(normalized))
        return normalized
      }
    } catch (err) {
      console.error('Failed to refresh user:', err)
    }
    return null
  }

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await ApiClient.post<AuthResponse>('/auth/login', { email, password })
      
  // Normalize avatar property from login response
  const u2 = response.user as unknown as Record<string, unknown>
  const avatarFromLogin = typeof u2.avatar === 'string'
    ? u2.avatar
    : typeof u2.avatarUrl === 'string'
    ? u2.avatarUrl
    : typeof u2.avatarLinkedIn === 'string'
    ? u2.avatarLinkedIn
    : ''
  const normalizedLogin: AuthUser = { ...response.user, avatar: avatarFromLogin }
  localStorage.setItem('token', response.token)
  localStorage.setItem('user', JSON.stringify(normalizedLogin))
  setUser(normalizedLogin)
    } catch (err) {
      console.error('Login error:', err)
      setError(err instanceof Error ? err.message : 'Login failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout
    , refreshUser
  }
}

export default useAuth