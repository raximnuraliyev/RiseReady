import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BadgeGallery from '../components/BadgeGallery';
import LevelShowcase from '../components/LevelShowcase';
import '../styles/AchievementsPage.css';
import { useAchievements } from '../hooks/useAchievements';
import { useUserLevel } from '../hooks/useUserLevel';
import useAuth from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import {
  Trophy,
  Zap,
  Flame,
  Award,
} from 'lucide-react';

interface BadgeData {
  badgeId: string;
  name: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
  category:
    | 'focus'
    | 'wellness'
    | 'skills'
    | 'career'
    | 'streaks'
    | 'community'
    | 'achievement'
    | 'time'
    | 'special';
  unlockCondition: {
    type: string;
    target: number;
    description: string;
  };
  cosmetics: {
    borderColor: string;
    glowEffect: string;
    particleEffect: string;
  };
  isHidden: boolean;
}

interface LevelData {
  level: number;
  title: string;
  subtitle: string;
  description: string;
  tier: 'foundation' | 'growth' | 'mastery' | 'expert' | 'legend';
  requiredXP: number;
  totalXP?: number;
  isMilestone: boolean;
}

type TabType = 'overview' | 'levels' | 'badges' | 'leaderboard';

// Generate mock levels
const generateLevels = (): LevelData[] => {
  const levels: LevelData[] = [];
  const tierArray: Array<'foundation' | 'growth' | 'mastery' | 'expert' | 'legend'> = ['foundation', 'growth', 'mastery', 'expert', 'legend'];

  for (let i = 1; i <= 100; i++) {
    let tierIndex = 0;
    if (i > 20) tierIndex = 1;
    if (i > 40) tierIndex = 2;
    if (i > 60) tierIndex = 3;
    if (i > 80) tierIndex = 4;

    const tier = tierArray[tierIndex];
    const xpRequired = Math.round(100 * Math.pow(i, 1.5));

    levels.push({
      level: i,
      title: `Level ${i}`,
      subtitle: tier.charAt(0).toUpperCase() + tier.slice(1),
      description: `Reach level ${i} to unlock new features`,
      tier,
      requiredXP: xpRequired,
      totalXP: xpRequired,
      isMilestone: i % 10 === 0,
    });
  }

  return levels;
};

// Generate mock badges
const generateBadges = (): BadgeData[] => {
  const categories = ['focus', 'wellness', 'skills', 'career', 'streaks', 'community', 'achievement', 'time', 'special'] as const;
  const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'] as const;
  const badges: BadgeData[] = [];

  for (let i = 1; i <= 100; i++) {
    const rarityIndex = Math.min(Math.floor((i - 1) / 20), 5);
    const rarity = rarities[rarityIndex];
    const category = categories[(i - 1) % categories.length];

    badges.push({
      badgeId: `badge_${i}`,
      name: `Badge ${i}`,
      description: `Achievement badge ${i}`,
      rarity,
      category,
      unlockCondition: {
        type: 'numeric',
        target: i * 10,
        description: `Earn ${i * 10} XP`,
      },
      cosmetics: {
        borderColor: 'gold',
        glowEffect: 'gold-glow',
        particleEffect: 'sparkle',
      },
      isHidden: i % 20 === 0,
    });
  }

  return badges;
};

const AchievementsPage: React.FC = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { level, points, progressToNextLevel, loading: levelLoading } = useUserLevel();
  const { progress, loading: achievementsLoading } = useAchievements(user?.id || '');
  
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(achievementsLoading || levelLoading);
    }, 500);
    return () => clearTimeout(timer);
  }, [achievementsLoading, levelLoading]);

  const allLevels = generateLevels();
  const allBadges = generateBadges();

  // Use real data from hooks or fallback to defaults
  const currentLevel = level || 1;
  const currentXP = points || 0;
  const totalXPEarned = progress?.totalXPEarned || currentXP;
  const badgeIds = progress?.badges || [];
  const currentStreak = progress?.currentStreak || 0;
  const longestStreak = progress?.longestStreak || 0;

  const prevLevelXP = currentLevel > 1 ? allLevels[currentLevel - 2]?.requiredXP || 0 : 0;
  const currentLevelXP = allLevels[currentLevel - 1]?.requiredXP || 1000;
  const xpTowardNextLevel = currentXP - prevLevelXP;
  const xpNeededForNextLevel = currentLevelXP - prevLevelXP;
  const levelProgress = progressToNextLevel || (xpNeededForNextLevel > 0 ? Math.round((xpTowardNextLevel / xpNeededForNextLevel) * 100) : 0);

  const userBadgeIds = (badgeIds as (string | number)[]).map((idx) => {
    const badgeIdx = typeof idx === 'string' ? parseInt(idx, 10) : idx;
    return allBadges[badgeIdx]?.badgeId || `badge_${badgeIdx}`;
  });
  const rarityStats = allBadges.reduce((acc, badge) => {
    acc[badge.rarity] = (acc[badge.rarity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (isLoading && achievementsLoading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
          <Trophy className={`w-12 h-12 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-gray-50'} transition-colors duration-300`}>
      {/* Header */}
      <motion.div
        className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-600 to-blue-700'} text-white py-12 px-4 md:px-8`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-start gap-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Achievements & Progression</h1>
              <p className="text-lg text-opacity-90 opacity-90">Unlock badges, level up, and show off your achievements!</p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <motion.div 
              className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/10 border border-white/30'} backdrop-blur-sm`}
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-5 h-5" />
                <span className="text-sm font-medium opacity-90">Level</span>
              </div>
              <div className="text-3xl font-bold">{currentLevel}</div>
            </motion.div>

            <motion.div 
              className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/10 border border-white/30'} backdrop-blur-sm`}
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-5 h-5" />
                <span className="text-sm font-medium opacity-90">Total XP</span>
              </div>
              <div className="text-3xl font-bold">{(totalXPEarned / 1000).toFixed(1)}k</div>
            </motion.div>

            <motion.div 
              className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/10 border border-white/30'} backdrop-blur-sm`}
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Flame className="w-5 h-5" />
                <span className="text-sm font-medium opacity-90">Current Streak</span>
              </div>
              <div className="text-3xl font-bold">{currentStreak}d</div>
            </motion.div>

            <motion.div 
              className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/10 border border-white/30'} backdrop-blur-sm`}
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-5 h-5" />
                <span className="text-sm font-medium opacity-90">Badges</span>
              </div>
              <div className="text-3xl font-bold">{badgeIds.length}</div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {/* Progress Bar */}
        <motion.div 
          className={`${isDark ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'} rounded-xl p-6 mb-8`}
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Level {currentLevel} → {currentLevel + 1}</span>
            <span className={`font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{levelProgress}%</span>
          </div>
          <div className={`h-4 rounded-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg"
              style={{ width: `${levelProgress}%` }} 
              transition={{ duration: 0.5 }} 
            />
          </div>
          <div className={`text-sm mt-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {xpTowardNextLevel} / {xpNeededForNextLevel} XP
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div 
          className={`flex gap-2 mb-8 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.3 }}
        >
          {(['overview', 'levels', 'badges', 'leaderboard'] as TabType[]).map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium transition-all border-b-2 ${
                activeTab === tab
                  ? isDark
                    ? 'border-blue-400 text-blue-400'
                    : 'border-blue-600 text-blue-600'
                  : isDark
                  ? 'border-transparent text-gray-400 hover:text-gray-300'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Tab Content */}
      <div className={`max-w-6xl mx-auto px-4 md:px-8 py-12`}>
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Stats Grid - moved to header, but showing here too for reference */}
            <div className={`rounded-lg p-6 ${isDark ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
              <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Progress Overview
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}
                >
                  <Trophy className={`w-6 h-6 mb-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Current Level</p>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{currentLevel}</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}
                >
                  <Zap className={`w-6 h-6 mb-2 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total XP</p>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{totalXPEarned}</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}
                >
                  <Flame className={`w-6 h-6 mb-2 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Current Streak</p>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{currentStreak}</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}
                >
                  <Award className={`w-6 h-6 mb-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Longest Streak</p>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{longestStreak}</p>
                </motion.div>
              </div>

              {/* Rarity Distribution */}
              <div className="mt-8 border-t pt-8">
                <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Badge Rarity Distribution
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  {Object.entries(rarityStats).map(([rarity, count]) => (
                    <motion.div
                      key={rarity}
                      whileHover={{ scale: 1.05 }}
                      className={`p-3 rounded-lg text-center ${
                        isDark ? 'bg-gray-800' : 'bg-gray-100'
                      }`}
                    >
                      <p className={`text-sm font-semibold mb-2 ${
                        rarity === 'common' ? isDark ? 'text-gray-400' : 'text-gray-600' :
                        rarity === 'uncommon' ? isDark ? 'text-green-400' : 'text-green-600' :
                        rarity === 'rare' ? isDark ? 'text-blue-400' : 'text-blue-600' :
                        rarity === 'epic' ? isDark ? 'text-purple-400' : 'text-purple-600' :
                        rarity === 'legendary' ? isDark ? 'text-yellow-400' : 'text-yellow-600' :
                        isDark ? 'text-red-400' : 'text-red-600'
                      }`}>
                        {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                      </p>
                      <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {count}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'levels' && (
          <motion.div
            key="levels"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.2 }}
          >
            <LevelShowcase currentLevel={currentLevel} allLevels={allLevels} onLevelClick={() => {}} />
          </motion.div>
        )}

        {activeTab === 'badges' && (
          <motion.div
            key="badges"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.2 }}
          >
            <BadgeGallery userBadges={userBadgeIds} allBadges={allBadges} onBadgeClick={() => {}} />
          </motion.div>
        )}

        {activeTab === 'leaderboard' && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.2 }}
          >
            <div className={`rounded-lg overflow-hidden ${isDark ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
              <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-100'} px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Leaderboard
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`${isDark ? 'bg-gray-800' : 'bg-gray-50'} border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Rank</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Player</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Level</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>XP</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Badges</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Streak</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <motion.tr
                        key={i}
                        whileHover={{ backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)' }}
                        className={`border-b ${isDark ? 'border-gray-800' : 'border-gray-100'} transition-colors`}
                      >
                        <td className={`px-6 py-4 font-semibold ${i === 0 ? isDark ? 'text-yellow-400' : 'text-yellow-600' : isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          #{i + 1}
                        </td>
                        <td className={`px-6 py-4 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>Player {i + 1}</td>
                        <td className={`px-6 py-4 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{100 - i * 5}</td>
                        <td className={`px-6 py-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{(100 - i * 5) * 1000}</td>
                        <td className={`px-6 py-4 font-semibold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>{100 - i * 3}</td>
                        <td className={`px-6 py-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{50 - i * 2}d</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AchievementsPage;