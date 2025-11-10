import { useState } from 'react'
import { motion } from 'framer-motion'
import type { CalendarEvent } from '../../../pages/dashboard/CalendarPage'
import { format, addDays, isSameDay, setHours, setMinutes } from 'date-fns'

interface CalendarDayViewProps {
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

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8) // 8 AM to 8 PM

export default function CalendarDayView({ events, onUpdateEvent, onDeleteEvent }: CalendarDayViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null)

  const dayEvents = events.filter((event) => isSameDay(event.startTime, currentDate))

  const goToPreviousDay = () => {
    setCurrentDate(addDays(currentDate, -1))
  }

  const goToNextDay = () => {
    setCurrentDate(addDays(currentDate, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const handleDragStart = (event: CalendarEvent) => {
    setDraggedEvent(event)
  }

  const handleDrop = (hour: number) => {
    if (draggedEvent) {
      const duration =
        (draggedEvent.endTime.getTime() - draggedEvent.startTime.getTime()) / (1000 * 60) // Duration in minutes

      const newStartTime = setMinutes(setHours(currentDate, hour), 0)
      const newEndTime = new Date(newStartTime.getTime() + duration * 60 * 1000)

      const updatedEvent = {
        ...draggedEvent,
        startTime: newStartTime,
        endTime: newEndTime,
      }

      onUpdateEvent(updatedEvent)
      setDraggedEvent(null)
    }
  }

  const getEventPosition = (event: CalendarEvent) => {
    const startHour = event.startTime.getHours()
    const startMinute = event.startTime.getMinutes()
    const endHour = event.endTime.getHours()
    const endMinute = event.endTime.getMinutes()

    const top = ((startHour - 8 + startMinute / 60) / 13) * 100
    const height = ((endHour - startHour + (endMinute - startMinute) / 60) / 13) * 100

    return { top: `${top}%`, height: `${height}%` }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
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
              onClick={goToPreviousDay}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNextDay}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div>
            <div className="text-lg font-semibold text-[#1F4E79]">{format(currentDate, 'EEEE')}</div>
            <div className="text-sm text-gray-600">{format(currentDate, 'MMMM d, yyyy')}</div>
          </div>
        </div>
        <div className="text-sm text-gray-600">{dayEvents.length} events</div>
      </div>

      {/* Time Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-[100px_1fr] min-h-full">
          {/* Time Labels */}
          <div className="border-r border-gray-200">
            {HOURS.map((hour) => (
              <div key={hour} className="h-24 px-4 py-2 text-right text-sm text-gray-600 border-b border-gray-100">
                {format(setHours(new Date(), hour), 'h a')}
              </div>
            ))}
          </div>

          {/* Day Column */}
          <div className="relative">
            {/* Hour Dividers */}
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="h-24 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(hour)}
              />
            ))}

            {/* Events */}
            {dayEvents.map((event) => {
              const { top, height } = getEventPosition(event)
              return (
                <motion.div
                  key={event.id}
                  draggable
                  onDragStart={() => handleDragStart(event)}
                  style={{
                    position: 'absolute',
                    top,
                    height,
                    left: '8px',
                    right: '8px',
                    backgroundColor: EVENT_COLORS[event.type],
                  }}
                  className="rounded-lg p-3 cursor-move shadow-md group"
                  whileHover={{ scale: 1.02, zIndex: 10 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div
                    className="font-semibold text-sm mb-1"
                    style={{
                      color: event.type === 'social' || event.type === 'other' ? '#1F4E79' : 'white',
                    }}
                  >
                    {event.title}
                  </div>
                  <div
                    className="text-xs"
                    style={{
                      color: event.type === 'social' || event.type === 'other' ? '#1F4E79' : 'white',
                    }}
                  >
                    {format(event.startTime, 'h:mm a')} - {format(event.endTime, 'h:mm a')}
                  </div>
                  {event.description && (
                    <div
                      className="text-xs mt-1 line-clamp-2"
                      style={{
                        color: event.type === 'social' || event.type === 'other' ? '#1F4E79' : 'white',
                      }}
                    >
                      {event.description}
                    </div>
                  )}
                  <button
                    onClick={() => onDeleteEvent(event.id)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-sm font-bold shadow-md"
                  >
                    ×
                  </button>
                </motion.div>
              )
            })}

            {/* Current Time Indicator */}
            {isSameDay(currentDate, new Date()) && (
              <motion.div
                className="absolute left-0 right-0 h-0.5 bg-red-500 z-20"
                style={{
                  top: `${((new Date().getHours() - 8 + new Date().getMinutes() / 60) / 13) * 100}%`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="absolute -left-2 -top-2 w-4 h-4 bg-red-500 rounded-full" />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {dayEvents.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-4xl mb-2">📅</div>
            <div className="text-gray-500">No events scheduled for this day</div>
          </div>
        </div>
      )}
    </div>
  )
}
