/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from 'react'
import useDashboardState from '../hooks/useDashboardState'
import type { UserStats } from '../types/dashboard'

interface DashboardContextType {
  stats: UserStats
  loading: boolean
  error: string | null
  refreshStats: () => Promise<void>
}

const DashboardContext = createContext<DashboardContextType | null>(null)

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dashboardState = useDashboardState()

  return (
    <DashboardContext.Provider value={dashboardState}>
      {children}
    </DashboardContext.Provider>
  )
}

export const useDashboardContext = () => {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error('useDashboardContext must be used within a DashboardProvider')
  }
  return context
}

// No default export to keep this file focused on React components/hooks for fast refresh