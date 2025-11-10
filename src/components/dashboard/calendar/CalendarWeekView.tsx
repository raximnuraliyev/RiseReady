import { useState } from 'react'
import { motion } from 'framer-motion'
import type { CalendarEvent } from '../../../pages/dashboard/CalendarPage'
import { format, startOfWeek, addDays, isSameDay } from 'date-fns'

interface CalendarWeekViewProps {
  events: CalendarEvent[]
  onUpdateEvent: (event: CalendarEvent) => void
  onDeleteEvent: (eventId: string) => void
}

const EVENT_COLORS = {
  class: { bg: '#1F4E79', text: 'white' },
  study: { bg: '#37A6FF', text: 'white' },
  job: { bg: '#6B8E9F', text: 'white' },
  social: { bg: '#B8D96F', text: '#1F4E79' },
  other: { bg: '#D3D3D3', text: '#1F4E79' },
}

export default function CalendarWeekView({
  events,
  onUpdateEvent,
  onDeleteEvent,
}: CalendarWeekViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null)

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const hours = Array.from({ length: 24 }, (_, i) => i)
  const displayHours = hours.filter((h) => h >= 8 && h <= 20) // 8 AM to 8 PM

  const getEventsForDayAndHour = (day: Date, hour: number) => {
    return events.filter((event) => {
      const eventDate = event.startTime
      const eventHour = eventDate.getHours()
      return isSameDay(eventDate, day) && eventHour === hour
    })
  }

  const getEventPosition = (event: CalendarEvent) => {
    const start = event.startTime
    const end = event.endTime
    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60) // hours
    const startMinutes = start.getMinutes()
    const topOffset = (startMinutes / 60) * 100

    return {
      height: duration * 100,
      top: topOffset,
    }
  }

  const handleDragStart = (event: CalendarEvent) => {
    setDraggedEvent(event)
  }

  const handleDrop = (day: Date, hour: number) => {
    if (!draggedEvent) return

    const newStartTime = new Date(day)
    newStartTime.setHours(hour, 0, 0, 0)

    const duration =
      draggedEvent.endTime.getTime() - draggedEvent.startTime.getTime()
    const newEndTime = new Date(newStartTime.getTime() + duration)

    onUpdateEvent({
      ...draggedEvent,
      startTime: newStartTime,
      endTime: newEndTime,
    })

    setDraggedEvent(null)
  }

  const goToPreviousWeek = () => {
    setCurrentDate(addDays(currentDate, -7))
  }

  const goToNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Week Navigation */}
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
              onClick={goToPreviousWeek}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNextWeek}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <span className="text-lg font-semibold text-[#1F4E79]">
            {format(weekStart, 'MMMM d')} - {format(addDays(weekStart, 6), 'd, yyyy')}
          </span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Header - Days */}
          <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-gray-200">
            <div className="p-4" /> {/* Empty corner */}
            {weekDays.map((day, i) => (
              <div
                key={i}
                className={`p-4 text-center border-l border-gray-200 ${
                  isSameDay(day, new Date()) ? 'bg-[#EAF7FF]' : ''
                }`}
              >
                <div className="text-xs font-medium text-gray-500 uppercase">
                  {format(day, 'EEE')}
                </div>
                <div
                  className={`text-2xl font-semibold mt-1 ${
                    isSameDay(day, new Date()) ? 'text-[#37A6FF]' : 'text-gray-900'
                  }`}
                >
                  {format(day, 'd')}
                </div>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div className="relative">
            {displayHours.map((hour) => (
              <div key={hour} className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-gray-100">
                {/* Time Label */}
                <div className="p-3 text-sm font-medium text-gray-500 text-right pr-4">
                  {format(new Date().setHours(hour, 0, 0, 0), 'h:mm a')}
                </div>

                {/* Day Cells */}
                {weekDays.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className="relative border-l border-gray-100 h-24 hover:bg-gray-50 transition-colors"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(day, hour)}
                  >
                    {/* Events in this cell */}
                    {getEventsForDayAndHour(day, hour).map((event) => {
                      const { height, top } = getEventPosition(event)
                      const colors = EVENT_COLORS[event.type]

                      return (
                        <motion.div
                          key={event.id}
                          draggable
                          onDragStart={() => handleDragStart(event)}
                          className="absolute left-1 right-1 rounded-md p-2 cursor-move overflow-hidden group"
                          style={{
                            backgroundColor: colors.bg,
                            color: colors.text,
                            height: `${height}%`,
                            top: `${top}%`,
                            minHeight: '40px',
                          }}
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          whileHover={{ scale: 1.02, zIndex: 10 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="text-xs font-semibold truncate">{event.title}</div>
                          <div className="text-xs opacity-90 truncate">
                            {format(event.startTime, 'h:mm a')} - {format(event.endTime, 'h:mm a')}
                          </div>

                          {/* Delete button on hover */}
                          <button
                            onClick={() => onDeleteEvent(event.id)}
                            className="absolute top-1 right-1 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/30"
                          >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </motion.div>
                      )
                    })}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
