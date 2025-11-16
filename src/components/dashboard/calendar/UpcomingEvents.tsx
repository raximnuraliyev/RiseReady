import type { CalendarEvent } from '../../../pages/dashboard/CalendarPage'
import { format } from 'date-fns'

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
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-[#1F4E79] mb-4">Upcoming Events</h3>
      <div className="space-y-3">
        {upcomingEvents.length === 0 ? (
          <p className="text-sm text-gray-500">No upcoming events</p>
        ) : (
          upcomingEvents.map((event) => (
            <div key={event.id} className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="font-medium text-sm text-[#1F4E79]">{event.title}</div>
              <div className="text-xs text-gray-600 mt-1">
                {format(event._parsedStart, 'MMM d, h:mm a')}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
