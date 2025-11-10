import { useState, FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { CalendarEvent } from '../../../pages/dashboard/CalendarPage'
import { 
  BookOpen, 
  Briefcase, 
  Users, 
  GraduationCap, 
  MoreHorizontal, 
  Calendar, 
  Clock, 
  Repeat, 
  Bell, 
  AlignLeft,
  X,
  Sparkles
} from 'lucide-react'

interface AddEventModalProps {
  isOpen: boolean
  onClose: () => void
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void
}

export default function AddEventModal({ isOpen, onClose, onAddEvent }: AddEventModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'class' as CalendarEvent['type'],
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    recurrence: 'none' as CalendarEvent['recurrence'],
    reminder: null as CalendarEvent['reminder'],
    description: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.date) newErrors.date = 'Date is required'
    if (!formData.startTime) newErrors.startTime = 'Start time is required'
    if (!formData.endTime) newErrors.endTime = 'End time is required'
    
    // Check if end time is after start time
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = 'End time must be after start time'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const [year, month, day] = formData.date.split('-').map(Number)
    const [startHour, startMin] = formData.startTime.split(':').map(Number)
    const [endHour, endMin] = formData.endTime.split(':').map(Number)

    const startTime = new Date(year, month - 1, day, startHour, startMin)
    const endTime = new Date(year, month - 1, day, endHour, endMin)

    onAddEvent({
      title: formData.title,
      type: formData.type,
      startTime,
      endTime,
      recurrence: formData.recurrence,
      reminder: formData.reminder,
      description: formData.description || undefined,
    })

    // Reset form
    setFormData({
      title: '',
      type: 'class',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
      recurrence: 'none',
      reminder: null,
      description: '',
    })
    setErrors({})
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
          />

          {/* Modal - Centered */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Gradient */}
              <div className="relative bg-gradient-to-br from-[#1F4E79] via-[#2B5F8E] to-[#37A6FF] p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.div 
                      className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Calendar className="w-7 h-7 text-white" />
                    </motion.div>
                    <div>
                      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        Create Event
                        <Sparkles className="w-5 h-5 text-yellow-300" />
                      </h2>
                      <p className="text-white/80 text-sm mt-0.5">Schedule your next activity</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={onClose}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2.5 hover:bg-white/20 rounded-xl transition-all duration-200"
                  >
                    <X className="w-6 h-6 text-white" />
                  </motion.button>
                </div>
              </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
              {/* Title */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <AlignLeft className="w-4 h-4 text-[#37A6FF]" />
                  Event Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37A6FF]/20 transition text-base ${
                    errors.title ? 'border-red-500' : 'border-gray-200 focus:border-[#37A6FF]'
                  }`}
                  placeholder="e.g., Computer Science 101"
                />
                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
              </div>

              {/* Type */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <div className="w-2 h-2 rounded-full bg-[#37A6FF]"></div>
                  Event Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {[
                    { value: 'class', label: 'Class', icon: <GraduationCap className="w-6 h-6" /> },
                    { value: 'study', label: 'Study', icon: <BookOpen className="w-6 h-6" /> },
                    { value: 'job', label: 'Job', icon: <Briefcase className="w-6 h-6" /> },
                    { value: 'social', label: 'Social', icon: <Users className="w-6 h-6" /> },
                    { value: 'other', label: 'Other', icon: <MoreHorizontal className="w-6 h-6" /> },
                  ].map((type) => (
                    <motion.button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: type.value as CalendarEvent['type'] })}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        formData.type === type.value
                          ? 'border-[#37A6FF] bg-gradient-to-br from-[#EAF7FF] to-[#D6F0FF] shadow-lg shadow-[#37A6FF]/20'
                          : 'border-gray-200 hover:border-[#37A6FF]/50 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center mb-2 transition-all ${
                        formData.type === type.value 
                          ? 'bg-gradient-to-br from-[#37A6FF] to-[#1F4E79] text-white shadow-lg' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {type.icon}
                      </div>
                      <div className="text-xs font-semibold text-center">{type.label}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Calendar className="w-4 h-4 text-[#37A6FF]" />
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37A6FF]/20 transition cursor-pointer ${
                      errors.date ? 'border-red-500' : 'border-gray-200 focus:border-[#37A6FF]'
                    }`}
                  />
                  {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Clock className="w-4 h-4 text-[#37A6FF]" />
                    Start Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37A6FF]/20 transition cursor-pointer ${
                      errors.startTime ? 'border-red-500' : 'border-gray-200 focus:border-[#37A6FF]'
                    }`}
                  />
                  {errors.startTime && <p className="mt-1 text-sm text-red-500">{errors.startTime}</p>}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Clock className="w-4 h-4 text-[#37A6FF]" />
                    End Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37A6FF]/20 transition cursor-pointer ${
                      errors.endTime ? 'border-red-500' : 'border-gray-200 focus:border-[#37A6FF]'
                    }`}
                  />
                  {errors.endTime && <p className="mt-1 text-sm text-red-500">{errors.endTime}</p>}
                </div>
              </div>

              {/* Recurrence & Reminder */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Repeat className="w-4 h-4 text-[#37A6FF]" />
                    Recurrence
                  </label>
                  <select
                    value={formData.recurrence || 'none'}
                    onChange={(e) => setFormData({ ...formData, recurrence: e.target.value as CalendarEvent['recurrence'] })}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37A6FF]/20 focus:border-[#37A6FF] transition cursor-pointer bg-white"
                  >
                    <option value="none">Does not repeat</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Bell className="w-4 h-4 text-[#37A6FF]" />
                    Reminder
                  </label>
                  <select
                    value={formData.reminder || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, reminder: e.target.value ? Number(e.target.value) as CalendarEvent['reminder'] : null })
                    }
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37A6FF]/20 focus:border-[#37A6FF] transition cursor-pointer bg-white"
                  >
                    <option value="">No reminder</option>
                    <option value="10">10 minutes before</option>
                    <option value="30">30 minutes before</option>
                    <option value="60">1 hour before</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <AlignLeft className="w-4 h-4 text-[#37A6FF]" />
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37A6FF]/20 focus:border-[#37A6FF] transition resize-none"
                  placeholder="Add any additional details..."
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <motion.button
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(55, 166, 255, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-[#37A6FF] to-[#1F4E79] text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#37A6FF]/30"
                >
                  <Calendar className="w-5 h-5" />
                  Create Event
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
        </>
      )}
    </AnimatePresence>
  )
}
