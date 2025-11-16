import mongoose from 'mongoose'

const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  type: { type: String, enum: ['reminder','achievement','alert','social','career'], required: true },
  title: String,
  message: String,
  link: String,
  isRead: { type: Boolean, default: false },
  // Whether the notification has been sent/processed by any external worker (email/push)
  sent: { type: Boolean, default: false },
  sentAt: { type: Date },
  // Batched claim fields to coordinate multiple workers
  claimedId: { type: String, index: true, sparse: true },
  claimedAt: { type: Date },
  priority: { type: String, enum: ['high','medium','low'], default: 'low' }
}, { timestamps: { createdAt: true, updatedAt: false } })

export const Notification = mongoose.model('Notification', NotificationSchema)
