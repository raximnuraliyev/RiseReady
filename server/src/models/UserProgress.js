import mongoose from 'mongoose'

const UserProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  level: { type: Number, default: 1 },
  totalProjects: { type: Number, default: 0 },
  completedProjects: { type: Number, default: 0 },
  activeProjects: { type: Number, default: 0 },
  pendingProjects: { type: Number, default: 0 },
  experience: { type: Number, default: 0 },
  progressHistory: [{
    date: { type: Date, default: Date.now },
    metric: String,
    value: Number,
    change: Number
  }],
}, { timestamps: true })

// Calculate level based on experience
UserProgressSchema.methods.calculateLevel = function() {
  // Simple level calculation: every 1000 XP is a new level
  const baseXP = 1000
  this.level = Math.max(1, Math.floor(this.experience / baseXP) + 1)
  return this.level
}

// Add experience points
UserProgressSchema.methods.addExperience = async function(amount) {
  const oldLevel = this.level
  this.experience += amount
  const newLevel = this.calculateLevel()
  
  if (newLevel > oldLevel) {
    // User leveled up! You could emit an event or trigger notifications here
  }
  
  await this.save()
  return { level: newLevel, experience: this.experience }
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