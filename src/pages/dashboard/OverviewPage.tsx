import React, { useState, useRef, useEffect } from 'react'
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
      icon: <Target size={28} />,
      title: 'Focus Sessions',
      value: stats.focus.totalSessions,
      subtitle: `${stats.focus.streak} day streak`,
      path: '/dashboard/focus',
      color: '#2563EB',
      bgGradient: 'from-blue-600 to-blue-800',
      accentColor: 'text-blue-400',
      blobColor1: 'bg-blue-400',
      blobColor2: 'bg-cyan-400'
    },
    {
      icon: <HeartPulse size={28} />,
      title: 'Well-being',
      value: stats.wellbeing.streak,
      subtitle: 'day streak',
      path: '/dashboard/wellbeing',
      color: '#DC2626',
      bgGradient: 'from-red-600 to-red-800',
      accentColor: 'text-red-400',
      blobColor1: 'bg-red-400',
      blobColor2: 'bg-pink-400'
    },
    {
      icon: <Award size={28} />,
      title: 'Skills',
      value: stats.skills.inProgress,
      subtitle: `of ${stats.skills.total} total`,
      path: '/dashboard/skills',
      color: '#F59E0B',
      bgGradient: 'from-amber-600 to-amber-800',
      accentColor: 'text-amber-400',
      blobColor1: 'bg-amber-400',
      blobColor2: 'bg-yellow-400'
    },
    {
      icon: <Rocket size={28} />,
      title: 'Career Tasks',
      value: stats.career.completed,
      subtitle: `of ${stats.career.tasks} total`,
      path: '/dashboard/career',
      color: '#06B6D4',
      bgGradient: 'from-cyan-600 to-cyan-800',
      accentColor: 'text-cyan-400',
      blobColor1: 'bg-cyan-400',
      blobColor2: 'bg-sky-400'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        duration: 0.6,
      },
    },
  }

  const actionCardVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        duration: 0.5,
      },
    },
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4 md:p-8">
      <DashboardBackground variant="overview" />
      <div className="relative max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-2"
        >
          <AnimatedGradientText className="text-3xl md:text-4xl lg:text-5xl font-bold text-black">
            Welcome Back
          </AnimatedGradientText>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl">
            Here's what you've accomplished today. Keep the momentum going!
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Your Statistics</h2>
          
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {statsCards.map((card, index) => (
              <motion.button
                key={index}
                type="button"
                onClick={() => navigate(card.path)}
                variants={itemVariants}
                className="group relative h-full overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl text-left"
              >
                {/* Card Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient}`} />

                {/* Decorative Blobs */}
                <div className={`absolute -top-32 -right-32 w-64 h-64 ${card.blobColor1} rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
                <div className={`absolute -bottom-32 -left-32 w-64 h-64 ${card.blobColor2} rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />

                <div className="relative z-10 p-6 h-full flex flex-col justify-between min-h-[240px]">
                  {/* Icon */}
                  <motion.div
                    className="inline-flex w-14 h-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg group-hover:bg-white/30 transition-all duration-300"
                    whileHover={{ scale: 1.15 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  >
                    {React.cloneElement(card.icon, {
                      style: { color: '#FFFFFF' },
                      className: 'transition-transform duration-300',
                    })}
                  </motion.div>

                  {/* Content */}
                  <div className="space-y-3 pt-4">
                    <div>
                      <p className="text-white/80 text-sm font-medium mb-2">{card.title}</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-bold text-white">
                          {card.value}
                        </p>
                      </div>
                      <p className="text-white/70 text-xs mt-2">{card.subtitle}</p>
                    </div>

                    {/* CTA Indicator */}
                    <motion.div
                      className="flex items-center gap-2 text-white/80 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300"
                      whileHover={{ x: 4 }}
                    >
                      <span>View Details</span>
                      <motion.svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </motion.svg>
                    </motion.div>
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Quick Actions</h2>
          
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Focus Card */}
            <motion.div variants={actionCardVariants} asChild>
              <Link
                to="/dashboard/focus"
                className="group relative h-full overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl"
              >
                {/* Card Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800" />
                
                {/* Decorative Blobs */}
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-cyan-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500" />

                <div className="relative z-10 p-8 h-full flex flex-col justify-between min-h-[340px]">
                  {/* Icon */}
                  <motion.div
                    className="inline-flex w-16 h-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg group-hover:bg-white/30 transition-all duration-300"
                    whileHover={{ scale: 1.15, rotate: -8 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  >
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Target className="w-8 h-8 text-white" strokeWidth={2} />
                    </motion.div>
                  </motion.div>

                  {/* Content */}
                  <div className="space-y-4 pt-4">
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-3">Focus Session</h3>
                      <p className="text-blue-100 text-sm leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                        Eliminate distractions and achieve deep focus. Track your concentration time and build consistency.
                      </p>
                    </div>

                    {/* CTA Button */}
                    <motion.button
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/25 backdrop-blur-sm border border-white/40 text-white font-semibold text-sm hover:bg-white/35 transition-all duration-300"
                      whileHover={{ x: 4 }}
                    >
                      <span>Start Now</span>
                      <motion.svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </motion.svg>
                    </motion.button>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Calendar Card */}
            <motion.div variants={actionCardVariants} asChild>
              <Link
                to="/dashboard/calendar"
                className="group relative h-full overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl"
              >
                {/* Card Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-800" />
                
                {/* Decorative Blobs */}
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-pink-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500" />

                <div className="relative z-10 p-8 h-full flex flex-col justify-between min-h-[340px]">
                  {/* Icon */}
                  <motion.div
                    className="inline-flex w-16 h-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg group-hover:bg-white/30 transition-all duration-300"
                    whileHover={{ scale: 1.15, rotate: 8 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.12, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    >
                      <CalendarDays className="w-8 h-8 text-white" strokeWidth={2} />
                    </motion.div>
                  </motion.div>

                  {/* Content */}
                  <div className="space-y-4 pt-4">
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-3">View Calendar</h3>
                      <p className="text-purple-100 text-sm leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                        Manage your schedule effectively. Never miss important deadlines or events again.
                      </p>
                    </div>

                    {/* CTA Button */}
                    <motion.button
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/25 backdrop-blur-sm border border-white/40 text-white font-semibold text-sm hover:bg-white/35 transition-all duration-300"
                      whileHover={{ x: 4 }}
                    >
                      <span>View Schedule</span>
                      <motion.svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </motion.svg>
                    </motion.button>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Community Card */}
            <motion.div variants={actionCardVariants} asChild>
              <Link
                to="/dashboard/community"
                className="group relative h-full overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl"
              >
                {/* Card Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-teal-800" />
                
                {/* Decorative Blobs */}
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-teal-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-green-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500" />

                <div className="relative z-10 p-8 h-full flex flex-col justify-between min-h-[340px]">
                  {/* Icon */}
                  <motion.div
                    className="inline-flex w-16 h-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg group-hover:bg-white/30 transition-all duration-300"
                    whileHover={{ scale: 1.15, rotate: -8 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  >
                    <motion.div
                      animate={{ x: [0, 6, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    >
                      <Users className="w-8 h-8 text-white" strokeWidth={2} />
                    </motion.div>
                  </motion.div>

                  {/* Content */}
                  <div className="space-y-4 pt-4">
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-3">Community</h3>
                      <p className="text-teal-100 text-sm leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                        Connect with peers, share knowledge, and grow together. Build meaningful relationships.
                      </p>
                    </div>

                    {/* CTA Button */}
                    <motion.button
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/25 backdrop-blur-sm border border-white/40 text-white font-semibold text-sm hover:bg-white/35 transition-all duration-300"
                      whileHover={{ x: 4 }}
                    >
                      <span>Join Now</span>
                      <motion.svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </motion.svg>
                    </motion.button>
                  </div>
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8"
        >
          <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-100">
            {/* Gradient overlay on top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500" />

            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
                  <p className="text-sm text-gray-500 mt-1">Stay updated with your latest events</p>
                </div>
                <Link
                  to="/dashboard/notifications"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 text-primary font-semibold hover:shadow-md transition-all duration-300 hover:scale-105"
                >
                  View all
                </Link>
              </div>

              {reminders.length > 0 ? (
                <div className="space-y-3">
                  {reminders.map((reminder, idx) => (
                    <motion.div
                      key={reminder.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.08, duration: 0.4 }}
                      className="group flex items-start gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 to-purple-50 transition-all duration-300 border border-transparent hover:border-blue-100"
                    >
                      <motion.div
                        className={`flex-none w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          reminder.type === 'calendar'
                            ? 'bg-blue-100 group-hover:bg-blue-200'
                            : 'bg-emerald-100 group-hover:bg-emerald-200'
                        }`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        {reminder.type === 'calendar' ? (
                          <CalendarDays className="w-6 h-6 text-blue-600" />
                        ) : (
                          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                        )}
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 group-hover:text-gray-950 transition-colors">
                          {reminder.title}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">{reminder.time}</p>
                      </div>
                      <div className="flex-none">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                            reminder.type === 'calendar'
                              ? 'bg-blue-100 text-blue-700 group-hover:bg-blue-200'
                              : 'bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200'
                          }`}
                        >
                          {reminder.type}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12"
                >
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-6xl mb-4"
                  >
                    ✓
                  </motion.div>
                  <p className="text-gray-600 text-lg font-medium">You're all caught up!</p>
                  <p className="text-gray-400 text-sm mt-1 mb-4">No upcoming reminders</p>
                  <Link
                    to="/dashboard/calendar"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    Add an event
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
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
