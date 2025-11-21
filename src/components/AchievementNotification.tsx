import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Award, Star, Trophy, Crown, Flame, Sparkles } from 'lucide-react'
import '../styles/AchievementNotification.css'
import type { BadgeUnlockResponse, AchievementUnlockResponse } from '../types/achievement'

interface NotificationProps {
  type: 'level-up' | 'badge-unlock' | 'achievement-unlock'
  data: any
  onDismiss: () => void
}

const rarityColors = {
  common: '#6B7280',
  uncommon: '#10B981',
  rare: '#3B82F6',
  epic: '#8B5CF6',
  legendary: '#F59E0B',
  mythic: '#EC4899'
}

const rarityGradients = {
  common: 'from-gray-500 to-gray-700',
  uncommon: 'from-green-400 to-green-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-yellow-600',
  mythic: 'from-pink-400 to-pink-600'
}

const AchievementNotification: React.FC<NotificationProps> = ({ type, data, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Trigger confetti on level up or special badges
    if (type === 'level-up' || (type === 'badge-unlock' && data.rarity === 'legendary')) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }

    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onDismiss, 300)
    }, 5000)

    return () => clearTimeout(timer)
  }, [type, data, onDismiss])

  const renderLevelUp = () => (
    <div className="achievement-content level-up-content">
      <motion.div
        className="achievement-icon-wrapper"
        animate={{ scale: [1, 1.1, 1], rotate: [0, 360] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      >
        <Trophy className="w-16 h-16 text-yellow-400" />
      </motion.div>
      
      <div className="achievement-text">
        <h3 className="achievement-title">🎉 LEVEL UP!</h3>
        <p className="achievement-level">Level {data.newLevel}</p>
        <p className="achievement-title-text">"{data.levelTitle}"</p>
        <p className="achievement-subtitle text-gray-300">{data.levelSubtitle}</p>
      </div>

      {data.rewards && (
        <div className="achievement-rewards">
          {data.rewards.badges && data.rewards.badges.length > 0 && (
            <motion.div 
              className="reward-item"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Star className="w-5 h-5 text-yellow-400" />
              <span>Badges Unlocked</span>
            </motion.div>
          )}
          {data.rewards.perks && data.rewards.perks.length > 0 && (
            <motion.div 
              className="reward-item"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span>Perks Unlocked</span>
            </motion.div>
          )}
        </div>
      )}
    </div>
  )

  const renderBadgeUnlock = () => (
    <div className={`achievement-content badge-unlock-content bg-gradient-to-r ${rarityGradients[data.rarity]}`}>
      <motion.div
        className="achievement-icon-wrapper"
        animate={{ scale: [1, 1.15, 1], rotate: [0, -10, 10, 0] }}
        transition={{ duration: 0.6, repeat: Infinity }}
      >
        <Award className="w-16 h-16 text-white" />
      </motion.div>

      <div className="achievement-text">
        <p className="achievement-label">Badge Unlocked</p>
        <h3 className="achievement-name">{data.name}</h3>
        <p className="achievement-rarity" style={{ color: rarityColors[data.rarity] }}>
          ★ {data.rarity.toUpperCase()} ★
        </p>
        <p className="achievement-description text-sm mt-2">{data.description}</p>
      </div>

      <motion.div
        className="badge-rarity-indicator"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <Flame className="w-6 h-6" style={{ color: rarityColors[data.rarity] }} />
      </motion.div>
    </div>
  )

  const renderAchievementUnlock = () => (
    <div className="achievement-content achievement-unlock-content">
      <motion.div
        className="achievement-icon-wrapper"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.7, repeat: Infinity }}
      >
        <Crown className="w-16 h-16 text-amber-400" />
      </motion.div>

      <div className="achievement-text">
        <p className="achievement-label">Achievement Unlocked</p>
        <h3 className="achievement-name">{data.name}</h3>
        <p className="achievement-description">{data.description}</p>
      </div>

      {data.reward && (
        <motion.div
          className="achievement-reward-badge"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="reward-text">
            {data.reward.xp && `+${data.reward.xp} XP`}
            {data.reward.badge && ` • Badge`}
          </p>
        </motion.div>
      )}
    </div>
  )

  const content = 
    type === 'level-up' ? renderLevelUp() :
    type === 'badge-unlock' ? renderBadgeUnlock() :
    renderAchievementUnlock()

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="achievement-notification-container"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="achievement-notification"
            layoutId={`notification-${type}`}
            onClick={() => {
              setIsVisible(false)
              setTimeout(onDismiss, 300)
            }}
          >
            {content}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AchievementNotification
