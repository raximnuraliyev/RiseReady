import mongoose from 'mongoose'

const CheckInSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  mood: { type: String, enum: ['great', 'good', 'okay', 'bad', 'terrible'], required: true },
  energy: { type: Number, min: 1, max: 5, required: true },
  stress: { type: Number, min: 1, max: 5, required: true },
  sleep: { type: Number, min: 0, max: 24 }, // Hours of sleep
  exercise: { type: Boolean, default: false },
  notes: { type: String, default: '' },
  date: { type: Date, default: Date.now },
}, { timestamps: true })

CheckInSchema.index({ userId: 1, date: -1 })

export const CheckIn = mongoose.model('CheckIn', CheckInSchema)
