import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/BadgeGallery.css';
import {
  Sparkles,
  Trophy,
  Zap,
  Heart,
  BookOpen,
  Briefcase,
  Flame,
  Users,
  Star,
  Lock,
  Filter,
  Search,
  BarChart3,
} from 'lucide-react';

// Badge icon mapping
const badgeIconMap: Record<string, React.ReactNode> = {
  // Focus badges
  focus_master: <Zap className="badge-icon" />,
  deep_work: <Trophy className="badge-icon" />,
  focus_streak_7: <Flame className="badge-icon" />,
  focus_veteran: <Star className="badge-icon" />,
  productive_day: <BarChart3 className="badge-icon" />,
  focus_legend: <Sparkles className="badge-icon" />,
  morning_person: <Zap className="badge-icon" />,
  night_owl: <Star className="badge-icon" />,
  consistent_worker: <Flame className="badge-icon" />,
  marathon_session: <Trophy className="badge-icon" />,
  focus_novice: <Zap className="badge-icon" />,
  focus_addict: <Sparkles className="badge-icon" />,

  // Wellness badges
  wellness_warrior: <Heart className="badge-icon" />,
  meditation_master: <Sparkles className="badge-icon" />,
  hydration_hero: <Trophy className="badge-icon" />,
  fitness_fanatic: <Flame className="badge-icon" />,
  sleep_champion: <Star className="badge-icon" />,
  wellness_legend: <Sparkles className="badge-icon" />,
  mental_health_champion: <Heart className="badge-icon" />,
  nutrition_smart: <BarChart3 className="badge-icon" />,
  balanced_lifestyle: <Trophy className="badge-icon" />,
  recovery_expert: <Heart className="badge-icon" />,
  wellness_starter: <Zap className="badge-icon" />,
  stress_buster: <Flame className="badge-icon" />,

  // Skills badges
  skill_builder: <BookOpen className="badge-icon" />,
  course_completer: <Trophy className="badge-icon" />,
  reading_champion: <BookOpen className="badge-icon" />,
  language_learner: <Sparkles className="badge-icon" />,
  master_craftsman: <Star className="badge-icon" />,
  knowledge_hub: <BookOpen className="badge-icon" />,
  expert_certification: <Trophy className="badge-icon" />,
  continuous_learner: <BookOpen className="badge-icon" />,
  creative_genius: <Sparkles className="badge-icon" />,
  teaching_guru: <Users className="badge-icon" />,
  skill_novice: <BookOpen className="badge-icon" />,
  polymath: <Star className="badge-icon" />,

  // Career badges
  task_completer: <Trophy className="badge-icon" />,
  project_master: <Briefcase className="badge-icon" />,
  deadline_hero: <Zap className="badge-icon" />,
  productivity_champion: <BarChart3 className="badge-icon" />,
  goal_setter: <Trophy className="badge-icon" />,
  goal_achiever: <Trophy className="badge-icon" />,
  ambitious_dreamer: <Sparkles className="badge-icon" />,
  work_life_balance: <Heart className="badge-icon" />,
  career_legend: <Star className="badge-icon" />,
  milestone_breaker: <Flame className="badge-icon" />,
  task_master: <Trophy className="badge-icon" />,
  organizer: <Briefcase className="badge-icon" />,

  // Streak badges
  streak_master: <Flame className="badge-icon" />,
  unstoppable: <Sparkles className="badge-icon" />,
  relentless: <Flame className="badge-icon" />,
  immortal_streak: <Star className="badge-icon" />,
  multi_streaker: <Flame className="badge-icon" />,
  comeback_king: <Trophy className="badge-icon" />,
  flame_keeper: <Flame className="badge-icon" />,
  streak_legend: <Sparkles className="badge-icon" />,
  determination: <Zap className="badge-icon" />,
  consistency_king: <Flame className="badge-icon" />,
  first_streak: <Zap className="badge-icon" />,
  month_warrior: <Flame className="badge-icon" />,
  dedication: <Heart className="badge-icon" />,

  // Community badges
  community_helper: <Users className="badge-icon" />,
  mentor: <Trophy className="badge-icon" />,
  social_butterfly: <Users className="badge-icon" />,
  leader: <Star className="badge-icon" />,
  team_player: <Users className="badge-icon" />,
  influencer: <Sparkles className="badge-icon" />,
  generous_soul: <Heart className="badge-icon" />,
  champion: <Trophy className="badge-icon" />,
  global_citizen: <Users className="badge-icon" />,
  legacy_builder: <Star className="badge-icon" />,
  friend_maker: <Users className="badge-icon" />,
  good_samaritan: <Heart className="badge-icon" />,
  advocate: <Sparkles className="badge-icon" />,

  // Achievement badges
  level_5: <Trophy className="badge-icon" />,
  level_10: <Trophy className="badge-icon" />,
  level_20: <Trophy className="badge-icon" />,
  level_40: <Star className="badge-icon" />,
  level_60: <Star className="badge-icon" />,
  level_80: <Sparkles className="badge-icon" />,
  level_100: <Sparkles className="badge-icon" />,
  perfect_week: <Flame className="badge-icon" />,
  perfect_month: <Flame className="badge-icon" />,
  perfect_year: <Star className="badge-icon" />,
  collector: <Trophy className="badge-icon" />,
  badge_master: <Star className="badge-icon" />,
  badge_legend: <Sparkles className="badge-icon" />,

  // Time badges
  early_bird: <Zap className="badge-icon" />,
  midnight_runner: <Star className="badge-icon" />,
  warrior247: <Flame className="badge-icon" />,
  time_master: <Trophy className="badge-icon" />,
  weekend_warrior: <Zap className="badge-icon" />,
  weekday_warrior: <Briefcase className="badge-icon" />,
  time_traveler: <Sparkles className="badge-icon" />,
  veteran: <Star className="badge-icon" />,
  eternal_student: <BookOpen className="badge-icon" />,
  monthly_master: <Trophy className="badge-icon" />,
  day_one: <Zap className="badge-icon" />,
  weekly_warrior: <Flame className="badge-icon" />,
  prestige: <Sparkles className="badge-icon" />,
};

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

interface BadgeGalleryProps {
  userBadges?: string[];
  allBadges: BadgeData[];
  onBadgeClick?: (badge: BadgeData) => void;
}

// Define outside component to avoid re-rendering
const BADGE_RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'] as const;
const BADGE_CATEGORIES = [
  'focus',
  'wellness',
  'skills',
  'career',
  'streaks',
  'community',
  'achievement',
  'time',
  'special',
] as const;

const BadgeGallery: React.FC<BadgeGalleryProps> = ({
  userBadges = [],
  allBadges,
  onBadgeClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'earned' | 'locked'>('all');
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);
  const [expandedBadge, setExpandedBadge] = useState<string | null>(null);

  // Filtering logic
  const filteredBadges = useMemo(() => {
    return allBadges.filter((badge) => {
      const matchesSearch =
        badge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        badge.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRarity = !selectedRarity || badge.rarity === selectedRarity;
      const matchesCategory = !selectedCategory || badge.category === selectedCategory;

      const isEarned = userBadges.includes(badge.badgeId);
      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'earned' && isEarned) ||
        (selectedStatus === 'locked' && !isEarned);

      return matchesSearch && matchesRarity && matchesCategory && matchesStatus;
    });
  }, [searchQuery, selectedRarity, selectedCategory, selectedStatus, allBadges, userBadges]);

  // Category stats
  const categoryStats = useMemo(() => {
    return BADGE_CATEGORIES.map((cat) => {
      const catBadges = allBadges.filter((b) => b.category === cat);
      const earned = catBadges.filter((b) => userBadges.includes(b.badgeId)).length;
      return { category: cat, earned, total: catBadges.length, percentage: Math.round((earned / catBadges.length) * 100) };
    });
  }, [allBadges, userBadges]);

  // Rarity stats
  const rarityStats = useMemo(() => {
    return BADGE_RARITIES.map((rarity) => {
      const rarityBadges = allBadges.filter((b) => b.rarity === rarity);
      const earned = rarityBadges.filter((b) => userBadges.includes(b.badgeId)).length;
      return { rarity, earned, total: rarityBadges.length };
    });
  }, [allBadges, userBadges]);

  const totalEarned = userBadges.length;
  const totalBadges = allBadges.length;
  const completionPercentage = Math.round((totalEarned / totalBadges) * 100);

  return (
    <div className="badge-gallery">
      {/* Header */}
      <div className="gallery-header">
        <div className="header-top">
          <h1 className="gallery-title">
            <Trophy className="title-icon" />
            Badge Collection
          </h1>
          <div className="completion-stats">
            <div className="stat-item">
              <span className="stat-label">Collected:</span>
              <span className="stat-value">
                {totalEarned} / {totalBadges}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Completion:</span>
              <span className="stat-value">{completionPercentage}%</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search badges by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Filter Controls */}
        <div className="filter-section">
          <div className="filter-group">
            <label className="filter-label">
              <Filter size={16} />
              Status:
            </label>
            <div className="filter-buttons">
              {(['all', 'earned', 'locked'] as const).map((status) => (
                <button
                  key={status}
                  className={`filter-btn ${selectedStatus === status ? 'active' : ''}`}
                  onClick={() => setSelectedStatus(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Rarity:</label>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${!selectedRarity ? 'active' : ''}`}
                onClick={() => setSelectedRarity(null)}
              >
                All
              </button>
              {BADGE_RARITIES.map((rarity) => (
                <button
                  key={rarity}
                  className={`filter-btn rarity-${rarity} ${selectedRarity === rarity ? 'active' : ''}`}
                  onClick={() => setSelectedRarity(rarity)}
                >
                  {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Category:</label>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${!selectedCategory ? 'active' : ''}`}
                onClick={() => setSelectedCategory(null)}
              >
                All
              </button>
              {BADGE_CATEGORIES.map((category) => (
                <button
                  key={category}
                  className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="gallery-content">
        {/* Left Sidebar - Stats */}
        <div className="gallery-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">By Category</h3>
            <div className="category-stats">
              {categoryStats.map((stat) => (
                <div key={stat.category} className="stat-bar">
                  <div className="stat-header">
                    <span className="category-name">
                      {stat.category.charAt(0).toUpperCase() + stat.category.slice(1)}
                    </span>
                    <span className="stat-count">
                      {stat.earned}/{stat.total}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                  <span className="stat-percentage">{stat.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">By Rarity</h3>
            <div className="rarity-stats">
              {rarityStats.map((stat) => (
                <div key={stat.rarity} className={`rarity-bar rarity-${stat.rarity}`}>
                  <span className="rarity-label">
                    {stat.rarity.charAt(0).toUpperCase() + stat.rarity.slice(1)}
                  </span>
                  <span className="rarity-count">
                    {stat.earned}/{stat.total}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Gallery Grid */}
        <div className="gallery-main">
          {filteredBadges.length > 0 ? (
            <motion.div className="badge-grid" layout>
              <AnimatePresence mode="popLayout">
                {filteredBadges.map((badge, index) => {
                  const isEarned = userBadges.includes(badge.badgeId);
                  const isHovered = hoveredBadge === badge.badgeId;
                  const isExpanded = expandedBadge === badge.badgeId;

                  return (
                    <motion.div
                      key={badge.badgeId}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: index * 0.02 }}
                      className={`badge-card rarity-${badge.rarity} ${isEarned ? 'earned' : 'locked'} ${
                        isExpanded ? 'expanded' : ''
                      }`}
                      onMouseEnter={() => setHoveredBadge(badge.badgeId)}
                      onMouseLeave={() => setHoveredBadge(null)}
                      onClick={() => {
                        setExpandedBadge(isExpanded ? null : badge.badgeId);
                        onBadgeClick?.(badge);
                      }}
                    >
                      {/* Badge Visual */}
                      <div className="badge-visual">
                        {!isEarned && (
                          <div className="lock-overlay">
                            <Lock size={24} />
                          </div>
                        )}
                        <div className={`badge-icon-wrapper`}>
                          {badgeIconMap[badge.badgeId as keyof typeof badgeIconMap] ||
                            <Star className="badge-icon" />}
                        </div>
                      </div>

                      {/* Badge Info */}
                      <div className="badge-info">
                        <h3 className="badge-name">{badge.name}</h3>
                        <p className="badge-description">{badge.description}</p>

                        {/* Unlock Condition - Show on Hover or Expanded */}
                        {(isHovered || isExpanded) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="unlock-condition"
                          >
                            <div className="condition-label">
                              <Lock size={14} />
                              Unlock Condition:
                            </div>
                            <p className="condition-text">{badge.unlockCondition.description}</p>
                          </motion.div>
                        )}

                        {/* Rarity & Status */}
                        <div className="badge-footer">
                          <span className={`badge-rarity rarity-${badge.rarity}`}>
                            {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                          </span>
                          <span className="badge-status">
                            {isEarned ? '✓ Earned' : 'Locked'}
                          </span>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="badge-details"
                        >
                          <div className="detail-item">
                            <span className="detail-label">Category:</span>
                            <span className="detail-value">
                              {badge.category.charAt(0).toUpperCase() + badge.category.slice(1)}
                            </span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Rarity:</span>
                            <span className={`detail-value rarity-${badge.rarity}`}>
                              {badge.rarity.toUpperCase()}
                            </span>
                          </div>
                          {badge.isHidden && (
                            <div className="detail-item hidden-badge">
                              <Sparkles size={14} />
                              <span>Hidden Badge</span>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="no-badges">
              <Lock size={48} />
              <h3>No badges found</h3>
              <p>Try adjusting your filters to find badges</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BadgeGallery;
