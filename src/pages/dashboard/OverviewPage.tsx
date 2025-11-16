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
import DashboardBackground from '../../components/DashboardBackgrounds'

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
// decorative gradients/colors are applied inline where needed

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
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-gray-600">Preparing your fun dashboard...</p>
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
    <div className="relative p-6 space-y-6">
      <DashboardBackground variant="overview" />
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, index) => (
          <div
            key={index}
            onClick={() => navigate(card.path)}
            className="relative overflow-hidden p-4 rounded-xl shadow-2xl transform hover:-translate-y-1 transition-all cursor-pointer"
            style={{ background: `linear-gradient(180deg, ${card.color}22 0%, #ffffff00 100%)` }}
          >
            {/* playful corner icon */}
            <div className="absolute -top-4 -right-4 opacity-20 select-none">
              {index === 0 ? (
                <Target className="w-10 h-10" />
              ) : index === 1 ? (
                <HeartPulse className="w-10 h-10" />
              ) : index === 2 ? (
                <Award className="w-10 h-10" />
              ) : (
                <Rocket className="w-10 h-10" />
              )}
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-full bg-white/80 shadow animate-bounce">
                {React.cloneElement(card.icon, { style: { color: card.color } })}
              </div>
              <h3 className="font-bold text-lg">{card.title} <span className="ml-2">{index === 0 ? '— Ready?' : index === 1 ? '— Be well' : index === 2 ? '— Skill up' : '— Go!'} </span></h3>
            </div>
            <p className="text-3xl font-extrabold" style={{ color: card.color }}>
              {card.value}
            </p>
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
              <span className="px-2 py-1 bg-white/60 rounded-full">Quick</span>
              <span className="px-2 py-1 bg-white/60 rounded-full">Open</span>
              <button className="ml-auto px-3 py-1 bg-white text-sm rounded-full shadow-sm">Go</button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/dashboard/focus"
          className="relative overflow-hidden p-5 rounded-xl shadow-2xl transform hover:scale-[1.01] transition-all bg-gradient-to-br from-indigo-500 to-cyan-400 text-white"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-white/20">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-bold">Start Focus Session</h3>
          </div>
          <p className="text-sm opacity-90">Begin a new focused work session — beat your personal best!</p>
          <div className="absolute bottom-3 right-3 text-2xl select-none">
            <Loader2 className="w-6 h-6" />
          </div>
        </Link>

        <Link
          to="/dashboard/calendar"
          className="relative overflow-hidden p-5 rounded-xl shadow-2xl transform hover:scale-[1.01] transition-all bg-gradient-to-br from-amber-400 to-rose-300 text-white"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-white/20">
              <CalendarDays className="w-5 h-5" />
            </div>
            <h3 className="font-bold">View Calendar</h3>
          </div>
          <p className="text-sm opacity-90">Check upcoming events and deadlines — never miss a moment.</p>
          <div className="absolute bottom-3 right-3 text-2xl select-none">
            <Target className="w-6 h-6" />
          </div>
        </Link>

        <Link
          to="/dashboard/community"
          className="relative overflow-hidden p-5 rounded-xl shadow-2xl transform hover:scale-[1.01] transition-all bg-gradient-to-br from-green-400 to-lime-300 text-white"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-white/20">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold">Join Community</h3>
          </div>
          <p className="text-sm opacity-90">Connect with other learners — share wins and memes.</p>
          <div className="absolute bottom-3 right-3 text-2xl select-none">
            <Users className="w-6 h-6" />
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="text-sm text-gray-500">{reminders.length} items</div>
        </div>
        {reminders.length > 0 ? (
          <div className="space-y-4">
            {reminders.map((reminder) => (
              <div key={reminder.id} className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 transition-all">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-white to-gray-100 shadow">
                  {reminder.type === 'calendar' ? (
                    <CalendarDays className="w-5 h-5 text-primary" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{reminder.title} <span className="ml-2 text-sm">— {reminder.type === 'calendar' ? 'Event' : 'Task'}</span></p>
                  <p className="text-sm text-gray-600">{reminder.time}</p>
                </div>
                <div className="ml-auto text-sm text-gray-400">{new Date().toLocaleTimeString()}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto">
              <Award className="w-16 h-16 text-primary mx-auto" />
            </div>
              <p className="mt-4 text-lg">No recent activity — everything looks calm and magical!</p>
            <p className="text-sm text-gray-500">Try starting a focus session or adding a reminder.</p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <Link to="/dashboard/focus" className="px-4 py-2 bg-indigo-600 text-white rounded-md">Start Focus</Link>
              <Link to="/dashboard/calendar" className="px-4 py-2 border border-gray-200 rounded-md">Add Reminder</Link>
            </div>
          </div>
        )}
      </div>
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