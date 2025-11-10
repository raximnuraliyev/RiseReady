import { Notification } from '../models/Notification.js'

export async function getNotifications(req, res) {
  const notifications = await Notification.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .limit(50)
  res.json(notifications)
}

export async function markAsRead(req, res) {
  const { id } = req.params
  const notification = await Notification.findOneAndUpdate(
    { _id: id, userId: req.user.id },
    { isRead: true },
    { new: true }
  )
  if (!notification) return res.status(404).json({ error: 'Notification not found' })
  res.json(notification)
}

export async function markAllAsRead(req, res) {
  await Notification.updateMany(
    { userId: req.user.id, isRead: false },
    { isRead: true }
  )
  res.json({ success: true })
}

export async function deleteNotification(req, res) {
  const { id } = req.params
  await Notification.findOneAndDelete({ _id: id, userId: req.user.id })
  res.json({ success: true })
}

export async function getUnreadCount(req, res) {
  const count = await Notification.countDocuments({ userId: req.user.id, isRead: false })
  res.json({ count })
}
