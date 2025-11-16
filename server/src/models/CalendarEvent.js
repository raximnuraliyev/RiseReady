import mongoose from 'mongoose'

const CalendarEventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  title: { type: String, required: true },
  type: { type: String },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  reminderMinutes: { type: Number },
  location: { type: String },
}, { timestamps: true })

export const CalendarEvent = mongoose.model('CalendarEvent', CalendarEventSchema)
