import mongoose from 'mongoose'

const UserProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  
  // Leveling System (1-100)
  currentLevel: { type: Number, default: 1, min: 1, max: 100 },
  currentXP: { type: Number, default: 0 },
  totalXPEarned: { type: Number, default: 0 },
  prestigeLevel: { type: Number, default: 0 },
  
  // Badges & Achievements
  badges: [{
    badgeId: String,
    name: String,
    rarity: { type: String, enum: ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'] },
    category: String,
    unlockedAt: { type: Date, default: Date.now },
    isNew: { type: Boolean, default: true }
  }],
  
  achievements: [{
    id: String,
    name: String,
    description: String,
    category: String,
    progress: { type: Number, default: 0 },
    target: Number,
    completed: { type: Boolean, default: false },
    completedAt: Date,
    reward: Number
  }],
  
  // Customization (Cosmetics)
  selectedTitle: { type: String, default: 'Rookie' },
  selectedBadgeFrame: String,
  titleColor: { type: String, default: '#3B82F6' },
  auraEffect: String,
  
  // Streak & Activity
  streakData: {
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastActivityDate: Date,
    perfectDays: { type: Number, default: 0 },
    totalActiveDays: { type: Number, default: 0 }
  },
  
  // XP Sources Tracking
  xpSources: {
    focusSessions: { type: Number, default: 0 },
    wellnessCheckins: { type: Number, default: 0 },
    skillsCompleted: { type: Number, default: 0 },
    projectsTasks: { type: Number, default: 0 },
    communityContributions: { type: Number, default: 0 },
    streakBonuses: { type: Number, default: 0 },
    achievementBonuses: { type: Number, default: 0 },
    eventBonuses: { type: Number, default: 0 }
  },
  
  // Multiplier system
  activeMultipliers: [{
    type: String,
    multiplier: Number,
    source: String,
    expiresAt: Date
  }],
  
  // Leaderboard
  leaderboardRank: Number,
  leaderboardScore: { type: Number, default: 0 },
  
  // Projects & Skills (kept for compatibility)
  totalProjects: { type: Number, default: 0 },
  completedProjects: { type: Number, default: 0 },
  activeProjects: { type: Number, default: 0 },
  pendingProjects: { type: Number, default: 0 },
  
  progressHistory: [{
    date: { type: Date, default: Date.now },
    type: String,
    metric: String,
    value: Number,
    change: Number,
    xpGained: Number,
    multiplier: Number
  }],
}, { timestamps: true })

// Calculate level from XP using exponential formula: baseXP × (1.15 ^ (level - 1))
UserProgressSchema.methods.calculateLevelFromXP = function() {
  const baseXP = 100
  const multiplier = 1.15
  let totalXPNeeded = 0
  let level = 1
  
  for (let i = 1; i <= 100; i++) {
    const requiredXP = Math.floor(baseXP * Math.pow(multiplier, i - 1))
    totalXPNeeded += requiredXP
    
    if (this.currentXP < totalXPNeeded) {
      level = Math.max(1, i)
      break
    }
    level = i
  }
  
  return Math.min(100, Math.max(1, level))
}

// Get XP needed for next level
UserProgressSchema.methods.getXPForNextLevel = function() {
  const baseXP = 100
  const multiplier = 1.15
  const nextLevel = Math.min(this.currentLevel + 1, 100)
  return Math.floor(baseXP * Math.pow(multiplier, nextLevel - 1))
}

// Get total XP needed to reach current level
UserProgressSchema.methods.getTotalXPForLevel = function(level = this.currentLevel) {
  const baseXP = 100
  const multiplier = 1.15
  let total = 0
  
  for (let i = 1; i < level; i++) {
    total += Math.floor(baseXP * Math.pow(multiplier, i - 1))
  }
  
  return total
}

// Add experience with multiplier system
UserProgressSchema.methods.addExperience = async function(amount, source = 'general') {
  const oldLevel = this.currentLevel
  
  // Calculate multiplier from active multipliers
  let multiplier = 1
  if (this.activeMultipliers && this.activeMultipliers.length > 0) {
    const now = new Date()
    this.activeMultipliers = this.activeMultipliers.filter(m => new Date(m.expiresAt) > now)
    multiplier = this.activeMultipliers.reduce((m, a) => m * a.multiplier, 1)
  }
  
  // Check for first activity of day (1.5x)
  const lastActivity = this.streakData.lastActivityDate
  const today = new Date().toDateString()
  const lastActivityDate = lastActivity ? new Date(lastActivity).toDateString() : null
  
  if (!lastActivityDate || lastActivityDate !== today) {
    multiplier *= 1.5
  }
  
  const finalXP = Math.floor(amount * multiplier)
  
  this.currentXP += finalXP
  this.totalXPEarned += finalXP
  this.xpSources[source] = (this.xpSources[source] || 0) + finalXP
  
  // Recalculate level
  this.currentLevel = this.calculateLevelFromXP()
  
  // Update streak
  this.streakData.lastActivityDate = new Date()
  if (!lastActivityDate || lastActivityDate !== today) {
    this.streakData.currentStreak += 1
    this.streakData.longestStreak = Math.max(this.streakData.longestStreak, this.streakData.currentStreak)
    this.streakData.totalActiveDays += 1
  }
  
  // Add to history
  this.progressHistory.push({
    date: new Date(),
    type: 'xp_gain',
    metric: source,
    xpGained: finalXP,
    multiplier
  })
  
  // Limit history to last 1000 entries
  if (this.progressHistory.length > 1000) {
    this.progressHistory = this.progressHistory.slice(-1000)
  }
  
  const leveledUp = this.currentLevel > oldLevel
  
  await this.save()
  
  return {
    level: this.currentLevel,
    xpGained: finalXP,
    totalXP: this.currentXP,
    multiplier,
    leveledUp,
    newLevel: leveledUp ? this.currentLevel : null
  }
}

// Unlock badge
UserProgressSchema.methods.unlockBadge = async function(badgeData) {
  const exists = this.badges.find(b => b.badgeId === badgeData.badgeId)
  
  if (!exists) {
    this.badges.push({
      badgeId: badgeData.badgeId,
      name: badgeData.name,
      rarity: badgeData.rarity,
      category: badgeData.category,
      unlockedAt: new Date(),
      isNew: true
    })
    await this.save()
    return true
  }
  
  return false
}

// Get badges by rarity
UserProgressSchema.methods.getBadgesByRarity = function(rarity) {
  return this.badges.filter(b => b.rarity === rarity)
}

// Get badge count by category
UserProgressSchema.methods.getBadgeCountByCategory = function(category) {
  return this.badges.filter(b => b.category === category).length
}

// Update project counts
UserProgressSchema.methods.updateProjectCounts = async function(status, change) {
  // Update total and specific status counts
  if (change > 0) this.totalProjects += change
  
  switch (status) {
    case 'completed':
      this.completedProjects = Math.max(0, this.completedProjects + change)
      break
    case 'active':
      this.activeProjects = Math.max(0, this.activeProjects + change)
      break
    case 'pending':
      this.pendingProjects = Math.max(0, this.pendingProjects + change)
      break
  }

  // Add to progress history
  this.progressHistory.push({
    date: new Date(),
    metric: `projects_${status}`,
    value: this[`${status}Projects`],
    change
  })

  await this.save()
  return {
    total: this.totalProjects,
    completed: this.completedProjects,
    active: this.activeProjects,
    pending: this.pendingProjects
  }
}

export const UserProgress = mongoose.model('UserProgress', UserProgressSchema)