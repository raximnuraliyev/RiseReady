import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/LevelShowcase.css';
import {
  Zap,
  Trophy,
  Flame,
  Star,
  Crown,
  TrendingUp,
  ChevronDown,
  Search,
} from 'lucide-react';

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

interface LevelShowcaseProps {
  currentLevel?: number;
  allLevels: LevelData[];
  onLevelClick?: (level: LevelData) => void;
}

const LevelShowcase: React.FC<LevelShowcaseProps> = ({
  currentLevel = 1,
  allLevels,
  onLevelClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [expandedLevel, setExpandedLevel] = useState<number | null>(currentLevel);
  const [showMilestonesOnly, setShowMilestonesOnly] = useState(false);

  const tiers = [
    { name: 'foundation', label: 'Foundation', color: '#3b82f6', range: '1-20' },
    { name: 'growth', label: 'Growth', color: '#10b981', range: '21-40' },
    { name: 'mastery', label: 'Mastery', color: '#8b5cf6', range: '41-60' },
    { name: 'expert', label: 'Expert', color: '#dc2626', range: '61-80' },
    { name: 'legend', label: 'Legend', color: '#f59e0b', range: '81-100' },
  ];

  // Filter levels
  const filteredLevels = useMemo(() => {
    return allLevels
      .filter((level) => {
        const matchesSearch =
          level.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          level.level.toString().includes(searchQuery);

        const matchesTier = !selectedTier || level.tier === selectedTier;
        const matchesMilestone = !showMilestonesOnly || level.isMilestone;

        return matchesSearch && matchesTier && matchesMilestone;
      })
      .sort((a, b) => a.level - b.level);
  }, [searchQuery, selectedTier, showMilestonesOnly, allLevels]);

  // Calculate stats
  const stats = useMemo(() => {
    const milestone = allLevels.filter((l) => l.isMilestone).length;
    const currentTier = allLevels.find((l) => l.level === currentLevel)?.tier || 'foundation';
    return { milestone, currentTier };
  }, [allLevels, currentLevel]);

  const getTierColor = (tier: string) => {
    const tierData = tiers.find((t) => t.name === tier);
    return tierData?.color || '#9ca3af';
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'foundation':
        return <Zap size={20} />;
      case 'growth':
        return <TrendingUp size={20} />;
      case 'mastery':
        return <Star size={20} />;
      case 'expert':
        return <Flame size={20} />;
      case 'legend':
        return <Crown size={20} />;
      default:
        return <Trophy size={20} />;
    }
  };

  const isCurrentLevel = (level: number) => level === currentLevel;
  const isAchieved = (level: number) => level <= currentLevel;
  const getProgressPercentage = (level: number) => {
    if (level <= currentLevel) return 100;
    const prevLevel = allLevels[level - 2];
    const currLevel = allLevels[level - 1];
    if (!prevLevel || !currLevel) return 0;
    return 0;
  };

  return (
    <div className="level-showcase">
      {/* Header */}
      <div className="showcase-header">
        <div className="header-top">
          <h1 className="showcase-title">
            <Trophy className="title-icon" />
            Level Progression
          </h1>
          <div className="header-stats">
            <div className="stat">
              <span className="stat-label">Current:</span>
              <span className="stat-value">Level {currentLevel}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Tier:</span>
              <span className="stat-value" style={{ color: getTierColor(stats.currentTier) }}>
                {stats.currentTier.charAt(0).toUpperCase() + stats.currentTier.slice(1)}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Milestones:</span>
              <span className="stat-value">{stats.milestone}</span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="search-container">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search levels by name or number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Filter Controls */}
        <div className="filter-section">
          <div className="filter-group">
            <label className="filter-label">Tier:</label>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${!selectedTier ? 'active' : ''}`}
                onClick={() => setSelectedTier(null)}
              >
                All Tiers
              </button>
              {tiers.map((tier) => (
                <button
                  key={tier.name}
                  className={`filter-btn tier-${tier.name} ${selectedTier === tier.name ? 'active' : ''}`}
                  onClick={() => setSelectedTier(tier.name)}
                  style={{ borderColor: tier.color }}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={showMilestonesOnly}
                onChange={(e) => setShowMilestonesOnly(e.target.checked)}
              />
              <span>Milestones Only</span>
            </label>
          </div>
        </div>

        {/* Tier Legend */}
        <div className="tier-legend">
          {tiers.map((tier) => (
            <div key={tier.name} className="legend-item">
              <div className="legend-color" style={{ background: tier.color }} />
              <span className="legend-label">
                {tier.label} ({tier.range})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="showcase-content">
        <motion.div className="levels-grid" layout>
          <AnimatePresence mode="popLayout">
            {filteredLevels.map((level, index) => {
              const isExpanded = expandedLevel === level.level;
              const isCurrent = isCurrentLevel(level.level);
              const isAchievedStatus = isAchieved(level.level);

              return (
                <motion.div
                  key={level.level}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.02 }}
                  className={`level-card tier-${level.tier} ${isExpanded ? 'expanded' : ''} ${
                    isCurrent ? 'current' : ''
                  } ${isAchievedStatus ? 'achieved' : 'locked'}`}
                  onClick={() => {
                    setExpandedLevel(isExpanded ? null : level.level);
                    onLevelClick?.(level);
                  }}
                >
                  {/* Level Badge */}
                  <div className="level-badge">
                    <div className="badge-number">{level.level}</div>
                    {level.isMilestone && <div className="milestone-marker">⭐</div>}
                    {isCurrent && <div className="current-indicator">✓</div>}
                  </div>

                  {/* Level Info */}
                  <div className="level-info">
                    <h3 className="level-title">{level.title}</h3>
                    <p className="level-subtitle">{level.subtitle}</p>

                    {/* Quick Stats */}
                    <div className="level-stats">
                      <div className="stat-item">
                        <Zap size={14} />
                        <span>{level.requiredXP.toLocaleString()} XP</span>
                      </div>
                      {isAchievedStatus && (
                        <div className="stat-item achieved">
                          <span>✓ Achieved</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expansion Arrow */}
                  <motion.div
                    className="expand-arrow"
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={20} />
                  </motion.div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="level-details"
                      >
                        <p className="details-description">{level.description}</p>

                        {/* Details Grid */}
                        <div className="details-grid">
                          <div className="detail-box">
                            <span className="detail-label">Tier</span>
                            <span className="detail-value" style={{ color: getTierColor(level.tier) }}>
                              {level.tier.toUpperCase()}
                            </span>
                          </div>

                          <div className="detail-box">
                            <span className="detail-label">Level</span>
                            <span className="detail-value">{level.level}/100</span>
                          </div>

                          <div className="detail-box">
                            <span className="detail-label">XP Required</span>
                            <span className="detail-value">
                              {level.requiredXP.toLocaleString()}
                            </span>
                          </div>

                          {level.totalXP && (
                            <div className="detail-box">
                              <span className="detail-label">Total XP</span>
                              <span className="detail-value">
                                {level.totalXP.toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Milestone Badge */}
                        {level.isMilestone && (
                          <div className="milestone-banner">
                            <Star size={18} />
                            <span>Milestone Level</span>
                          </div>
                        )}

                        {/* Progress Bar (if not achieved) */}
                        {!isAchievedStatus && (
                          <div className="progress-preview">
                            <div className="progress-label">Progress to this level</div>
                            <div className="progress-bar">
                              <div className="progress-fill" style={{ width: '0%' }} />
                            </div>
                            <div className="progress-text">0% - Keep climbing!</div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredLevels.length === 0 && (
          <div className="no-levels">
            <Trophy size={48} />
            <h3>No levels found</h3>
            <p>Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LevelShowcase;
