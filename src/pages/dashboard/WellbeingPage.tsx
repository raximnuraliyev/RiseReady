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
} from 'lucide-react'
import { format } from 'date-fns'
import { useWellbeing } from '../../hooks/useWellbeing'
import BreathingExercise from '../../components/wellbeing/BreathingExercise'

const MOOD_OPTIONS = [
  { id: 'great', emoji: '😊', label: 'Great', color: '#10B981' },
  { id: 'good', emoji: '🙂', label: 'Good', color: '#34D399' },
  { id: 'okay', emoji: '😐', label: 'Okay', color: '#FBBF24' },
  { id: 'bad', emoji: '😟', label: 'Bad', color: '#FB923C' },
  { id: 'terrible', emoji: '😢', label: 'Terrible', color: '#EF4444' },
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

  const moodEmoji = bestDay.mood ? MOOD_OPTIONS.find(m => m.id === bestDay.mood)?.emoji : '📅'

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#FFF0F5] pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#EC4899] to-[#DB2777] rounded-2xl flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#1F4E79]">Well-being Center</h1>
                <p className="text-sm text-gray-600 mt-0.5">Take care of yourself 💕</p>
              </div>
            </div>
            {!hasCheckedInToday && (
              <button
                onClick={() => setShowCheckIn(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#EC4899] to-[#DB2777] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span className="hidden sm:inline">Check In Today</span>
              </button>
            )}
            {hasCheckedInToday && (
              <div className="flex items-center gap-2 px-6 py-3 bg-green-100 text-green-700 rounded-xl font-semibold">
                <CheckCircle2 className="w-5 h-5" />
                <span className="hidden sm:inline">Checked in today!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Check-in Streak */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-3xl shadow-lg p-6 text-white relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-sm font-medium">Check-in Streak</span>
                <Flame className="w-8 h-8" />
              </div>
              <div className="text-4xl font-bold mb-1">{streak.streak} days</div>
              <div className="text-white/80 text-sm">Keep it up! 🔥</div>
            </div>
            <motion.div
              className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>

          {/* Best Day This Week */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-3xl shadow-lg p-6 text-white relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-sm font-medium">Best Day This Week</span>
                <Star className="w-8 h-8" />
              </div>
              <div className="text-3xl font-bold mb-1">
                {bestDay.bestDay ? (
                  <>
                    {moodEmoji} {format(new Date(bestDay.bestDay), 'EEE')}
                  </>
                ) : (
                  'No data yet'
                )}
              </div>
              <div className="text-white/80 text-sm">
                {bestDay.bestDay ? 'Great energy!' : 'Check in daily'}
              </div>
            </div>
          </motion.div>

          {/* Average Energy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-3xl shadow-lg p-6 text-white relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-sm font-medium">Avg Energy</span>
                <Activity className="w-8 h-8" />
              </div>
              <div className="text-4xl font-bold mb-1">{stats.avgEnergy.toFixed(1)}/5</div>
              <div className="text-white/80 text-sm">This week</div>
            </div>
          </motion.div>

          {/* Exercise Days */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-3xl shadow-lg p-6 text-white relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-sm font-medium">Exercise Days</span>
                <Dumbbell className="w-8 h-8" />
              </div>
              <div className="text-4xl font-bold mb-1">{stats.exerciseDays}</div>
              <div className="text-white/80 text-sm">This week 💪</div>
            </div>
          </motion.div>
        </div>

        {/* Weekly Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Mood History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100"
          >
            <h2 className="text-xl font-bold text-[#1F4E79] mb-4">Recent Check-ins</h2>
            
            {checkIns.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💭</div>
                <h3 className="text-lg font-bold text-[#1F4E79] mb-2">No check-ins yet</h3>
                <p className="text-gray-600 mb-6">Start tracking your wellbeing today</p>
                <button
                  onClick={() => setShowCheckIn(true)}
                  className="px-6 py-3 bg-[#EC4899] text-white rounded-xl font-semibold hover:bg-[#DB2777] transition-colors"
                >
                  Check In Now
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {checkIns.slice(0, 7).map((checkIn) => {
                  const moodOption = MOOD_OPTIONS.find(m => m.id === checkIn.mood)
                  return (
                    <div
                      key={checkIn._id}
                      className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100"
                    >
                      <div className="text-3xl">{moodOption?.emoji}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-[#1F4E79]">
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
                        <div className="text-green-500">
                          <Dumbbell className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </motion.div>

          {/* Weekly Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100"
          >
            <h2 className="text-xl font-bold text-[#1F4E79] mb-4">This Week's Stats</h2>
            
            <div className="space-y-4">
              {/* Energy */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Average Energy</span>
                  <span className="text-sm font-bold text-[#3B82F6]">{stats.avgEnergy.toFixed(1)}/5</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#3B82F6] to-[#2563EB] rounded-full"
                    style={{ width: `${(stats.avgEnergy / 5) * 100}%` }}
                  />
                </div>
              </div>

              {/* Stress */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Average Stress</span>
                  <span className="text-sm font-bold text-[#EF4444]">{stats.avgStress.toFixed(1)}/5</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#FFA500] to-[#EF4444] rounded-full"
                    style={{ width: `${(stats.avgStress / 5) * 100}%` }}
                  />
                </div>
              </div>

              {/* Sleep */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Average Sleep</span>
                  <span className="text-sm font-bold text-[#8B5CF6]">{stats.avgSleep.toFixed(1)}h</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] rounded-full"
                    style={{ width: `${(stats.avgSleep / 9) * 100}%` }}
                  />
                </div>
              </div>

              {/* Total Check-ins */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Total Check-ins</span>
                  <span className="text-2xl font-bold text-[#1F4E79]">{stats.totalCheckIns}</span>
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
            transition={{ delay: 0.6 }}
            className="lg:col-span-1"
          >
            <BreathingExercise />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 bg-white rounded-3xl shadow-lg p-6 border border-gray-100 lg:col-span-2"
          >
            <h2 className="text-xl font-bold text-[#1F4E79] mb-4">Mental Health Articles</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Managing Exam Stress', emoji: '📚', color: '#3B82F6' },
                { title: 'Healthy Sleep Habits', emoji: '😴', color: '#8B5CF6' },
                { title: 'Building Resilience', emoji: '💪', color: '#10B981' },
              ].map((article, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border-2 border-gray-100 hover:border-gray-200 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="text-4xl mb-2">{article.emoji}</div>
                  <h3 className="font-semibold text-[#1F4E79]">{article.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">Click to read more</p>
                </div>
              ))}
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
                className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-[#1F4E79]">Daily Check-in</h3>
                  <button
                    onClick={() => setShowCheckIn(false)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Mood */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      How are you feeling? *
                    </label>
                    <div className="flex gap-2 justify-between">
                      {MOOD_OPTIONS.map((mood) => (
                        <button
                          key={mood.id}
                          onClick={() => setFormData({ ...formData, mood: mood.id as Mood })}
                          className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                            formData.mood === mood.id
                              ? 'border-[#EC4899] bg-pink-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-2xl mb-1">{mood.emoji}</div>
                          <div className="text-xs">{mood.label}</div>
                        </button>
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
                      className="w-full"
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
                      className="w-full"
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
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg"
                    />
                  </div>

                  {/* Exercise */}
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.exercise}
                      onChange={(e) => setFormData({ ...formData, exercise: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">I exercised today</span>
                  </label>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes (optional)
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg"
                      rows={2}
                      placeholder="How was your day?"
                    />
                  </div>

                  <button
                    onClick={handleCheckIn}
                    className="w-full px-4 py-3 bg-[#EC4899] text-white rounded-lg font-semibold hover:bg-[#DB2777] transition-colors"
                  >
                    Complete Check-in
                  </button>
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
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-green-500">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#1F4E79]">Checked In! 🎉</h3>
                <p className="text-gray-600 mt-2">Keep up the great work!</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
