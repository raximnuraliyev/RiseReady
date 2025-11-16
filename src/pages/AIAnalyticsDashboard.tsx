import React, { useState } from 'react'
import { useAIAnalytics } from '../hooks/useAIAnalytics'
import '../styles/AIAnalytics.css'

interface DateRange {
  startDate: string
  endDate: string
}

export default function AIAnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  })

  const { metrics, isLoading, error, refetch } = useAIAnalytics()

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setDateRange(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRefresh = () => {
    refetch(dateRange.startDate, dateRange.endDate)
  }

  if (isLoading) {
    return <div className="analytics-loading">Loading analytics...</div>
  }

  if (error) {
    return <div className="analytics-error">Error: {error}</div>
  }

  if (!metrics) {
    return <div className="analytics-empty">No data available</div>
  }

  return (
    <div className="ai-analytics-dashboard">
      <h1>AI Assistant Analytics</h1>

      {/* Date Range Filter */}
      <div className="analytics-controls">
        <div className="date-range">
          <label>
            Start Date:
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
            />
          </label>
          <label>
            End Date:
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
            />
          </label>
          <button onClick={handleRefresh} className="refresh-btn">
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        {/* Engagement */}
        <div className="metric-card">
          <h3>Engagement</h3>
          <div className="metric-item">
            <span className="label">Total Sessions:</span>
            <span className="value">{metrics.totalSessions}</span>
          </div>
          <div className="metric-item">
            <span className="label">Total Messages:</span>
            <span className="value">{metrics.totalMessages}</span>
          </div>
          <div className="metric-item">
            <span className="label">Avg Messages/Session:</span>
            <span className="value">
              {metrics.avgMessagesPerSession.toFixed(2)}
            </span>
          </div>
          <div className="metric-item">
            <span className="label">Unique Users:</span>
            <span className="value">{metrics.uniqueUsers}</span>
          </div>
        </div>

        {/* Performance */}
        <div className="metric-card">
          <h3>Performance</h3>
          <div className="metric-item">
            <span className="label">Avg Response Time:</span>
            <span className="value">{metrics.avgResponseTime.toFixed(0)}ms</span>
          </div>
          <div className="metric-item">
            <span className="label">Cache Hit Rate:</span>
            <span className="value success">
              {metrics.cacheHitRate.toFixed(1)}%
            </span>
          </div>
          <div className="metric-item">
            <span className="label">Resolution Rate:</span>
            <span className="value info">
              {metrics.resolutionRate.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Satisfaction */}
        <div className="metric-card">
          <h3>Satisfaction</h3>
          <div className="metric-item">
            <span className="label">Helpful Feedback:</span>
            <span className="value success">{metrics.helpfulFeedback}</span>
          </div>
          <div className="metric-item">
            <span className="label">Total Feedback:</span>
            <span className="value">{metrics.totalFeedback}</span>
          </div>
          <div className="metric-item">
            <span className="label">Helpful Rate:</span>
            <span className="value success">
              {metrics.helpfulRate.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Top Page Contexts */}
      <div className="top-contexts">
        <h3>Top Features by Assistance Requests</h3>
        <div className="context-list">
          {metrics.topPageContexts.map(([context, count], idx) => (
            <div key={idx} className="context-item">
              <span className="context-name">{context}</span>
              <span className="context-count">{count} requests</span>
              <div className="context-bar">
                <div
                  className="context-bar-fill"
                  style={{
                    width: `${
                      (count /
                        Math.max(
                          ...metrics.topPageContexts.map(([, c]) => c)
                        )) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cost Estimate */}
      <div className="cost-estimate">
        <h3>Cost Analysis</h3>
        <div className="cost-info">
          <p>
            <strong>Cache Hit Rate:</strong> {metrics.cacheHitRate.toFixed(1)}%
          </p>
          <p>
            <strong>Estimated API Calls:</strong>{' '}
            {(
              metrics.totalMessages -
              (metrics.totalMessages * metrics.cacheHitRate) / 100
            ).toFixed(0)}
          </p>
          <p>
            <strong>Est. Cost:</strong> $
            {(
              (metrics.totalMessages -
                (metrics.totalMessages * metrics.cacheHitRate) / 100) *
              0.0005
            ).toFixed(3)}
            <span className="cost-note"> (based on gpt-3.5-turbo)</span>
          </p>
        </div>
      </div>
    </div>
  )
}
