import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AnimatedGradientText from '../../components/AnimatedGradientText'
import { DashboardBackground } from '../../components/DashboardBackgrounds'
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
/* eslint-disable @typescript-eslint/no-explicit-any */
const safeGet = (obj: any, path: string[], defaultValue: any = 0): any => {
  try {
    return path.reduce((curr: any, key: string) => (curr && curr[key] !== undefined ? curr[key] : defaultValue), obj)
  } catch (e) {
    console.error(`Error accessing path ${path.join('.')}:`, e)
    return defaultValue
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

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
        // Normalize reminders - API can return an array or an object with nested lists
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const normalizeReminders = (raw: unknown): Reminder[] => {
          if (!raw) return []
          const asAny = raw as Record<string, any>

          // If already array of reminders
          if (Array.isArray(asAny)) {
            return asAny.map((r: Record<string, any>) => ({
              id: String(r.id ?? r._id ?? `${r.title}_${r.time}`),
              title: r.title ?? r.name ?? r.summary ?? 'Untitled',
              time: r.time ?? r.when ?? r.date ?? (r.datetime ? String(r.datetime) : ''),
              type: r.type === 'calendar' || r.type === 'task' ? r.type : (r.calendar ? 'calendar' : 'task')
            }))
          }

          // If object with data/results/items keys
          const list = asAny.data ?? asAny.results ?? asAny.items ?? asAny.reminders ?? []
          if (Array.isArray(list)) {
            return (list as Record<string, any>[]).map((r) => ({
              id: String(r.id ?? r._id ?? `${r.title}_${r.time}`),
              title: r.title ?? r.name ?? r.summary ?? 'Untitled',
              time: r.time ?? r.when ?? r.date ?? (r.datetime ? String(r.datetime) : ''),
              type: r.type === 'calendar' || r.type === 'task' ? r.type : (r.calendar ? 'calendar' : 'task')
            }))
          }

          return []
        }
        /* eslint-enable @typescript-eslint/no-explicit-any */

        setReminders(normalizeReminders(reminderData))
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

  const sectionVariants = {
    hidden: { opacity: 0, y: 8 },
    enter: (i = 1) => ({ opacity: 1, y: 0, transition: { delay: 0.06 * i, duration: 0.45, ease: 'easeOut' } }),
  }

  return (
    <div className="relative p-6">
      <DashboardBackground variant="overview" />
      <div className="relative space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <AnimatedGradientText className="text-2xl md:text-3xl font-bold">Overview</AnimatedGradientText>
            <p className="text-sm text-gray-500">A snapshot of your activity — stay focused, healthy and growing.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((card, index) => (
            <motion.button
              type="button"
              key={index}
              onClick={() => navigate(card.path)}
              className="bg-white p-5 rounded-xl shadow-md cursor-pointer border border-transparent hover:shadow-lg text-left"
              whileHover={{ y: -6 }}
              initial="hidden"
              animate="enter"
              custom={index}
              variants={sectionVariants}
            >
              <div className="flex items-start gap-4 mb-3">
                <div className="flex-none w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${card.color}15` }}>
                  {React.cloneElement(card.icon, { style: { color: card.color } })}
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-700">{card.title}</h3>
                  <p className="text-xl font-bold mt-1" style={{ color: card.color }}>{card.value}</p>
                </div>
              </div>
              <div className="text-xs text-gray-400">Click to view details</div>
            </motion.button>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Link
            to="/dashboard/focus"
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-start gap-3"
          >
            <div className="p-3 rounded-lg bg-primary/5">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Start Focus Session</h3>
              <p className="text-sm text-gray-600">Begin a new focused work session</p>
            </div>
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
        <div className="mt-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Activity</h2>
              <Link to="/dashboard/notifications" className="text-sm text-primary hover:underline">View all</Link>
            </div>

            {reminders.length > 0 ? (
              <div className="space-y-4">
                {reminders.map((reminder, idx) => (
                  <motion.div key={reminder.id} className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 transition" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0, transition: { delay: idx * 0.04 } }}>
                    <div className="flex-none w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100">
                      {reminder.type === 'calendar' ? (
                        <CalendarDays className="w-5 h-5 text-primary" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-800">{reminder.title}</p>
                      <p className="text-xs text-gray-500">{reminder.time}</p>
                    </div>
                    <div className="text-xs text-gray-400 capitalize">{reminder.type}</div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No recent activity — you’re all caught up!</p>
                <Link to="/dashboard/calendar" className="mt-3 inline-block px-4 py-2 bg-primary text-white rounded-md">Add an event</Link>
              </div>
            )}
          </div>
        </div>
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