import mongoose from 'mongoose'

// Badge definitions (system-wide)
const BadgeDefinitionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  icon: { type: String, default: '🏆' },
  category: { type: String, default: 'General' }, // Focus, Skills, Budget, etc.
  requirement: { type: String }, // Description of how to earn it
}, { timestamps: true })

// User-earned badges
const UserBadgeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  badgeName: { type: String, required: true },
  earnedAt: { type: Date, default: Date.now },
}, { timestamps: true })

UserBadgeSchema.index({ userId: 1, badgeName: 1 }, { unique: true })

export const BadgeDefinition = mongoose.model('BadgeDefinition', BadgeDefinitionSchema)
export const UserBadge = mongoose.model('UserBadge', UserBadgeSchema)
