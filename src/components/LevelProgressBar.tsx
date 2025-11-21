import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Zap, TrendingUp, Award } from 'lucide-react'
import type { UserLevel, Level } from '../types/achievement'
import '../styles/LevelProgressBar.css'

interface LevelProgressBarProps {
  userLevel: UserLevel
  nextLevelData?: Level
  showDetails?: boolean
  compact?: boolean
}

const tierColors = {
  foundation: { color: '#3B82F6', hex: '#2563EB', name: 'Foundation' },
  growth: { color: '#10B981', hex: '#059669', name: 'Growth' },
  mastery: { color: '#8B5CF6', hex: '#7C3AED', name: 'Mastery' },
  expert: { color: '#DC2626', hex: '#B91C1C', name: 'Expert' },
  legend: { color: '#F59E0B', hex: '#D97706', name: 'Legend' }
}

const LevelProgressBar: React.FC<LevelProgressBarProps> = ({
  userLevel,
  nextLevelData,
  showDetails = true,
  compact = false
}) => {
  // Calculate XP needed for current level
  const baseXP = 100
  const multiplier = 1.15
  
  const xpForCurrentLevel = useMemo(() => {
    return Math.floor(baseXP * Math.pow(multiplier, userLevel.currentLevel - 1))
  }, [userLevel.currentLevel])

  const xpForNextLevel = useMemo(() => {
    return Math.floor(baseXP * Math.pow(multiplier, userLevel.currentLevel))
  }, [userLevel.currentLevel])

  // Calculate progress percentage
  const startXP = userLevel.currentLevel === 1 ? 0 : userLevel.totalXPEarned - xpForCurrentLevel
  const progressXP = userLevel.currentXP - startXP
  const progressPercentage = Math.min(100, Math.max(0, (progressXP / xpForNextLevel) * 100))

  // Determine tier color
  const tierData = nextLevelData ? tierColors[nextLevelData.tier] : tierColors['foundation']

  if (compact) {
    return (
      <div className="level-progress-compact">
        <div className="level-badge" style={{ backgroundColor: tierData.hex }}>
          <span className="level-number">{userLevel.currentLevel}</span>
        </div>
        
        <div className="progress-bar-wrapper">
          <div className="progress-bar-background">
            <motion.div
              className="progress-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.3 }}
              style={{ backgroundColor: tierData.color }}
            />
          </div>
          <span className="progress-text">{Math.floor(progressPercentage)}%</span>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="level-progress-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="level-header">
        <div className="level-info">
          <div className="level-badge-large" style={{ backgroundColor: tierData.hex }}>
            <span className="level-number-large">{userLevel.currentLevel}</span>
          </div>

          <div className="level-text-info">
            <h3 className="level-title">{nextLevelData?.title || 'Unknown'}</h3>
            <p className="level-subtitle">{nextLevelData?.subtitle || ''}</p>
            <p className="tier-name" style={{ color: tierData.color }}>
              {tierData.name} Tier
            </p>
          </div>
        </div>

        <div className="level-stats">
          <div className="stat-item">
            <Zap className="stat-icon" style={{ color: tierData.color }} />
            <div className="stat-text">
              <p className="stat-label">Total XP</p>
              <p className="stat-value">{userLevel.totalXPEarned.toLocaleString()}</p>
            </div>
          </div>

          {userLevel.streakData?.currentStreak > 0 && (
            <div className="stat-item">
              <TrendingUp className="stat-icon" style={{ color: '#EF4444' }} />
              <div className="stat-text">
                <p className="stat-label">Current Streak</p>
                <p className="stat-value">{userLevel.streakData.currentStreak}d</p>
              </div>
            </div>
          )}

          <div className="stat-item">
            <Award className="stat-icon" style={{ color: '#F59E0B' }} />
            <div className="stat-text">
              <p className="stat-label">Badges</p>
              <p className="stat-value">{userLevel.badges.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-info">
          <span className="progress-label">Progress to Level {userLevel.currentLevel + 1}</span>
          <span className="progress-percentage">{Math.floor(progressPercentage)}%</span>
        </div>

        <div className="progress-bar-wrapper-large">
          <div className="progress-bar-background-large">
            <motion.div
              className="progress-bar-fill-large"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{ 
                backgroundColor: tierData.color,
                boxShadow: `0 0 20px ${tierData.color}40`
              }}
            >
              <div className="progress-shimmer" />
            </motion.div>
          </div>

          <div className="xp-info">
            <p className="xp-text">
              <span className="current-xp">{Math.floor(progressXP).toLocaleString()}</span>
              <span className="divider">/</span>
              <span className="required-xp">{xpForNextLevel.toLocaleString()}</span>
              <span className="xp-label">XP</span>
            </p>
          </div>
        </div>
      </div>

      {showDetails && nextLevelData && (
        <div className="level-details">
          {nextLevelData.description && (
            <p className="level-description">{nextLevelData.description}</p>
          )}

          {nextLevelData.rewards && (
            <div className="rewards-preview">
              <h4 className="rewards-title">Next Level Rewards</h4>
              
              {nextLevelData.rewards.badges && nextLevelData.rewards.badges.length > 0 && (
                <div className="reward-item">
                  <Award className="reward-icon" />
                  <span>{nextLevelData.rewards.badges.length} Badge(s)</span>
                </div>
              )}

              {nextLevelData.rewards.title && (
                <div className="reward-item">
                  <span className="reward-icon-text">👑</span>
                  <span>Title: "{nextLevelData.rewards.title}"</span>
                </div>
              )}

              {nextLevelData.rewards.perks && nextLevelData.rewards.perks.length > 0 && (
                <div className="reward-item">
                  <Zap className="reward-icon" />
                  <span>{nextLevelData.rewards.perks.length} Perk(s)</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Prestige Info */}
      {userLevel.currentLevel === 100 && (
        <div className="prestige-banner">
          <span className="prestige-icon">✨</span>
          <div>
            <p className="prestige-title">Ready for Prestige!</p>
            <p className="prestige-text">You've reached the maximum level. Reset to Prestige {userLevel.prestigeLevel + 1}!</p>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default LevelProgressBar
