import mongoose from 'mongoose'

// Badge definitions (system-wide) - 100 badges across 9 categories
const BadgeDefinitionSchema = new mongoose.Schema({
  badgeId: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  icon: { type: String, default: '🏆' },
  
  // Rarity System (6 tiers)
  rarity: { 
    type: String, 
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'],
    default: 'common'
  },
  
  // Categorization (9 categories)
  category: { 
    type: String, 
    enum: ['focus', 'wellness', 'skills', 'career', 'streaks', 'community', 'achievement', 'time', 'special'],
    default: 'achievement'
  },
  
  // Unlock Conditions
  unlockCondition: {
    type: { 
      type: String, 
      enum: ['numeric', 'streak', 'skill', 'social', 'time', 'event', 'hidden'],
      default: 'numeric'
    },
    target: Number, // e.g., complete 10 focus sessions, 7 day streak
    metric: String, // e.g., focusSessions, currentStreak, tasksCompleted
    description: String
  },
  
  // Cosmetics & Rewards
  cosmetics: {
    borderColor: String, // Special border color for rarity
    glowEffect: Boolean,
    particleEffect: String,
    soundEffect: String
  },
  
  // Seasonal & Special
  isSeasonal: { type: Boolean, default: false },
  seasonalPeriod: String, // e.g., "winter_2024", "summer_2024"
  isHidden: { type: Boolean, default: false }, // Hidden badges have secret unlock conditions
  isLimited: { type: Boolean, default: false }, // Limited time availability
  
  // Properties
  maxUnlocksAllowed: Number, // null = unlimited
  pointsReward: { type: Number, default: 0 },
  requirement: { type: String }, // Legacy field for backward compatibility
  
}, { timestamps: true })

// User-earned badges with timestamp and tracking
const UserBadgeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  badgeId: { type: String, required: true },
  badgeName: { type: String, required: true }, // Legacy field
  name: String,
  rarity: String,
  category: String,
  earnedAt: { type: Date, default: Date.now, index: true },
  isNew: { type: Boolean, default: true }, // Flag for new badge notification
  notificationSent: { type: Boolean, default: false },
  discoveredAt: Date, // When user first discovered this badge exists
  progress: { type: Number, default: 0 } // Progress towards unlock (0-100%)
}, { timestamps: true })

UserBadgeSchema.index({ userId: 1, badgeId: 1 }, { unique: true })

export const BadgeDefinition = mongoose.model('BadgeDefinition', BadgeDefinitionSchema)
export const UserBadge = mongoose.model('UserBadge', UserBadgeSchema)
