import mongoose from 'mongoose'

const levelSchema = new mongoose.Schema({
  level: { 
    type: Number, 
    required: true, 
    unique: true, 
    min: 1, 
    max: 100 
  },
  title: { type: String, required: true },
  subtitle: String,
  description: String,
  tier: {
    type: String,
    enum: ['foundation', 'growth', 'mastery', 'expert', 'legend'],
    required: true
  },
  theme: String,
  requiredXP: { type: Number, required: true },
  totalXPToReach: { type: Number, required: true },
  isMilestone: { type: Boolean, default: false },
  rewards: {
    badges: [String],
    cosmetics: [String],
    titles: [String],
    perks: [String]
  },
  unlockThresholds: {
    focusSessions: Number,
    wellnessCheckins: Number,
    skillsCompleted: Number,
    streakDays: Number,
    communityContributions: Number
  },
  createdAt: { type: Date, default: Date.now }
})

export const Level = mongoose.model('Level', levelSchema)
