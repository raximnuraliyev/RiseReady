import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Target,
  HeartPulse,
  Award,
  Rocket,
  CalendarDays,
  Users,
  CheckCircle2,
  Loader2
} from 'lucide-react'
import { useProgress } from '../../hooks/useProgress'
import ApiClient from '../../utils/apiClient'
import ErrorBoundary from '../../components/ErrorBoundary'

// Helper function to safely access nested properties
const safeGet = (obj: any, path: string[], defaultValue: any = 0): any => {
  try {
    return path.reduce((curr, key) => (curr && curr[key] !== undefined ? curr[key] : defaultValue), obj)
  } catch (e) {
    console.error(`Error accessing path ${path.join('.')}:`, e)
    return defaultValue
  }
}

const PRIMARY = '#1F4E79'
const SECONDARY = '#37A6FF'
const HIGHLIGHT = '#FFB600'

interface DashboardStats {
  focus: { totalSessions: number; streak: number }
  wellbeing: { checkIns: number; streak: number }
  skills: { total: number; inProgress: number }
  career: { tasks: number; completed: number }
}

interface Reminder {
  id: string
  title: string
  time: string
  type: 'calendar' | 'task'
}

const DashboardContent: React.FC = () => {
  const navigate = useNavigate()
  const { loading: progressLoading } = useProgress()
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    focus: { totalSessions: 0, streak: 0 },
    wellbeing: { checkIns: 0, streak: 0 },
    skills: { total: 0, inProgress: 0 },
    career: { tasks: 0, completed: 0 }
  })
  const [reminders, setReminders] = useState<Reminder[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Starting to fetch dashboard data...')
        setLoading(true)
        setError(null)

        console.log('Fetching from API endpoints...')
        const [focusData, wellbeingData, streakData, skillsData, careerData, reminderData] = await Promise.all([
          ApiClient.get('/focus/stats'),
          ApiClient.get('/wellbeing/stats'),
          ApiClient.get('/checkins/streak'),
          ApiClient.get('/skills/summary'),
          ApiClient.get('/career/summary'),
          ApiClient.get('/progress/reminders')
        ])

        console.log('API responses:', { focusData, wellbeingData, skillsData, careerData, reminderData })

        // Safely extract data with fallbacks
        setStats({
          focus: {
            totalSessions: safeGet(focusData, ['totalSessions'], 0),
            streak: safeGet(focusData, ['streak'], 0)
          },
          wellbeing: {
            checkIns: safeGet(wellbeingData, ['checkIns'], 0),
            // prefer explicit streak endpoint if available
            streak: safeGet(streakData, ['streak'], safeGet(wellbeingData, ['streak'], 0))
          },
          skills: {
            total: safeGet(skillsData, ['total'], 0),
            inProgress: safeGet(skillsData, ['inProgress'], 0)
          },
          career: {
            tasks: safeGet(careerData, ['tasks'], 0),
            completed: safeGet(careerData, ['completed'], 0)
          }
        })
        setReminders(Array.isArray(reminderData) ? reminderData : [])
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
        setError('Failed to load dashboard data. Please try refreshing the page.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading || progressLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const statsCards = [
    {
      icon: <Target size={24} />,
      title: 'Focus Sessions',
      value: `${stats.focus.totalSessions} (${stats.focus.streak} streak)`,
      path: '/dashboard/focus',
      color: PRIMARY
    },
    {
      icon: <HeartPulse size={24} />,
      title: 'Well-being',
      value: `${stats.wellbeing.streak} day streak`,
      path: '/dashboard/wellbeing',
      color: '#E11D48'
    },
    {
      icon: <Award size={24} />,
      title: 'Skills',
      value: `${stats.skills.inProgress} / ${stats.skills.total}`,
      path: '/dashboard/skills',
      color: HIGHLIGHT
    },
    {
      icon: <Rocket size={24} />,
      title: 'Career Tasks',
      value: `${stats.career.completed} / ${stats.career.tasks}`,
      path: '/dashboard/career',
      color: SECONDARY
    }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, index) => (
          <div
            key={index}
            onClick={() => navigate(card.path)}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-full" style={{ backgroundColor: `${card.color}20` }}>
                {React.cloneElement(card.icon, { style: { color: card.color } })}
              </div>
              <h3 className="font-semibold text-lg">{card.title}</h3>
            </div>
            <p className="text-2xl font-bold" style={{ color: card.color }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/dashboard/focus"
          className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5" />
            <h3 className="font-semibold">Start Focus Session</h3>
          </div>
          <p className="text-sm text-gray-600">Begin a new focused work session</p>
        </Link>
        
        <Link
          to="/dashboard/calendar"
          className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-2 mb-2">
            <CalendarDays className="w-5 h-5" />
            <h3 className="font-semibold">View Calendar</h3>
          </div>
          <p className="text-sm text-gray-600">Check upcoming events and deadlines</p>
        </Link>
        
        <Link
          to="/dashboard/community"
          className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5" />
            <h3 className="font-semibold">Join Community</h3>
          </div>
          <p className="text-sm text-gray-600">Connect with other learners</p>
        </Link>
      </div>

      {/* Recent Activity */}
      {reminders.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {reminders.map((reminder) => (
              <div key={reminder.id} className="flex items-center gap-3">
                {reminder.type === 'calendar' ? (
                  <CalendarDays className="w-5 h-5 text-primary" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                )}
                <div>
                  <p className="font-medium">{reminder.title}</p>
                  <p className="text-sm text-gray-600">{reminder.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const OverviewPage: React.FC = () => {
  return (
    <ErrorBoundary>
      <DashboardContent />
    </ErrorBoundary>
  )
}

export default OverviewPage