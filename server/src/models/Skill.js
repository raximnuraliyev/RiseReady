import mongoose from 'mongoose'

const SkillSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  category: { type: String, default: 'Other' }, // e.g., 'Academic', 'Technical', 'Soft Skills'
  level: { type: Number, default: 0, min: 0, max: 100 }, // Progress percentage
  practiced: { type: Number, default: 0 }, // Number of times practiced
  lastPracticed: { type: Date },
  notes: { type: String, default: '' },
}, { timestamps: true })

SkillSchema.index({ userId: 1, name: 1 }, { unique: true })

export const Skill = mongoose.model('Skill', SkillSchema)
