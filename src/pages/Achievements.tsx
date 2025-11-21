import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import BadgeGallery from '../components/BadgeGallery';
import LevelShowcase from '../components/LevelShowcase';
import LevelProgressBar from '../components/LevelProgressBar';
import '../styles/AchievementsPage.css';
import {
  Trophy,
  Zap,
  TrendingUp,
  Users,
  Calendar,
  Target,
  Flame,
} from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { useFocus } from '../hooks/useFocus';

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

interface UserProgress {
  currentLevel: number;
  currentXP: number;
  totalXPEarned: number;
  badges: string[];
  currentStreak: number;
  longestStreak: number;
  perfectDays: number;
}

interface AchievementsPageProps {
  userProgress?: UserProgress;
  allBadges?: BadgeData[];
  allLevels?: LevelData[];
}

type TabType = 'overview' | 'levels' | 'badges' | 'leaderboard';

// Mock data for levels
const generateLevels = (): LevelData[] => {
  const levels: LevelData[] = [];
  const tiers = ['foundation', 'growth', 'mastery', 'expert', 'legend'] as const;
  
  for (let i = 1; i <= 100; i++) {
    let tier = tiers[0];
    if (i > 20 && i <= 40) tier = tiers[1];
    else if (i > 40 && i <= 60) tier = tiers[2];
    else if (i > 60 && i <= 80) tier = tiers[3];
    else if (i > 80) tier = tiers[4];

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

// Mock badge data
const generateBadges = (): BadgeData[] => {
  const categories = ['focus', 'wellness', 'skills', 'career', 'streaks', 'community', 'achievement', 'time', 'special'] as const;
  const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'] as const;
  const badges: BadgeData[] = [];

  for (let i = 1; i <= 100; i++) {
    const rarity = rarities[Math.min(Math.floor(i / 20), 5)] || 'common';
    const category = categories[i % categories.length];
    
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

const AchievementsPage: React.FC<AchievementsPageProps> = ({
  userProgress: propsUserProgress,
  allBadges: propsBadges,
  allLevels: propsLevels,
  onXPGain,
}) => {
  const { profile, levelInfo, badges: profileBadges } = useProfile();
  const { streak } = useFocus();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [expandedStats, setExpandedStats] = useState(false);

  // Use provided props or generate defaults
  const allLevels = propsLevels || generateLevels();
  const allBadges = propsBadges || generateBadges();
  
  const userProgress: UserProgress = propsUserProgress || {
    currentLevel: levelInfo?.currentLevel || 1,
    currentXP: levelInfo?.currentXP || 0,
    totalXPEarned: levelInfo?.totalXP || 0,
    badges: profileBadges || [],
    currentStreak: streak?.streak || 0,
    longestStreak: streak?.longestStreak || 0,
    perfectDays: 0,
  };

  const nextLevel = allLevels[userProgress.currentLevel] || allLevels[allLevels.length - 1];
  const prevLevelXP = userProgress.currentLevel === 1 ? 0 : allLevels[userProgress.currentLevel - 2]?.requiredXP || 0;
  const currentLevelXP = allLevels[userProgress.currentLevel - 1]?.requiredXP || 0;
  const xpTowardNextLevel = userProgress.currentXP - prevLevelXP;
  const xpNeededForNextLevel = currentLevelXP - prevLevelXP;
  const levelProgress = Math.round((xpTowardNextLevel / xpNeededForNextLevel) * 100);

  // Calculate stats
  const stats = useMemo(() => {
    const totalBadges = allBadges.length;
    const earnedBadges = userProgress.badges.length;
    const completionPercentage = Math.round((earnedBadges / totalBadges) * 100);

    const rarityStats = {
      common: allBadges.filter((b) => b.rarity === 'common' && userProgress.badges.includes(b.badgeId)).length,
      uncommon: allBadges.filter((b) => b.rarity === 'uncommon' && userProgress.badges.includes(b.badgeId)).length,
      rare: allBadges.filter((b) => b.rarity === 'rare' && userProgress.badges.includes(b.badgeId)).length,
      epic: allBadges.filter((b) => b.rarity === 'epic' && userProgress.badges.includes(b.badgeId)).length,
      legendary: allBadges.filter((b) => b.rarity === 'legendary' && userProgress.badges.includes(b.badgeId)).length,
      mythic: allBadges.filter((b) => b.rarity === 'mythic' && userProgress.badges.includes(b.badgeId)).length,
    };

    return {
      totalBadges,
      earnedBadges,
      completionPercentage,
      rarityStats,
    };
  }, [allBadges, userProgress.badges]);

  const leaderboardData = useMemo(() => {
    // Mock leaderboard data - in real app, this would come from API
    return [
      { rank: 1, username: 'EchoKnight', level: 42, xp: 524_000, badges: 87, streak: 156 },
      { rank: 2, username: 'SilentPhoenix', level: 39, xp: 421_000, badges: 78, streak: 98 },
      { rank: 3, username: 'VoidWalker', level: 37, xp: 395_000, badges: 72, streak: 87 },
      { rank: 4, username: 'LunaStorm', level: 35, xp: 342_000, badges: 65, streak: 64 },
      { rank: 5, username: 'IronWill', level: 33, xp: 298_000, badges: 58, streak: 52 },
    ];
  }, []);

  return (
    <div className="achievements-page">
      {/* Navigation Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-title-section">
            <Trophy className="header-icon" size={32} />
            <div>
              <h1 className="page-title">Achievements & Progression</h1>
              <p className="page-subtitle">Track your progress through 100 levels and 100 unique badges</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="quick-stats">
            <div className="quick-stat-item">
              <div className="stat-icon">
                <Zap size={20} />
              </div>
              <div className="stat-details">
                <span className="stat-label">Level</span>
                <span className="stat-display">{userProgress.currentLevel}</span>
              </div>
            </div>

            <div className="quick-stat-item">
              <div className="stat-icon">
                <Trophy size={20} />
              </div>
              <div className="stat-details">
                <span className="stat-label">Badges</span>
                <span className="stat-display">{stats.earnedBadges}/{stats.totalBadges}</span>
              </div>
            </div>

            <div className="quick-stat-item">
              <div className="stat-icon">
                <Flame size={20} />
              </div>
              <div className="stat-details">
                <span className="stat-label">Streak</span>
                <span className="stat-display">{userProgress.currentStreak}</span>
              </div>
            </div>

            <div className="quick-stat-item">
              <div className="stat-icon">
                <TrendingUp size={20} />
              </div>
              <div className="stat-details">
                <span className="stat-label">Total XP</span>
                <span className="stat-display">{Math.floor(userProgress.totalXPEarned / 1000)}K</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Level Progress Section */}
      <motion.div
        className="progress-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <LevelProgressBar userLevel={userProgress as any} nextLevelData={nextLevel} showDetails={true} />
      </motion.div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        {(['overview', 'levels', 'badges', 'leaderboard'] as const).map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'overview' && <Trophy size={18} />}
            {tab === 'levels' && <TrendingUp size={18} />}
            {tab === 'badges' && <Zap size={18} />}
            {tab === 'leaderboard' && <Users size={18} />}
            <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
          </button>
        ))}
      </div>

      {/* Content Areas */}
      <div className="page-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            className="tab-content overview-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-card-header">
                  <Target size={24} />
                  <h3>Current Level</h3>
                </div>
                <div className="stat-card-value">{userProgress.currentLevel}/100</div>
                <div className="stat-card-meta">
                  {levelProgress}% to next level
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-card-header">
                  <Trophy size={24} />
                  <h3>Badges Earned</h3>
                </div>
                <div className="stat-card-value">
                  {stats.earnedBadges}/{stats.totalBadges}
                </div>
                <div className="stat-card-meta">{stats.completionPercentage}% complete</div>
              </div>

              <div className="stat-card">
                <div className="stat-card-header">
                  <Flame size={24} />
                  <h3>Current Streak</h3>
                </div>
                <div className="stat-card-value">{userProgress.currentStreak}</div>
                <div className="stat-card-meta">days active</div>
              </div>

              <div className="stat-card">
                <div className="stat-card-header">
                  <TrendingUp size={24} />
                  <h3>Total XP</h3>
                </div>
                <div className="stat-card-value">
                  {Math.floor(userProgress.totalXPEarned / 1000000)}M
                </div>
                <div className="stat-card-meta">
                  {userProgress.totalXPEarned.toLocaleString()} total
                </div>
              </div>
            </div>

            {/* Rarity Distribution */}
            <div className="rarity-section">
              <h2 className="section-title">
                <Zap size={24} />
                Badge Rarity Distribution
              </h2>

              <div className="rarity-grid">
                <div className="rarity-item common">
                  <span className="rarity-label">Common</span>
                  <span className="rarity-count">
                    {stats.rarityStats.common}/{allBadges.filter((b) => b.rarity === 'common').length}
                  </span>
                </div>

                <div className="rarity-item uncommon">
                  <span className="rarity-label">Uncommon</span>
                  <span className="rarity-count">
                    {stats.rarityStats.uncommon}/
                    {allBadges.filter((b) => b.rarity === 'uncommon').length}
                  </span>
                </div>

                <div className="rarity-item rare">
                  <span className="rarity-label">Rare</span>
                  <span className="rarity-count">
                    {stats.rarityStats.rare}/{allBadges.filter((b) => b.rarity === 'rare').length}
                  </span>
                </div>

                <div className="rarity-item epic">
                  <span className="rarity-label">Epic</span>
                  <span className="rarity-count">
                    {stats.rarityStats.epic}/{allBadges.filter((b) => b.rarity === 'epic').length}
                  </span>
                </div>

                <div className="rarity-item legendary">
                  <span className="rarity-label">Legendary</span>
                  <span className="rarity-count">
                    {stats.rarityStats.legendary}/
                    {allBadges.filter((b) => b.rarity === 'legendary').length}
                  </span>
                </div>

                <div className="rarity-item mythic">
                  <span className="rarity-label">Mythic</span>
                  <span className="rarity-count">
                    {stats.rarityStats.mythic}/{allBadges.filter((b) => b.rarity === 'mythic').length}
                  </span>
                </div>
              </div>
            </div>

            {/* Achievements Section */}
            <div className="achievements-section">
              <h2 className="section-title">
                <Calendar size={24} />
                Recent Achievements
              </h2>

              <div className="achievements-list">
                {[
                  { title: 'Focus Master', description: 'Completed 50 focus sessions', date: '2 days ago' },
                  { title: 'Week Warrior', description: 'Maintained 7-day streak', date: '5 days ago' },
                  { title: 'Skill Builder', description: 'Completed 3 skill courses', date: '1 week ago' },
                ].map((achievement, idx) => (
                  <div key={idx} className="achievement-item">
                    <div className="achievement-icon">
                      <Trophy size={24} />
                    </div>
                    <div className="achievement-info">
                      <h4>{achievement.title}</h4>
                      <p>{achievement.description}</p>
                    </div>
                    <div className="achievement-date">{achievement.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Levels Tab */}
        {activeTab === 'levels' && (
          <motion.div
            className="tab-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LevelShowcase currentLevel={userProgress.currentLevel} allLevels={allLevels} />
          </motion.div>
        )}

        {/* Badges Tab */}
        {activeTab === 'badges' && (
          <motion.div
            className="tab-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BadgeGallery userBadges={userProgress.badges} allBadges={allBadges} />
          </motion.div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <motion.div
            className="tab-content leaderboard-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="leaderboard-header">
              <h2 className="section-title">
                <Users size={24} />
                Top Players
              </h2>
              <p className="section-subtitle">Global rankings by level and experience</p>
            </div>

            <div className="leaderboard-table">
              <div className="leaderboard-head">
                <div className="col rank">Rank</div>
                <div className="col name">Username</div>
                <div className="col level">Level</div>
                <div className="col xp">Total XP</div>
                <div className="col badges">Badges</div>
                <div className="col streak">Streak</div>
              </div>

              {leaderboardData.map((entry, idx) => (
                <motion.div
                  key={entry.rank}
                  className={`leaderboard-row ${idx === 0 ? 'rank-1' : idx === 1 ? 'rank-2' : idx === 2 ? 'rank-3' : ''}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="col rank">
                    <div className="rank-badge">#{entry.rank}</div>
                  </div>
                  <div className="col name">
                    <span className="username">{entry.username}</span>
                  </div>
                  <div className="col level">
                    <span className="level-value">{entry.level}</span>
                  </div>
                  <div className="col xp">
                    <span className="xp-value">{(entry.xp / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="col badges">
                    <span className="badges-value">{entry.badges}</span>
                  </div>
                  <div className="col streak">
                    <span className="streak-value">
                      <Flame size={14} /> {entry.streak}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AchievementsPage;
