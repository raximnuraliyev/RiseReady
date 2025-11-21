import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, TrendingUp, Zap } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface SimpleLevelModalProps {
  isOpen: boolean;
  onClose: () => void;
  level?: number;
  xp?: number;
}

const SimpleLevelModal: React.FC<SimpleLevelModalProps> = ({ isOpen, onClose, level = 1, xp = 0 }) => {
  const { isDark } = useTheme();
  
  const LEVEL_TITLES = [
    'Novice', 'Apprentice', 'Adept', 'Expert', 'Master',
    'Virtuoso', 'Legend', 'Mythic', 'Ascendant', 'Transcendent'
  ];

  const LEVEL_COLORS = [
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-purple-500 to-pink-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500',
    'from-pink-500 to-rose-500',
    'from-yellow-500 to-orange-500',
    'from-red-500 to-pink-500',
    'from-violet-500 to-purple-500',
    'from-cyan-500 to-blue-500'
  ];

  const currentTitle = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)] || 'Unknown';
  const nextTitle = LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length - 1)] || 'Legendary';
  const progress = Math.min((xp % 1000) / 10, 100);
  const colorGradient = LEVEL_COLORS[Math.min(level - 1, LEVEL_COLORS.length - 1)];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
            isDark ? 'bg-black/60' : 'bg-black/50'
          }`}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className={`rounded-2xl max-w-md w-full relative overflow-hidden shadow-2xl ${
              isDark ? 'bg-gray-900 border border-gray-800' : 'bg-white'
            }`}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {/* Animated background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${colorGradient} opacity-5`} />
            
            {/* Top accent line */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colorGradient}`} />

            {/* Close button */}
            <button
              onClick={onClose}
              className={`absolute right-5 top-5 p-2 rounded-lg transition-all ${
                isDark
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
              }`}
            >
              <X size={20} />
            </button>

            {/* Content */}
            <div className="relative z-10 p-8">
              {/* Level badge */}
              <div className="flex justify-center mb-6">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${colorGradient} flex items-center justify-center shadow-xl relative group`}
                >
                  {/* Inner glow */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colorGradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity`} />
                  <span className="text-5xl font-black text-white relative z-10">{level}</span>
                </motion.div>
              </div>

              {/* Title and subtitle */}
              <div className="text-center mb-8">
                <h2 className={`text-4xl font-black mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {currentTitle}
                </h2>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  You've reached a new milestone
                </p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <motion.div
                  whileHover={{ y: -2 }}
                  className={`p-4 rounded-xl ${
                    isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                    <span className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Total XP
                    </span>
                  </div>
                  <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {(xp / 1000).toFixed(1)}k
                  </span>
                </motion.div>

                <motion.div
                  whileHover={{ y: -2 }}
                  className={`p-4 rounded-xl ${
                    isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                    <span className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Next Goal
                    </span>
                  </div>
                  <span className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {nextTitle}
                  </span>
                </motion.div>
              </div>

              {/* Progress section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Progress to next level
                  </span>
                  <span className={`text-sm font-black ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className={`h-3 rounded-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full bg-gradient-to-r ${colorGradient} shadow-lg`}
                  />
                </div>
              </div>

              {/* Achievement message */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`p-4 rounded-lg mb-8 text-center ${
                  isDark
                    ? 'bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-700/50'
                    : 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200'
                }`}
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Star className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                  <span className={`font-bold ${isDark ? 'text-amber-300' : 'text-amber-900'}`}>
                    Keep it up!
                  </span>
                </div>
                <p className={`text-xs ${isDark ? 'text-amber-300/70' : 'text-amber-700'}`}>
                  You're making incredible progress. Keep grinding!
                </p>
              </motion.div>

              {/* Close button */}
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm transition-all uppercase tracking-wider ${
                  isDark
                    ? `bg-gradient-to-r ${colorGradient} text-white shadow-lg hover:shadow-xl`
                    : `bg-gradient-to-r ${colorGradient} text-white shadow-lg hover:shadow-xl`
                }`}
              >
                Awesome!
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SimpleLevelModal;
