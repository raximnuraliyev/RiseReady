import { useState } from 'react'
import { motion } from 'framer-motion'
import type { CalendarEvent } from '../../../pages/dashboard/CalendarPage'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths } from 'date-fns'

interface CalendarMonthViewProps {
  events: CalendarEvent[]
  onUpdateEvent: (event: CalendarEvent) => void
  onDeleteEvent: (eventId: string) => void
}

const EVENT_COLORS = {
  class: '#1F4E79',
  study: '#37A6FF',
  job: '#6B8E9F',
  social: '#B8D96F',
  other: '#D3D3D3',
}

export default function CalendarMonthView({ events, onDeleteEvent }: CalendarMonthViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 })
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 })

  const dateFormat = 'MMMM yyyy'
  const days = []
  let day = startDate

  while (day <= endDate) {
    days.push(day)
    day = addDays(day, 1)
  }

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(event.startTime, day))
  }

  const goToPreviousMonth = () => {
    setCurrentDate(addMonths(currentDate, -1))
  }

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const selectedDayEvents = selectedDate ? getEventsForDay(selectedDate) : []

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button
            onClick={goToToday}
            className="px-4 py-2 text-sm font-medium text-[#1F4E79] bg-[#EAF7FF] rounded-md hover:bg-[#D6F0FF] transition-colors"
          >
            Today
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <span className="text-lg font-semibold text-[#1F4E79]">{format(currentDate, dateFormat)}</span>
        </div>
      </div>

      <div className="p-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-px mb-px">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="py-3 text-center text-sm font-semibold text-gray-600 bg-gray-50 rounded-t-lg">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
          {days.map((day, i) => {
            const dayEvents = getEventsForDay(day)
            const isCurrentMonth = isSameMonth(day, monthStart)
            const isToday = isSameDay(day, new Date())
            const isSelected = selectedDate && isSameDay(day, selectedDate)

            return (
              <motion.div
                key={i}
                onClick={() => setSelectedDate(day)}
                className={`min-h-[120px] p-2 bg-white cursor-pointer transition-colors ${
                  !isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
                } ${
                  isSelected ? 'ring-2 ring-[#37A6FF] ring-inset' : 'hover:bg-gray-50'
                }`}
                whileHover={{ scale: 1.01 }}
              >
                <div
                  className={`text-sm font-semibold mb-1 ${
                    isToday
                      ? 'w-7 h-7 bg-[#37A6FF] text-white rounded-full flex items-center justify-center'
                      : ''
                  }`}
                >
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-xs px-2 py-1 rounded truncate group relative"
                      style={{
                        backgroundColor: EVENT_COLORS[event.type],
                        color: event.type === 'social' || event.type === 'other' ? '#1F4E79' : 'white',
                      }}
                      whileHover={{ scale: 1.05, zIndex: 10 }}
                    >
                      {event.title}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteEvent(event.id)
                        }}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </motion.div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 pl-2">+{dayEvents.length - 3} more</div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Selected Day Details */}
        {selectedDate && selectedDayEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-[#EAF7FF] rounded-lg"
          >
            <h3 className="font-semibold text-[#1F4E79] mb-3">
              Events for {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            <div className="space-y-2">
              {selectedDayEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: EVENT_COLORS[event.type] }}
                    />
                    <div>
                      <div className="font-medium text-sm">{event.title}</div>
                      <div className="text-xs text-gray-600">
                        {format(event.startTime, 'h:mm a')} - {format(event.endTime, 'h:mm a')}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteEvent(event.id)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
