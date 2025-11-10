import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserLevel } from '../../hooks/useUserLevel';
import { Star, Award, Sparkles, X } from 'lucide-react';

const LEVEL_REWARDS = [
  { level: 1, title: "Beginner", xp: 100, reward: "Focus Timer Unlocked" },
  { level: 2, title: "Focused", xp: 200, reward: "Pomodoro Timer" },
  { level: 3, title: "Dedicated", xp: 300, reward: "Extended Focus Sessions" },
  { level: 4, title: "Scholar", xp: 400, reward: "Advanced Statistics" },
  { level: 5, title: "Expert", xp: 500, reward: "Custom Study Plans" },
  { level: 6, title: "Master", xp: 600, reward: "Mentor Access" },
  { level: 7, title: "Elite", xp: 700, reward: "Premium Resources" },
  { level: 8, title: "Champion", xp: 800, reward: "Virtual Study Groups" },
  { level: 9, title: "Legend", xp: 900, reward: "Personalized AI Tutor" },
  { level: 10, title: "Virtuoso", xp: 1000, reward: "Knowledge Master Badge" },
];

interface LevelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LevelModal: React.FC<LevelModalProps> = ({ isOpen, onClose }) => {
  const { level, points, nextLevelPoints, progressToNextLevel } = useUserLevel();

  const currentTitle = LEVEL_REWARDS.find(l => l.level === level)?.title || 'Unknown';
  const nextTitle = LEVEL_REWARDS.find(l => l.level === level + 1)?.title || 'Max Level';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 max-w-lg w-full relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            {/* Current Level */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FFD700]/20 to-[#FFA500]/20 rounded-full border-2 border-[#FFD700]/30 mb-4">
                <Award className="w-5 h-5 text-[#FFA500]" />
                <span className="font-semibold text-[#1F4E79]">Level {level}</span>
              </div>
              <h3 className="text-2xl font-bold text-[#1F4E79] mb-1">{currentTitle}</h3>
              <p className="text-gray-600">Keep learning to reach new heights!</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>{points} XP</span>
                <span>{nextLevelPoints} XP needed</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNextLevel}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-[#FFD700] to-[#FFA500]"
                />
              </div>
              <div className="text-center text-sm text-gray-600 mt-2">
                {Math.round(progressToNextLevel)}% to Level {level + 1} - {nextTitle}
              </div>
            </div>

            {/* Level Rewards */}
            <div className="space-y-4">
              <h4 className="font-semibold text-[#1F4E79] flex items-center gap-2">
                <Star className="w-5 h-5 text-[#FFD700]" />
                Level Rewards
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {LEVEL_REWARDS.slice(0, level + 2).map((reward) => (
                  <div
                    key={reward.level}
                    className={`p-3 rounded-xl border-2 ${
                      reward.level <= level
                        ? 'border-[#FFD700]/30 bg-gradient-to-r from-[#FFD700]/10 to-[#FFA500]/10'
                        : 'border-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-[#1F4E79]">
                        Level {reward.level}
                      </span>
                      {reward.level <= level && (
                        <Sparkles className="w-4 h-4 text-[#FFD700]" />
                      )}
                    </div>
                    <div className="text-xs text-gray-600">{reward.reward}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LevelModal;