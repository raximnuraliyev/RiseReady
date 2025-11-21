import type { CalendarEvent } from '../../../pages/dashboard/CalendarPage'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { Clock, Sparkles } from 'lucide-react'

interface UpcomingEventsProps {
  events: CalendarEvent[]
  mobile?: boolean
}

export default function UpcomingEvents({ events, mobile }: UpcomingEventsProps) {
  const now = new Date()
  const upcomingEvents = events
    // ensure startTime is treated as a Date (handle ISO string cases)
    .map((e) => ({ ...e, _parsedStart: e.startTime instanceof Date ? e.startTime : new Date(e.startTime) }))
    .filter((e) => e._parsedStart.getTime() >= now.getTime())
    .sort((a, b) => a._parsedStart.getTime() - b._parsedStart.getTime())
    .slice(0, 5)

  if (mobile) {
    return null // Hide on mobile for now
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="group relative h-full overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 to-cyan-800" />
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-cyan-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500" />

      <div className="relative z-10 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-xl border border-white/30 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white">Upcoming Events</h3>
        </div>

        <div className="space-y-2">
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-white/60">No upcoming events</p>
          ) : (
            upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group/item p-3 rounded-lg bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className="font-medium text-sm text-white group-hover/item:text-white transition-colors">
                  {event.title}
                </div>
                <div className="flex items-center gap-1 text-xs text-white/70 mt-1">
                  <Clock className="w-3 h-3" />
                  {format(event._parsedStart, 'MMM d, h:mm a')}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  )
}
