import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart,
  Flame,
  Star,
  Activity,
  Dumbbell,
  X,
  CheckCircle2,
  Moon,
  Brain,
  BookOpen,
} from 'lucide-react'
import { format } from 'date-fns'
import { useWellbeing } from '../../hooks/useWellbeing'
import BreathingExercise from '../../components/wellbeing/BreathingExercise'

const MOOD_OPTIONS = [
  { id: 'great', icon: '😊', label: 'Great', color: '#10B981' },
  { id: 'good', icon: '🙂', label: 'Good', color: '#34D399' },
  { id: 'okay', icon: '😐', label: 'Okay', color: '#FBBF24' },
  { id: 'bad', icon: '😟', label: 'Bad', color: '#FB923C' },
  { id: 'terrible', icon: '😢', label: 'Terrible', color: '#EF4444' },
]

export default function WellbeingPage() {
  const { checkIns, streak, bestDay, stats, loading, createCheckIn, hasCheckedInToday } = useWellbeing()
  
  const [showCheckIn, setShowCheckIn] = useState(false)
  type Mood = 'great' | 'good' | 'okay' | 'bad' | 'terrible'
  const [formData, setFormData] = useState({
    mood: '' as '' | Mood,
    energy: 3,
    stress: 3,
    sleep: 7,
    exercise: false,
    notes: ''
  })
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleCheckIn = async () => {
    if (!formData.mood) {
      setError('Please select a mood')
      return
    }

    try {
      await createCheckIn({
        mood: formData.mood as Mood,
        energy: formData.energy,
        stress: formData.stress,
        sleep: formData.sleep,
        exercise: formData.exercise,
        notes: formData.notes,
      })
      setShowCheckIn(false)
      setFormData({
        mood: '',
        energy: 3,
        stress: 3,
        sleep: 7,
        exercise: false,
        notes: ''
      })
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
      setError('')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message || 'Failed to check in')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-gray-600">Loading wellbeing data...</div>
      </div>
    )
  }

  const moodIcon = bestDay.mood ? MOOD_OPTIONS.find(m => m.id === bestDay.mood)?.icon : '📅'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-14 h-14 bg-gradient-to-br from-rose-600 to-rose-800 rounded-2xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Heart className="w-7 h-7 text-white" strokeWidth={2} />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Well-being Center</h1>
                <p className="text-sm text-gray-600 mt-0.5">Take care of yourself 💕</p>
              </div>
            </div>
            {!hasCheckedInToday && (
              <motion.button
                onClick={() => setShowCheckIn(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span className="hidden sm:inline">Check In Today</span>
              </motion.button>
            )}
            {hasCheckedInToday && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-100 text-emerald-700 rounded-lg font-semibold"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span className="hidden sm:inline">Checked in today!</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4 mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Your Statistics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Check-in Streak */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="group relative h-full overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-amber-800" />
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-amber-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-orange-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
              
              <div className="relative z-10 p-6 h-full flex flex-col justify-between min-h-[200px]">
                <motion.div
                  className="inline-flex w-14 h-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg group-hover:bg-white/30 transition-all duration-300"
                  whileHover={{ scale: 1.15 }}
                >
                  <Flame className="w-7 h-7 text-white" strokeWidth={2} />
                </motion.div>

                <div className="space-y-2 pt-4">
                  <p className="text-white/80 text-sm font-medium">Check-in Streak</p>
                  <p className="text-4xl font-bold text-white">{streak.streak}</p>
                  <p className="text-white/70 text-xs">days 🔥</p>
                </div>
              </div>
            </motion.div>

            {/* Best Day This Week */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="group relative h-full overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-800" />
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-emerald-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-green-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
              
              <div className="relative z-10 p-6 h-full flex flex-col justify-between min-h-[200px]">
                <motion.div
                  className="inline-flex w-14 h-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg group-hover:bg-white/30 transition-all duration-300"
                  whileHover={{ scale: 1.15 }}
                >
                  <Star className="w-7 h-7 text-white" strokeWidth={2} />
                </motion.div>

                <div className="space-y-2 pt-4">
                  <p className="text-white/80 text-sm font-medium">Best Day</p>
                  <p className="text-3xl font-bold text-white">
                    {bestDay.bestDay ? format(new Date(bestDay.bestDay), 'EEE') : 'N/A'}
                  </p>
                  <p className="text-white/70 text-xs">{moodIcon}</p>
                </div>
              </div>
            </motion.div>

            {/* Average Energy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="group relative h-full overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800" />
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-cyan-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
              
              <div className="relative z-10 p-6 h-full flex flex-col justify-between min-h-[200px]">
                <motion.div
                  className="inline-flex w-14 h-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg group-hover:bg-white/30 transition-all duration-300"
                  whileHover={{ scale: 1.15 }}
                >
                  <Activity className="w-7 h-7 text-white" strokeWidth={2} />
                </motion.div>

                <div className="space-y-2 pt-4">
                  <p className="text-white/80 text-sm font-medium">Avg Energy</p>
                  <p className="text-4xl font-bold text-white">{stats.avgEnergy.toFixed(1)}</p>
                  <p className="text-white/70 text-xs">/5 this week</p>
                </div>
              </div>
            </motion.div>

            {/* Exercise Days */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="group relative h-full overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-800" />
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-indigo-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
              
              <div className="relative z-10 p-6 h-full flex flex-col justify-between min-h-[200px]">
                <motion.div
                  className="inline-flex w-14 h-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg group-hover:bg-white/30 transition-all duration-300"
                  whileHover={{ scale: 1.15 }}
                >
                  <Dumbbell className="w-7 h-7 text-white" strokeWidth={2} />
                </motion.div>

                <div className="space-y-2 pt-4">
                  <p className="text-white/80 text-sm font-medium">Exercise Days</p>
                  <p className="text-4xl font-bold text-white">{stats.exerciseDays}</p>
                  <p className="text-white/70 text-xs">this week 💪</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Weekly Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Mood History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Check-ins</h2>
            
            {checkIns.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-rose-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No check-ins yet</h3>
                <p className="text-gray-600 mb-6">Start tracking your wellbeing today</p>
                <motion.button
                  onClick={() => setShowCheckIn(true)}
                  className="px-6 py-3 bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Check In Now
                </motion.button>
              </div>
            ) : (
              <div className="space-y-3">
                {checkIns.slice(0, 7).map((checkIn) => {
                  const moodOption = MOOD_OPTIONS.find(m => m.id === checkIn.mood)
                  return (
                    <motion.div
                      key={checkIn._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-100 hover:shadow-md transition-all"
                    >
                      <div className="text-3xl">{moodOption?.icon}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                          {format(new Date(checkIn.date), 'EEEE, MMM d')}
                        </div>
                        <div className="text-sm text-gray-600">
                          Energy: {checkIn.energy}/5 • Stress: {checkIn.stress}/5
                          {typeof checkIn.sleep === 'number' && checkIn.sleep > 0 && ` • Sleep: ${checkIn.sleep}h`}
                        </div>
                        {checkIn.notes && (
                          <p className="text-sm text-gray-500 mt-1">{checkIn.notes}</p>
                        )}
                      </div>
                      {checkIn.exercise && (
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100">
                          <Dumbbell className="w-4 h-4 text-emerald-600" />
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>

          {/* Weekly Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">This Week's Stats</h2>
            
            <div className="space-y-4">
              {/* Energy */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Average Energy</span>
                  <span className="text-sm font-bold text-blue-600">{stats.avgEnergy.toFixed(1)}/5</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                    style={{ width: `${(stats.avgEnergy / 5) * 100}%` }}
                  />
                </div>
              </div>

              {/* Stress */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Average Stress</span>
                  <span className="text-sm font-bold text-red-600">{stats.avgStress.toFixed(1)}/5</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full"
                    style={{ width: `${(stats.avgStress / 5) * 100}%` }}
                  />
                </div>
              </div>

              {/* Sleep */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Average Sleep</span>
                  <span className="text-sm font-bold text-purple-600">{stats.avgSleep.toFixed(1)}h</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                    style={{ width: `${(stats.avgSleep / 9) * 100}%` }}
                  />
                </div>
              </div>

              {/* Total Check-ins */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Total Check-ins</span>
                  <span className="text-2xl font-bold text-gray-900">{stats.totalCheckIns}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Breathing Exercise + Mental Health Resources */}
        <div className="grid grid-cols-1 lg:grid-cols-1 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="lg:col-span-1"
          >
            <BreathingExercise />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100 lg:col-span-2"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Mental Health Resources</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Managing Stress', icon: Brain, color: 'from-blue-600 to-blue-700' },
                { title: 'Healthy Sleep', icon: Moon, color: 'from-indigo-600 to-indigo-700' },
                { title: 'Building Resilience', icon: BookOpen, color: 'from-emerald-600 to-emerald-700' },
              ].map((article, i) => {
                const IconComponent = article.icon
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="group relative p-6 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all cursor-pointer"
                  >
                    <div className={`inline-flex w-12 h-12 items-center justify-center rounded-xl bg-gradient-to-br ${article.color} mb-3`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{article.title}</h3>
                    <p className="text-sm text-gray-600">Click to learn more</p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Check-in Modal */}
        <AnimatePresence>
          {showCheckIn && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-100"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Daily Check-in</h3>
                  <motion.button
                    onClick={() => setShowCheckIn(false)}
                    whileHover={{ rotate: 90 }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Mood */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      How are you feeling? *
                    </label>
                    <div className="flex gap-2 justify-between">
                      {MOOD_OPTIONS.map((mood) => (
                        <motion.button
                          key={mood.id}
                          onClick={() => setFormData({ ...formData, mood: mood.id as Mood })}
                          className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                            formData.mood === mood.id
                              ? 'border-rose-600 bg-rose-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="text-2xl mb-1">{mood.icon}</div>
                          <div className="text-xs font-medium">{mood.label}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Energy */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Energy Level: {formData.energy}/5
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={formData.energy}
                      onChange={(e) => setFormData({ ...formData, energy: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Stress */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stress Level: {formData.stress}/5
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={formData.stress}
                      onChange={(e) => setFormData({ ...formData, stress: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Sleep */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hours of Sleep: {formData.sleep}h
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="24"
                      value={formData.sleep}
                      onChange={(e) => setFormData({ ...formData, sleep: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-rose-600 focus:outline-none"
                    />
                  </div>

                  {/* Exercise */}
                  <label className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.exercise}
                      onChange={(e) => setFormData({ ...formData, exercise: e.target.checked })}
                      className="w-5 h-5 rounded accent-rose-600"
                    />
                    <span className="text-sm font-medium text-gray-700">I exercised today</span>
                  </label>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes (optional)
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-rose-600 focus:outline-none"
                      rows={2}
                      placeholder="How was your day?"
                    />
                  </div>

                  <motion.button
                    onClick={handleCheckIn}
                    className="w-full px-4 py-3 bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Complete Check-in
                  </motion.button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Success Animation */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-emerald-500"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Checked In! 🎉</h3>
                <p className="text-gray-600 mt-2">Keep up the great work!</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
