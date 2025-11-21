import mongoose from 'mongoose'

// System-wide achievement definitions
const AchievementDefinitionSchema = new mongoose.Schema({
  achievementId: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  icon: { type: String, default: '⭐' },
  
  // Category
  category: {
    type: String,
    enum: ['focus', 'wellness', 'skills', 'career', 'streaks', 'community', 'time', 'special'],
    default: 'special'
  },
  
  // Progression
  requirement: {
    type: { 
      type: String, 
      enum: ['numeric', 'streak', 'skill', 'milestone', 'perfect_score', 'time', 'hidden'],
      default: 'numeric'
    },
    metric: String,
    target: Number,
    description: String
  },
  
  // Rewards
  reward: {
    xp: { type: Number, default: 0 },
    badge: String,
    title: String,
    pointsMultiplier: { type: Number, default: 1 }
  },
  
  // Properties
  isHidden: { type: Boolean, default: false },
  isSeasonal: { type: Boolean, default: false },
  seasonalPeriod: String,
  difficulty: {
    type: String,
    enum: ['easy', 'normal', 'hard', 'expert', 'legendary'],
    default: 'normal'
  },
  
}, { timestamps: true })

// User achievement progress tracking
const UserAchievementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  achievementId: { type: String, required: true },
  name: String,
  category: String,
  description: String,
  
  // Progress tracking
  progress: { type: Number, default: 0 },
  target: Number,
  completed: { type: Boolean, default: false },
  completedAt: Date,
  
  // Rewards given
  rewardGiven: { type: Boolean, default: false },
  
  // Notification
  isNew: { type: Boolean, default: true },
  notificationSent: { type: Boolean, default: false },
  
  // Milestone tracking
  milestones: [{
    percentage: Number,
    completedAt: Date
  }],
  
}, { timestamps: true })

UserAchievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true })

// Methods for AchievementDefinition
AchievementDefinitionSchema.methods.getProgressPercentage = function(currentProgress) {
  return Math.min(100, Math.floor((currentProgress / this.requirement.target) * 100))
}

// Methods for UserAchievement
UserAchievementSchema.methods.updateProgress = function(newProgress) {
  this.progress = newProgress
  const percentage = Math.min(100, Math.floor((newProgress / this.target) * 100))
  
  if (newProgress >= this.target && !this.completed) {
    this.completed = true
    this.completedAt = new Date()
  }
  
  return percentage
}

UserAchievementSchema.methods.recordMilestone = function(percentage) {
  if (!this.milestones) this.milestones = []
  
  const alreadyRecorded = this.milestones.find(m => m.percentage === percentage)
  if (!alreadyRecorded) {
    this.milestones.push({
      percentage,
      completedAt: new Date()
    })
  }
}

export const AchievementDefinition = mongoose.model('AchievementDefinition', AchievementDefinitionSchema)
export const UserAchievement = mongoose.model('UserAchievement', UserAchievementSchema)
