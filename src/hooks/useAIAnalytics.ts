import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'

export interface AIMetrics {
  totalSessions: number
  totalMessages: number
  avgMessagesPerSession: number
  cacheHitRate: number
  avgResponseTime: number
  resolutionRate: number
  helpfulFeedback: number
  totalFeedback: number
  helpfulRate: number
  uniqueUsers: number
  topPageContexts: [string, number][]
}

export const useAIAnalytics = () => {
  const [metrics, setMetrics] = useState<AIMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = useCallback(async (startDate?: string, endDate?: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
      const response = await axios.get(
        `${apiUrl}/ai/analytics?${params.toString()}`
      )

      setMetrics(response.data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch analytics'
      setError(errorMessage)
      console.error('Analytics error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  return {
    metrics,
    isLoading,
    error,
    refetch: fetchAnalytics,
  }
}

// Hook for tracking individual session events
export const useAISessionTracker = (sessionId: string | null) => {
  const trackEvent = useCallback(
    (eventType: 'message_sent' | 'feedback_given' | 'session_started') => {
      if (!sessionId) return

      // You could send this to an analytics service
      console.log(`AI Event: ${eventType}`, { sessionId, timestamp: new Date() })
    },
    [sessionId]
  )

  return { trackEvent }
}
