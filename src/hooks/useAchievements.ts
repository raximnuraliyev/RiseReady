import { useState, useCallback, useEffect } from 'react';

interface UserProgress {
  currentLevel: number;
  currentXP: number;
  totalXPEarned: number;
  badges: string[];
  currentStreak: number;
  longestStreak: number;
  perfectDays: number;
}

interface XPGainResponse {
  xpGained: number;
  level: number;
  totalXP: number;
  multiplier: number;
  leveledUp: boolean;
  newLevel?: number;
  unlockedBadges: any[];
  unlockedAchievements: any[];
}

interface Badge {
  badgeId: string;
  name: string;
  description: string;
  rarity: string;
  category: string;
}

interface Level {
  level: number;
  title: string;
  subtitle: string;
  description: string;
  requiredXP: number;
}

// Hook for managing user achievements
export const useAchievements = (userId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);

  const fetchAchievements = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/achievements/user/${userId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch achievements');
      }

      const data = await response.json();
      setProgress(data.data);
      return data.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Error fetching achievements:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  return { progress, loading, error, refetch: fetchAchievements };
};

// Hook for gaining XP
export const useXPGain = (userId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastGain, setLastGain] = useState<XPGainResponse | null>(null);

  const gainXP = useCallback(
    async (amount: number, source: string): Promise<XPGainResponse | null> => {
      if (!userId || amount <= 0) return null;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/achievements/gain-xp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, amount, source }),
        });

        if (!response.ok) {
          throw new Error('Failed to gain XP');
        }

        const data = await response.json();
        setLastGain(data.data);
        return data.data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        console.error('Error gaining XP:', err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  return { gainXP, loading, error, lastGain };
};

// Hook for fetching leaderboard
export const useLeaderboard = (category = 'overall', timeframe = 'all', limit = 50) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        category,
        timeframe,
        limit: limit.toString(),
      });

      const response = await fetch(`/api/achievements/leaderboard?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }

      const result = await response.json();
      setData(result.data || []);
      return result.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  }, [category, timeframe, limit]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return { data, loading, error, refetch: fetchLeaderboard };
};

// Hook for fetching all badges
export const useBadges = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);

  const fetchBadges = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/achievements/badges');

      if (!response.ok) {
        throw new Error('Failed to fetch badges');
      }

      const data = await response.json();
      setBadges(data.data || []);
      return data.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Error fetching badges:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBadges();
  }, [fetchBadges]);

  return { badges, loading, error, refetch: fetchBadges };
};

// Hook for fetching all levels
export const useLevels = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [levels, setLevels] = useState<Level[]>([]);

  const fetchLevels = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/achievements/levels');

      if (!response.ok) {
        throw new Error('Failed to fetch levels');
      }

      const data = await response.json();
      setLevels(data.data || []);
      return data.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Error fetching levels:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLevels();
  }, [fetchLevels]);

  return { levels, loading, error, refetch: fetchLevels };
};

// Hook for fetching user statistics
export const useAchievementStats = (userId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any | null>(null);

  const fetchStats = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/achievements/stats/${userId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();
      setStats(data.data);
      return data.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
};

// Hook for updating achievement progress
export const useUpdateAchievementProgress = (userId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProgress = useCallback(
    async (achievementId: string, progress: number) => {
      if (!userId) return null;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/achievements/progress', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, achievementId, progress }),
        });

        if (!response.ok) {
          throw new Error('Failed to update achievement progress');
        }

        const data = await response.json();
        return data.data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        console.error('Error updating achievement progress:', err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  return { updateProgress, loading, error };
};

// Combined hook for managing all achievement data
export const useAchievementSystem = (userId: string) => {
  const achievements = useAchievements(userId);
  const { gainXP } = useXPGain(userId);
  const { badges } = useBadges();
  const { levels } = useLevels();
  const stats = useAchievementStats(userId);

  return {
    achievements,
    gainXP,
    badges,
    levels,
    stats,
    isLoading: achievements.loading || stats.loading,
  };
};
