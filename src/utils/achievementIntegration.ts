/**
 * Achievement System Integration Examples
 * Shows how to integrate XP earning into existing activity systems
 */

import { useXPGain } from '../hooks/useAchievements';

// ============================================
// FOCUS SYSTEM INTEGRATION
// ============================================

export const useFocusSessionCompletion = (userId: string) => {
  const { gainXP } = useXPGain(userId);

  const completeSession = async (sessionDuration: number) => {
    // Calculate XP based on session duration
    // Base: 10 XP per minute, capped at 50 minutes
    const baseXP = Math.min(sessionDuration, 50) * 10;
    const bonusXP = sessionDuration > 60 ? 50 : 0; // Bonus for marathons

    const totalXP = baseXP + bonusXP;

    // Trigger XP gain with 'focus' source
    const result = await gainXP(totalXP, 'focus');

    return result;
  };

  return { completeSession };
};

// Usage in FocusSession component:
/*
const { completeSession } = useFocusSessionCompletion(userId);

const handleSessionEnd = async () => {
  const result = await completeSession(sessionDuration);
  
  if (result?.leveledUp) {
    // Show level-up notification
    showNotification(`Level ${result.newLevel}!`);
  }
  
  if (result?.unlockedBadges.length > 0) {
    // Show badge unlock notifications
    result.unlockedBadges.forEach(badge => {
      showBadgeNotification(badge);
    });
  }
};
*/

// ============================================
// WELLNESS SYSTEM INTEGRATION
// ============================================

export const useWellnessCheckInCompletion = (userId: string) => {
  const { gainXP } = useXPGain(userId);

  const completeCheckIn = async (activities: string[]) => {
    // Base XP: 25 per activity type
    const baseXP = activities.length * 25;

    // Bonus for multi-activity check-ins
    const bonusXP = activities.length >= 3 ? 25 : 0;
    const totalXP = baseXP + bonusXP;

    const result = await gainXP(totalXP, 'wellness');

    return result;
  };

  return { completeCheckIn };
};

// ============================================
// SKILLS SYSTEM INTEGRATION
// ============================================

export const useSkillCompletion = (userId: string) => {
  const { gainXP } = useXPGain(userId);

  const completeSkill = async (skillType: 'course' | 'lesson' | 'project', difficulty: 'easy' | 'medium' | 'hard') => {
    const baseXPMap = {
      course: 100,
      lesson: 50,
      project: 150,
    };

    const difficultyMultiplier = {
      easy: 1,
      medium: 1.5,
      hard: 2,
    };

    const baseXP = baseXPMap[skillType];
    const multiplier = difficultyMultiplier[difficulty];
    const totalXP = Math.round(baseXP * multiplier);

    const result = await gainXP(totalXP, 'skills');

    return result;
  };

  return { completeSkill };
};

// ============================================
// CAREER/PROJECT SYSTEM INTEGRATION
// ============================================

export const useProjectTaskCompletion = (userId: string) => {
  const { gainXP } = useXPGain(userId);

  const completeTask = async (priority: 'low' | 'medium' | 'high' | 'critical') => {
    const xpMap = {
      low: 15,
      medium: 30,
      high: 60,
      critical: 100,
    };

    const xp = xpMap[priority];
    const result = await gainXP(xp, 'career');

    return result;
  };

  const completeProject = async (projectSize: 'small' | 'medium' | 'large') => {
    const xpMap = {
      small: 75,
      medium: 150,
      large: 300,
    };

    const xp = xpMap[projectSize];
    const result = await gainXP(xp, 'career');

    return result;
  };

  return { completeTask, completeProject };
};

// ============================================
// COMMUNITY SYSTEM INTEGRATION
// ============================================

export const useCommunityAction = (userId: string) => {
  const { gainXP } = useXPGain(userId);

  const performAction = async (actionType: 'help' | 'mentor' | 'share' | 'contribute') => {
    const xpMap = {
      help: 25,
      mentor: 50,
      share: 30,
      contribute: 75,
    };

    const xp = xpMap[actionType];
    const result = await gainXP(xp, 'community');

    return result;
  };

  return { performAction };
};

// ============================================
// STREAK SYSTEM INTEGRATION
// ============================================

export const useStreakMultiplier = (userId: string) => {
  const { gainXP } = useXPGain(userId);

  const getStreakMultiplier = (currentStreak: number): number => {
    if (currentStreak < 7) return 1; // No bonus
    if (currentStreak < 14) return 1.2; // 7-day streak
    if (currentStreak < 30) return 1.5; // 14-day streak
    return 2; // 30+ day streak
  };

  const gainXPWithStreak = async (baseXP: number, source: string, currentStreak: number) => {
    const multiplier = getStreakMultiplier(currentStreak);
    const totalXP = Math.round(baseXP * multiplier);

    const result = await gainXP(totalXP, source);

    return result;
  };

  return { getStreakMultiplier, gainXPWithStreak };
};

// ============================================
// REAL-WORLD INTEGRATION EXAMPLE
// ============================================

/**
 * Example: Complete focus session with streak bonus
 */
export const integrateCompleteFocusSession = async (
  userId: string,
  sessionDuration: number,
  currentStreak: number
) => {
  const { gainXP } = useXPGain(userId);
  const { gainXPWithStreak } = useStreakMultiplier(userId);

  // Calculate base XP (same as focus integration)
  const baseXP = Math.min(sessionDuration, 50) * 10;
  const bonusXP = sessionDuration > 60 ? 50 : 0;
  const totalBaseXP = baseXP + bonusXP;

  // Apply streak multiplier
  const finalResult = await gainXPWithStreak(totalBaseXP, 'focus', currentStreak);

  return finalResult;
};

/**
 * Example: Complete daily check-in (focus + wellness + career)
 */
export const completeDailyCheckIn = async (
  userId: string,
  focusMinutes: number,
  wellnessActivities: string[],
  tasksCompleted: number,
  currentStreak: number
) => {
  const { gainXPWithStreak } = useStreakMultiplier(userId);

  let totalXP = 0;

  // Focus XP
  const focusXP = Math.min(focusMinutes, 50) * 10;
  totalXP += focusXP;

  // Wellness XP
  const wellnessXP = wellnessActivities.length * 25 + (wellnessActivities.length >= 3 ? 25 : 0);
  totalXP += wellnessXP;

  // Career XP
  const careerXP = tasksCompleted * 30;
  totalXP += careerXP;

  // Daily bonus for completing all activities
  const dailyBonus = 50;
  totalXP += dailyBonus;

  // Apply streak multiplier to final total
  const finalResult = await gainXPWithStreak(totalXP, 'career', currentStreak);

  return finalResult;
};

// ============================================
// NOTIFICATION INTEGRATION
// ============================================

/**
 * Helper function to display notifications for achievement events
 */
export const handleAchievementNotification = (result: any, onNotify: (notification: any) => void) => {
  if (!result) return;

  // Level-up notification
  if (result.leveledUp) {
    onNotify({
      type: 'level-up',
      data: {
        level: result.newLevel,
        xp: result.totalXP,
        rewards: [],
      },
    });
  }

  // Badge unlock notifications
  if (result.unlockedBadges && result.unlockedBadges.length > 0) {
    result.unlockedBadges.forEach((badge: any) => {
      onNotify({
        type: 'badge-unlock',
        data: badge,
      });
    });
  }

  // Achievement unlock notifications
  if (result.unlockedAchievements && result.unlockedAchievements.length > 0) {
    result.unlockedAchievements.forEach((achievement: any) => {
      onNotify({
        type: 'achievement-unlock',
        data: achievement,
      });
    });
  }
};

// ============================================
// ACTIVITY SOURCE MAPPING
// ============================================

export const ACTIVITY_SOURCES = {
  // Focus activities
  FOCUS_SESSION: 'focus',
  POMODORO: 'focus',

  // Wellness activities
  MEDITATION: 'wellness',
  EXERCISE: 'wellness',
  SLEEP_LOG: 'wellness',
  MEAL_LOG: 'wellness',

  // Skill activities
  COURSE_COMPLETE: 'skills',
  LESSON_COMPLETE: 'skills',
  PROJECT_COMPLETE: 'skills',
  BOOK_CHAPTER: 'skills',

  // Career activities
  TASK_COMPLETE: 'career',
  PROJECT_MILESTONE: 'career',
  GOAL_ACHIEVE: 'career',

  // Community activities
  HELP_USER: 'community',
  MENTOR_SESSION: 'community',
  SHARE_KNOWLEDGE: 'community',
  COMMUNITY_EVENT: 'community',

  // Streak and special
  STREAK_MILESTONE: 'streaks',
  DAILY_BONUS: 'events',
} as const;

export default {
  useFocusSessionCompletion,
  useWellnessCheckInCompletion,
  useSkillCompletion,
  useProjectTaskCompletion,
  useCommunityAction,
  useStreakMultiplier,
  integrateCompleteFocusSession,
  completeDailyCheckIn,
  handleAchievementNotification,
  ACTIVITY_SOURCES,
};
