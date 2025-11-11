import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  // Basic info
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  name: { type: String, default: '' },
  // Keep the default role as 'student' for all newly created accounts
  role: { type: String, enum: ['student', 'mentor', 'admin'], default: 'student' },
  
  // Profile info
  avatarUrl: { type: String, default: '' },
  pronouns: { type: String, default: '' },
  major: { type: String, default: '' },
  year: { type: String, default: '' },
  university: { type: String, default: '' },
  bio: { type: String, default: '' },
  
  // Social links
  linkedin: { type: String, default: '' },
  github: { type: String, default: '' },
  discord: { type: String, default: '' },
  // Persistent Discord account identifier for bot linking (Discord snowflake)
  discordId: { type: String, default: '' },
  // Persistent Telegram account identifier (optional)
  telegramId: { type: String, default: '' },
  telegram: { type: String, default: '' },
  
  // Progress tracking
  progress: {
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    streakDays: { type: Number, default: 0 },
    lastActive: { type: Date },
    totalPoints: { type: Number, default: 0 },
    skillPoints: { type: Map, of: Number, default: {} }, // Points per skill category
    completedTasks: { type: Number, default: 0 },
    achievements: [{ 
      id: String,
      name: String,
      description: String,
      earnedAt: Date
    }]
  },
  
  // User settings
  settings: {
    notifications: {
      reminders: { type: Boolean, default: true },
      achievements: { type: Boolean, default: true },
      social: { type: Boolean, default: true },
      career: { type: Boolean, default: true },
    },
    privacy: {
      profileVisible: { type: Boolean, default: true },
      statsVisible: { type: Boolean, default: true },
    },
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' }
  },
  
  // Relationships
  badgeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }],
  careerPathId: { type: mongoose.Schema.Types.ObjectId, ref: 'CareerPath' },
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Stats tracking
  stats: {
    focusMinutes: { type: Number, default: 0 },
    tasksCompleted: { type: Number, default: 0 },
    skillsLearned: { type: Number, default: 0 },
    projectsCompleted: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 }
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Calculate XP needed for next level
UserSchema.virtual('nextLevelXp').get(function() {
  return Math.floor(100 * Math.pow(1.2, this.progress.level))
})

// Calculate progress percentage to next level
UserSchema.virtual('levelProgress').get(function() {
  return (this.progress.xp / this.nextLevelXp) * 100
})

// Add XP and handle level ups
UserSchema.methods.addXP = async function(amount) {
  let { xp, level } = this.progress
  xp += amount
  
  // Check for level ups
  while (xp >= this.nextLevelXp) {
    xp -= this.nextLevelXp
    level++
  }
  
  // Update progress
  this.progress.xp = xp
  this.progress.level = level
  
  await this.save()
  return {
    newLevel: level,
    leveledUp: level > this.progress.level,
    currentXp: xp,
    nextLevelXp: this.nextLevelXp,
    progress: this.levelProgress
  }
}

// Update streak
UserSchema.methods.updateStreak = async function() {
  const now = new Date()
  const lastActive = this.progress.lastActive || now
  const daysSinceActive = Math.floor((now - lastActive) / (1000 * 60 * 60 * 24))
  
  if (daysSinceActive <= 1) {
    // Maintain or increase streak
    this.progress.streakDays += 1
    if (this.progress.streakDays > this.stats.longestStreak) {
      this.stats.longestStreak = this.progress.streakDays
    }
  } else {
    // Reset streak
    this.progress.streakDays = 1
  }
  
  this.progress.lastActive = now
  await this.save()
  return this.progress.streakDays
}

// Add skill points
UserSchema.methods.addSkillPoints = async function(skillCategory, points) {
  const currentPoints = this.progress.skillPoints.get(skillCategory) || 0
  this.progress.skillPoints.set(skillCategory, currentPoints + points)
  this.progress.totalPoints += points
  await this.save()
  return this.progress.skillPoints.get(skillCategory)
}

// Add achievement
UserSchema.methods.addAchievement = async function(achievement) {
  const exists = this.progress.achievements.some(a => a.id === achievement.id)
  if (!exists) {
    this.progress.achievements.push({
      ...achievement,
      earnedAt: new Date()
    })
    await this.save()
    return true
  }
  return false
}

// Add generic points (used across features like focus sessions, career tasks)
UserSchema.methods.addPoints = async function(points = 0) {
  // Ensure numeric
  const pts = Number(points) || 0
  this.progress.totalPoints = (this.progress.totalPoints || 0) + pts

  // Award XP as well (points contribute to XP)
  // addXP will persist the document, so call it after updating totalPoints
  const xpResult = await this.addXP(pts)
  return xpResult
}

export const User = mongoose.model('User', UserSchema)
