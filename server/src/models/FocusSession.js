import mongoose from 'mongoose'

const FocusSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  duration: { type: Number, required: true }, // Minutes
  type: { type: String, default: 'Study' }, // Study, Work, Project, etc.
  completed: { type: Boolean, default: true },
  notes: { type: String, default: '' },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
}, { timestamps: true })

FocusSessionSchema.index({ userId: 1, startTime: -1 })

export const FocusSession = mongoose.model('FocusSession', FocusSessionSchema)
