// Rarity tiers for badges
export type RarityTier = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic'

// Badge categories
export type BadgeCategory = 'focus' | 'wellness' | 'skills' | 'career' | 'streaks' | 'community' | 'achievement' | 'time' | 'special'

// Level tiers
export type LevelTier = 'foundation' | 'growth' | 'mastery' | 'expert' | 'legend'

// Unlock condition type
export interface UnlockCondition {
  type: 'numeric' | 'streak' | 'skill' | 'social' | 'time' | 'event' | 'hidden' | 'perfect_score' | 'milestone'
  metric: string
  target: number
  description?: string
}

// Badge definition
export interface Badge {
  badgeId: string
  name: string
  description: string
  icon: string
  rarity: RarityTier
  category: BadgeCategory
  unlockCondition: UnlockCondition
  cosmetics?: {
    borderColor?: string
    glowEffect?: boolean
    particleEffect?: string
    soundEffect?: string
  }
  isSeasonal?: boolean
  seasonalPeriod?: string
  isHidden?: boolean
  isLimited?: boolean
  pointsReward?: number
}

// User's earned badge
export interface UserBadge extends Badge {
  unlockedAt: Date
  isNew: boolean
  notificationSent?: boolean
  progress?: number
}

// Level definition
export interface Level {
  level: number
  title: string
  subtitle: string
  description: string
  tier: LevelTier
  theme: string
  requiredXP: number
  isMilestone: boolean
  rewards?: {
    badges?: string[]
    cosmetics?: {
      titleColor?: string
      glowEffect?: boolean
      particleEffect?: string
      auraEffect?: string
    }
    title?: string
    perks?: string[]
  }
}

// Achievement definition
export interface AchievementDefinition {
  achievementId: string
  name: string
  description: string
  icon: string
  category: BadgeCategory
  requirement: {
    type: 'numeric' | 'streak' | 'skill' | 'milestone' | 'perfect_score' | 'time' | 'hidden'
    metric: string
    target: number
    description?: string
  }
  reward?: {
    xp?: number
    badge?: string
    title?: string
    pointsMultiplier?: number
  }
  isHidden?: boolean
  isSeasonal?: boolean
  seasonalPeriod?: string
  difficulty?: 'easy' | 'normal' | 'hard' | 'expert' | 'legendary'
}

// User's achievement progress
export interface UserAchievement {
  id: string
  name: string
  description: string
  category: BadgeCategory
  progress: number
  target: number
  completed: boolean
  completedAt?: Date
  rewardGiven?: boolean
  isNew?: boolean
  notificationSent?: boolean
  milestones?: Array<{
    percentage: number
    completedAt?: Date
  }>
}

// XP multiplier info
export interface XPMultiplier {
  type: string
  multiplier: number
  source: string
  expiresAt: Date
}

// Streak data
export interface StreakData {
  currentStreak: number
  longestStreak: number
  lastActivityDate?: Date
  perfectDays: number
  totalActiveDays: number
}

// XP sources breakdown
export interface XPSources {
  focusSessions: number
  wellnessCheckins: number
  skillsCompleted: number
  projectsTasks: number
  communityContributions: number
  streakBonuses: number
  achievementBonuses: number
  eventBonuses: number
}

// Full user progress/level data
export interface UserLevel {
  userId: string
  currentLevel: number
  currentXP: number
  totalXPEarned: number
  prestigeLevel: number
  badges: UserBadge[]
  achievements: UserAchievement[]
  streakData: StreakData
  xpSources: XPSources
  selectedTitle: string
  selectedBadgeFrame?: string
  titleColor: string
  auraEffect?: string
  activeMultipliers?: XPMultiplier[]
  leaderboardRank?: number
  leaderboardScore: number
}

// Leaderboard entry
export interface LeaderboardEntry {
  rank: number
  userId: string
  userName: string
  level: number
  xp: number
  totalXP: number
  badges: number
  streakDays: number
}

// XP gain response
export interface XPGainResponse {
  success: boolean
  xpGained: number
  level: number
  totalXP: number
  multiplier: number
  leveledUp: boolean
  newLevel?: number
  unlockedBadges: Badge[]
  unlockedAchievements: any[]
}

// Achievement unlock response
export interface AchievementUnlockResponse {
  id: string
  name: string
  reward?: any
}

// Badge unlock response
export interface BadgeUnlockResponse {
  badgeId: string
  name: string
  rarity: RarityTier
  category: BadgeCategory
  icon: string
}

// Cosmetics for earned badges/titles
export interface BadgeCosmetics {
  borderColor?: string
  glowEffect?: boolean
  particleEffect?: string
  soundEffect?: string
}

// Title cosmetic
export interface TitleCosmetic {
  titleId: string
  name: string
  color: string
  unlockedAt: Date
  rarity: RarityTier
}

// Prestige info
export interface PrestigeInfo {
  prestigeLevel: number
  prestigedAt: Date
  bonusMultiplier: number
  prestigeTier: string // 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'
}
