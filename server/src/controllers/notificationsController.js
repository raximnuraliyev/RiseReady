import { Notification } from '../models/Notification.js'

export async function listNotifications(req, res) {
  // Only return notifications that are scheduled at or before now.
  const now = new Date()
  const items = await Notification.find({ userId: req.user.id, createdAt: { $lte: now } })
    .sort({ createdAt: -1 })
    .limit(50)
  res.json(items)
}

export async function markRead(req, res) {
  const { id } = req.params
  await Notification.updateOne({ _id: id, userId: req.user.id }, { $set: { isRead: true } })
  res.json({ ok: true })
}

export async function markAllRead(req, res) {
  await Notification.updateMany({ userId: req.user.id, isRead: false }, { $set: { isRead: true } })
  res.json({ ok: true })
}
