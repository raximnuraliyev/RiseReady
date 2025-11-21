import express from 'express';
import achievementController from '../controllers/achievementController.js';

const router = express.Router();

// POST /api/achievements/gain-xp
// Gain XP and trigger achievement/badge unlocks
router.post('/gain-xp', async (req, res) => {
  try {
    const { userId, amount, source } = req.body;

    if (!userId || !amount || !source) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, amount, source',
      });
    }

    const result = await achievementController.gainXP(userId, amount, source);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error gaining XP:', error);
    return res.status(500).json({
      success: false,
      message: 'Error gaining XP',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// GET /api/achievements/user/:userId
// Get user's complete achievement data
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const achievements = await achievementController.getUserAchievements(userId);

    if (!achievements) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.json({
      success: true,
      data: achievements,
    });
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching user achievements',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// GET /api/achievements/leaderboard
// Get leaderboard rankings
router.get('/leaderboard', async (req, res) => {
  try {
    const { category = 'overall', timeframe = 'all', limit = 50, page = 1 } = req.query;

    const leaderboard = await achievementController.getLeaderboard(
      String(category),
      String(timeframe),
      Number(limit),
      Number(page)
    );

    return res.json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching leaderboard',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// GET /api/achievements/badge/:badgeId
// Get badge details
router.get('/badge/:badgeId', async (req, res) => {
  try {
    const { badgeId } = req.params;
    const badge = await achievementController.getBadgeDetails(badgeId);

    if (!badge) {
      return res.status(404).json({
        success: false,
        message: 'Badge not found',
      });
    }

    return res.json({
      success: true,
      data: badge,
    });
  } catch (error) {
    console.error('Error fetching badge details:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching badge details',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// PUT /api/achievements/progress
// Update achievement progress manually
router.put('/progress', async (req, res) => {
  try {
    const { userId, achievementId, progress } = req.body;

    if (!userId || !achievementId || progress === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, achievementId, progress',
      });
    }

    const result = await achievementController.updateAchievementProgress(
      userId,
      achievementId,
      progress
    );

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error updating achievement progress:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating achievement progress',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// POST /api/achievements/seed
// Seed levels and badges (run once on startup)
router.post('/seed', async (req, res) => {
  try {
    const result = await achievementController.seedLevelsAndBadges();

    return res.json({
      success: true,
      message: 'Seeding completed successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error seeding data:', error);
    return res.status(500).json({
      success: false,
      message: 'Error seeding data',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// GET /api/achievements/levels
// Get all level definitions
router.get('/levels', async (req, res) => {
  try {
    const { default: levels } = await import('../data/levels.json', {
      assert: { type: 'json' },
    });

    return res.json({
      success: true,
      data: levels,
    });
  } catch (error) {
    console.error('Error fetching levels:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching levels',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// GET /api/achievements/badges
// Get all badge definitions
router.get('/badges', async (req, res) => {
  try {
    const { default: badges } = await import('../data/badgeSeeds.js', {
      assert: { type: 'json' },
    });

    return res.json({
      success: true,
      data: badges,
    });
  } catch (error) {
    console.error('Error fetching badges:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching badges',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// POST /api/achievements/level-up
// Handle level-up event (internal use)
router.post('/level-up', async (req, res) => {
  try {
    const { userId, newLevel } = req.body;

    if (!userId || !newLevel) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, newLevel',
      });
    }

    return res.json({
      success: true,
      message: 'Level-up event processed',
      data: { userId, newLevel },
    });
  } catch (error) {
    console.error('Error processing level-up:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing level-up',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// GET /api/achievements/stats/:userId
// Get user's achievement statistics
router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const achievements = await achievementController.getUserAchievements(userId);

    if (!achievements) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Calculate stats
    const stats = {
      level: achievements.level,
      totalXP: achievements.totalXPEarned,
      badgesEarned: achievements.badges?.length || 0,
      streakDays: achievements.streakData?.currentStreak || 0,
      longestStreak: achievements.streakData?.longestStreak || 0,
      perfectDays: achievements.streakData?.perfectDays || 0,
      xpSources: achievements.xpSources || {},
    };

    return res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching user stats',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
