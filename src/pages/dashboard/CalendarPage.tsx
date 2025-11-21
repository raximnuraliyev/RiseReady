import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Plus } from 'lucide-react'
import CalendarWeekView from '../../components/dashboard/calendar/CalendarWeekView'
import CalendarMonthView from '../../components/dashboard/calendar/CalendarMonthView'
import CalendarDayView from '../../components/dashboard/calendar/CalendarDayView'
import UpcomingEvents from '../../components/dashboard/calendar/UpcomingEvents'
import AddEventModal from '../../components/dashboard/calendar/AddEventModal'
import useCalendar from '../../hooks/useCalendar'

export type CalendarEvent = {
  id: string
  title: string
  type: 'class' | 'study' | 'job' | 'social' | 'other'
  startTime: Date
  endTime: Date
  recurrence?: 'none' | 'daily' | 'weekly' | 'monthly'
  reminder?: 10 | 30 | 60 | null
  description?: string
}

type ViewType = 'week' | 'month' | 'day'

export default function CalendarPage() {
  const [view, setView] = useState<ViewType>('week')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const { events, createEvent, updateEvent, deleteEvent } = useCalendar()

  const handleAddEvent = async (event: Omit<CalendarEvent, 'id'>) => {
    await createEvent(event)
    setIsAddModalOpen(false)
  }

  const handleUpdateEvent = async (updatedEvent: CalendarEvent) => {
    await updateEvent(updatedEvent)
  }

  const handleDeleteEvent = async (eventId: string) => {
    await deleteEvent(eventId)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Calendar className="w-7 h-7 text-white" strokeWidth={2} />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your schedule</p>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                {(['day', 'week', 'month'] as ViewType[]).map((viewType) => (
                  <motion.button
                    key={viewType}
                    onClick={() => setView(viewType)}
                    className={`px-4 py-2 rounded-md font-medium capitalize transition-colors relative ${
                      view === viewType
                        ? 'text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    {view === viewType && (
                      <motion.div
                        layoutId="activeView"
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-md"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{viewType}</span>
                  </motion.button>
                ))}
              </div>

              {/* Add Event Button */}
              <motion.button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg font-semibold shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="w-5 h-5" />
                Add Event
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Calendar Grid */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, x: view === 'month' ? 20 : view === 'day' ? -20 : 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: view === 'month' ? -20 : view === 'day' ? 20 : 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {view === 'week' && (
                  <CalendarWeekView
                    events={events}
                    onUpdateEvent={handleUpdateEvent}
                    onDeleteEvent={handleDeleteEvent}
                  />
                )}
                {view === 'month' && (
                  <CalendarMonthView
                    events={events}
                    onUpdateEvent={handleUpdateEvent}
                    onDeleteEvent={handleDeleteEvent}
                  />
                )}
                {view === 'day' && (
                  <CalendarDayView
                    events={events}
                    onUpdateEvent={handleUpdateEvent}
                    onDeleteEvent={handleDeleteEvent}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Upcoming Events Sidebar - Hidden on mobile */}
          <div className="hidden lg:block w-80">
            <UpcomingEvents events={events} />
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      <AddEventModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddEvent={handleAddEvent}
      />

      {/* Mobile Add Button - Fixed bottom right */}
      <motion.button
        onClick={() => setIsAddModalOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-full shadow-lg flex items-center justify-center z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ y: [0, -10, 0] }}
        transition={{
          y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      {/* Mobile Upcoming Events - Collapsible at bottom */}
      <div className="lg:hidden fixed bottom-20 left-0 right-0 z-40">
        <UpcomingEvents events={events} mobile />
      </div>
    </div>
  )
}
