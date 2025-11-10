import { CalendarEvent } from '../models/CalendarEvent.js'
import { Notification } from '../models/Notification.js'
import { getIO } from '../lib/socket.js'

export async function listEvents(req, res) {
  const events = await CalendarEvent.find({ userId: req.user.id }).sort({ startTime: 1 })
  res.json(events)
}

export async function createEvent(req, res) {
  // Map possible reminder field to reminderMinutes so schema stays consistent
  const reminderMinutes = req.body.reminder ?? req.body.reminderMinutes ?? null
  const payload = { ...req.body, reminderMinutes, userId: req.user.id }
  const e = await CalendarEvent.create(payload)

  // If a reminder was requested, create a scheduled notification.
  try {
    if (reminderMinutes) {
      const start = new Date(req.body.startTime)
      const remindAt = new Date(start.getTime() - Number(reminderMinutes) * 60 * 1000)
      // Create a notification with createdAt set to the reminder time so it only shows up when due
      const n = await Notification.create({
        userId: req.user.id,
        type: 'reminder',
        title: `Upcoming: ${e.title}`,
        message: `Starts ${start.toLocaleString()}`,
        link: `/calendar/events/${e._id}`,
        priority: 'low',
        createdAt: remindAt,
      })

      // If the reminder time is already due, emit it immediately via socket
      try {
        const now = new Date()
        if (remindAt.getTime() <= now.getTime()) {
          try {
            const io = getIO()
            io.to(String(req.user.id)).emit('notification', n)
          } catch (err) {
            // ignore if socket server not available
          }
        }
      } catch (err) {}
    }
  } catch (err) {
    // Don’t fail the event creation if notification creation fails — log and continue
    console.error('Failed to create reminder notification', err)
  }

  res.status(201).json(e)
}

export async function updateEvent(req, res) {
  const { id } = req.params
  // Normalize reminder field
  const reminderMinutes = req.body.reminder ?? req.body.reminderMinutes ?? null
  const payload = { ...req.body, reminderMinutes }

  const updated = await CalendarEvent.findOneAndUpdate({ _id: id, userId: req.user.id }, payload, { new: true })
  if (!updated) return res.status(404).json({ error: 'Not found' })

  // Remove any existing reminder notifications for this event and recreate if needed
  try {
    await Notification.deleteMany({ userId: req.user.id, link: `/calendar/events/${id}`, type: 'reminder' })
    if (reminderMinutes) {
      const start = new Date(payload.startTime)
      const remindAt = new Date(start.getTime() - Number(reminderMinutes) * 60 * 1000)
      const n = await Notification.create({
        userId: req.user.id,
        type: 'reminder',
        title: `Upcoming: ${updated.title}`,
        message: `Starts ${start.toLocaleString()}`,
        link: `/calendar/events/${updated._id}`,
        priority: 'low',
        createdAt: remindAt,
      })

      try {
        const now = new Date()
        if (remindAt.getTime() <= now.getTime()) {
          try {
            const io = getIO()
            io.to(String(req.user.id)).emit('notification', n)
          } catch (err) {}
        }
      } catch (err) {}
    }
  } catch (err) {
    console.error('Failed to sync reminder notifications for updated event', err)
  }

  res.json(updated)
}

export async function deleteEvent(req, res) {
  const { id } = req.params
  const deleted = await CalendarEvent.findOneAndDelete({ _id: id, userId: req.user.id })
  if (!deleted) return res.status(404).json({ error: 'Not found' })

  // Remove any reminder notifications tied to this event
  try {
    await Notification.deleteMany({ userId: req.user.id, link: `/calendar/events/${id}`, type: 'reminder' })
  } catch (err) {
    console.error('Failed to remove reminder notifications for deleted event', err)
  }

  res.json({ ok: true })
}
