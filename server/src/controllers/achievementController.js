import { UserProgress } from '../models/UserProgress.js'
import { Badge } from '../models/Badge.js'
import { AchievementDefinition, UserAchievement } from '../models/Achievement.js'
import { Level } from '../models/Level.js'
import levelSeeds from '../data/levels.json' assert { type: 'json' }
import badgeSeeds from '../data/badgeSeeds.js'

// Seed levels and badges if not already in database
export const seedLevelsAndBadges = async () => {
  try {
    const levelCount = await Level.countDocuments()
    if (levelCount === 0) {
      await Level.insertMany(levelSeeds)
      console.log('✅ Seeded 100 levels')
    }

    const badgeCount = await Badge.countDocuments()
    if (badgeCount === 0) {
      await Badge.insertMany(badgeSeeds)
      console.log('✅ Seeded 100 badges')
    }
  } catch (error) {
    console.error('❌ Seed error:', error.message)
  }
}

// Gain XP and check for level up and badge unlocks
export const gainXP = async (req, res) => {
  try {
    const { userId, amount, source = 'general' } = req.body

    const userProgress = await UserProgress.findOne({ userId }).exec()
    if (!userProgress) {
      return res.status(404).json({ error: 'User progress not found' })
    }

    // Add experience
    const result = await userProgress.addExperience(amount, source)

    // Check for badge unlocks
    const unlockedBadges = await checkBadgeUnlocks(userProgress)

    // Check for achievements
    const unlockedAchievements = await checkAchievementProgress(userProgress)

    res.json({
      success: true,
      xpGained: result.xpGained,
      level: result.level,
      totalXP: result.totalXP,
      multiplier: result.multiplier,
      leveledUp: result.leveledUp,
      newLevel: result.newLevel,
      unlockedBadges,
      unlockedAchievements
    })
  } catch (error) {
    console.error('❌ Gain XP error:', error)
    res.status(500).json({ error: error.message })
  }
}

// Check which badges should be unlocked
const checkBadgeUnlocks = async (userProgress) => {
  const unlockedBadges = []

  try {
    const badges = await Badge.find({}).exec()

    for (const badgeDef of badges) {
      const alreadyUnlocked = userProgress.badges.find(b => b.badgeId === badgeDef.badgeId)
      if (alreadyUnlocked) continue

      // Check unlock condition
      const shouldUnlock = evaluateUnlockCondition(badgeDef.unlockCondition, userProgress)

      if (shouldUnlock) {
        const unlocked = await userProgress.unlockBadge({
          badgeId: badgeDef.badgeId,
          name: badgeDef.name,
          rarity: badgeDef.rarity,
          category: badgeDef.category
        })

        if (unlocked) {
          unlockedBadges.push({
            badgeId: badgeDef.badgeId,
            name: badgeDef.name,
            rarity: badgeDef.rarity,
            category: badgeDef.category,
            icon: badgeDef.icon
          })
        }
      }
    }

    // Save user progress if badges were unlocked
    if (unlockedBadges.length > 0) {
      await userProgress.save()
    }

    return unlockedBadges
  } catch (error) {
    console.error('❌ Badge unlock check error:', error)
    return []
  }
}

// Evaluate unlock condition for a badge
const evaluateUnlockCondition = (condition, userProgress) => {
  if (!condition) return false

  switch (condition.type) {
    case 'numeric':
      // Check if metric value meets target
      const value = getMetricValue(condition.metric, userProgress)
      return value >= (condition.target || 0)

    case 'streak':
      // Check if current streak meets target
      const streakValue = getMetricValue(condition.metric, userProgress)
      return streakValue >= (condition.target || 0)

    case 'skill':
      // Check if user has mastered required skill
      const masteredSkills = userProgress.achievements.filter(a => a.completed && a.category === 'skills')
      return masteredSkills.length >= (condition.target || 0)

    case 'social':
      // Check social metric
      const socialValue = getMetricValue(condition.metric, userProgress)
      return socialValue >= (condition.target || 0)

    case 'time':
      // Check time-based metric
      const timeValue = getMetricValue(condition.metric, userProgress)
      return timeValue >= (condition.target || 0)

    case 'perfect_score':
      // Check if user has perfect score for required days
      const perfectDays = userProgress.streakData?.perfectDays || 0
      return perfectDays >= (condition.target || 0)

    case 'milestone':
      // Check if milestone reached
      const milestones = userProgress.achievements.filter(a => a.completed && a.category === 'milestone')
      return milestones.length >= (condition.target || 0)

    case 'hidden':
      // Hidden badges don't auto-unlock based on condition
      return false

    default:
      return false
  }
}

// Get metric value from user progress
const getMetricValue = (metric, userProgress) => {
  if (!metric) return 0

  // Direct field access
  if (userProgress[metric] !== undefined) {
    return userProgress[metric]
  }

  // Nested field access (e.g., streakData.currentStreak)
  const parts = metric.split('.')
  let value = userProgress
  for (const part of parts) {
    if (value && typeof value === 'object') {
      value = value[part]
    } else {
      return 0
    }
  }

  return value || 0
}

// Update achievement progress
export const updateAchievementProgress = async (req, res) => {
  try {
    const { userId, achievementId, progress } = req.body

    const userProgress = await UserProgress.findOne({ userId }).exec()
    if (!userProgress) {
      return res.status(404).json({ error: 'User progress not found' })
    }

    // Find or create achievement
    let achievement = userProgress.achievements.find(a => a.id === achievementId)
    if (!achievement) {
      achievement = {
        id: achievementId,
        progress: progress || 0,
        completed: false
      }
      userProgress.achievements.push(achievement)
    } else {
      achievement.progress = progress || 0
    }

    // Check if completed
    if (achievement.progress >= achievement.target && !achievement.completed) {
      achievement.completed = true
      achievement.completedAt = new Date()
    }

    await userProgress.save()

    res.json({
      success: true,
      achievement: {
        id: achievementId,
        progress: achievement.progress,
        completed: achievement.completed
      }
    })
  } catch (error) {
    console.error('❌ Update achievement error:', error)
    res.status(500).json({ error: error.message })
  }
}

// Check and progress achievements
const checkAchievementProgress = async (userProgress) => {
  const unlockedAchievements = []

  try {
    const achievements = await AchievementDefinition.find({}).exec()

    for (const achievementDef of achievements) {
      // Find user's achievement record
      let userAchievement = userProgress.achievements.find(a => a.id === achievementDef.achievementId)

      if (!userAchievement && !achievementDef.isHidden) {
        // Create new achievement record
        userAchievement = {
          id: achievementDef.achievementId,
          name: achievementDef.name,
          category: achievementDef.category,
          description: achievementDef.description,
          progress: 0,
          target: achievementDef.requirement.target,
          completed: false
        }
        userProgress.achievements.push(userAchievement)
      }

      if (!userAchievement || userAchievement.completed) continue

      // Update progress
      const metricValue = getMetricValue(achievementDef.requirement.metric, userProgress)
      userAchievement.progress = Math.min(metricValue, achievementDef.requirement.target)

      // Check if completed
      if (userAchievement.progress >= achievementDef.requirement.target && !userAchievement.completed) {
        userAchievement.completed = true
        userAchievement.completedAt = new Date()

        // Award badge if specified
        if (achievementDef.reward?.badge) {
          const badge = await Badge.findOne({ badgeId: achievementDef.reward.badge }).exec()
          if (badge) {
            await userProgress.unlockBadge({
              badgeId: badge.badgeId,
              name: badge.name,
              rarity: badge.rarity,
              category: badge.category
            })
          }
        }

        unlockedAchievements.push({
          id: achievementDef.achievementId,
          name: achievementDef.name,
          reward: achievementDef.reward
        })
      }
    }

    if (unlockedAchievements.length > 0) {
      await userProgress.save()
    }

    return unlockedAchievements
  } catch (error) {
    console.error('❌ Achievement check error:', error)
    return []
  }
}

// Get user's full achievement data
export const getUserAchievements = async (req, res) => {
  try {
    const { userId } = req.params

    const userProgress = await UserProgress.findOne({ userId }).exec()
    if (!userProgress) {
      return res.status(404).json({ error: 'User progress not found' })
    }

    const levelData = levelSeeds[userProgress.currentLevel - 1]

    res.json({
      success: true,
      level: userProgress.currentLevel,
      xp: userProgress.currentXP,
      totalXP: userProgress.totalXPEarned,
      prestigeLevel: userProgress.prestigeLevel,
      badges: userProgress.badges,
      badgeCount: userProgress.badges.length,
      achievements: userProgress.achievements,
      streakData: userProgress.streakData,
      xpSources: userProgress.xpSources,
      selectedTitle: userProgress.selectedTitle,
      titleColor: userProgress.titleColor,
      levelData
    })
  } catch (error) {
    console.error('❌ Get achievements error:', error)
    res.status(500).json({ error: error.message })
  }
}

// Get leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const { category = 'overall', timeframe = 'all', limit = 50, page = 1 } = req.query

    const query = {}
    if (category !== 'overall') {
      query['xpSources.\\w*'] = { $gt: 0 }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const leaderboard = await UserProgress.find(query)
      .sort({ currentLevel: -1, totalXPEarned: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate('userId', 'name email')
      .exec()

    const total = await UserProgress.countDocuments(query)

    res.json({
      success: true,
      leaderboard: leaderboard.map((up, index) => ({
        rank: skip + index + 1,
        userId: up.userId?._id,
        userName: up.userId?.name || 'Anonymous',
        level: up.currentLevel,
        xp: up.currentXP,
        totalXP: up.totalXPEarned,
        badges: up.badges.length,
        streakDays: up.streakData?.currentStreak || 0
      })),
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    })
  } catch (error) {
    console.error('❌ Get leaderboard error:', error)
    res.status(500).json({ error: error.message })
  }
}

// Get badge details
export const getBadgeDetails = async (req, res) => {
  try {
    const { badgeId } = req.params

    const badge = await Badge.findOne({ badgeId }).exec()
    if (!badge) {
      return res.status(404).json({ error: 'Badge not found' })
    }

    res.json({
      success: true,
      badge: {
        badgeId: badge.badgeId,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        rarity: badge.rarity,
        category: badge.category,
        unlockCondition: badge.unlockCondition,
        cosmetics: badge.cosmetics,
        isSeasonal: badge.isSeasonal,
        isHidden: badge.isHidden,
        pointsReward: badge.pointsReward
      }
    })
  } catch (error) {
    console.error('❌ Get badge error:', error)
    res.status(500).json({ error: error.message })
  }
}

export default {
  seedLevelsAndBadges,
  gainXP,
  updateAchievementProgress,
  getUserAchievements,
  getLeaderboard,
  getBadgeDetails
}
