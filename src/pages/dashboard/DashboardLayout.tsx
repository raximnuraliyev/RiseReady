import React, { useState } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import {
  Loader2,
  Bell,
  Flame
} from 'lucide-react'
import useAuth from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'
import { useNotifications } from '../../hooks/useNotifications'
import socketUtils from '../../utils/socket'
import { DashboardProvider } from '../../contexts/DashboardContext'
import DashboardSidebar from '../../components/dashboard/DashboardSidebar'
import NotificationsPanel from '../../components/dashboard/NotificationsPanel'
import { useWellbeing } from '../../hooks/useWellbeing'

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center space-y-4">
      <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
      <p className="text-gray-600">Loading dashboard...</p>
    </div>
  </div>
)

const ErrorDisplay = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center space-y-4">
      <p className="text-red-600">{error}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
      >
        Return to Login
      </button>
    </div>
  </div>
)

// Top bar with user info and notifications

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate()
  const { user, loading, error, logout } = useAuth()
  const { isDark } = useTheme()
  const { streak } = useWellbeing()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { notifications } = useNotifications()

  // Ensure socket joins the user's room so real-time notifications are delivered
  React.useEffect(() => {
    if (user && user.id) {
      try {
        socketUtils.joinUserRoom(String(user.id))
      } catch {
        // ignore
      }
    }
  }, [user])

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={() => navigate('/login')} />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <DashboardSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Notifications Panel */}
      <NotificationsPanel 
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Bar */}
        <div className={`h-16 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b flex items-center justify-end px-4 fixed top-0 right-0 left-0 z-10`}>
          <div className="flex items-center space-x-4">
            {/* Streak Indicator */}
            <div className="relative">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isDark ? 'bg-orange-900/30' : 'bg-gradient-to-r from-[#FFD700]/20 to-[#FFA500]/20'}`}>
                <Flame className="w-5 h-5 text-[#FFA500]" />
                <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{streak.streak} Day Streak</span>
              </div>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(true)}
                className={`p-2 rounded-lg relative transition-colors ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              >
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#37A6FF] to-[#1F4E79] flex items-center justify-center text-white font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-medium">{user.name}</span>
              </button>

              {isUserMenuOpen && (
                <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <button
                    onClick={() => {
                      navigate('/dashboard/profile')
                      setIsUserMenuOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Profile Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${isDark ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'}`}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className={`flex-1 p-6 mt-16 overflow-auto ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
          <DashboardProvider>
            <Outlet />
          </DashboardProvider>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout