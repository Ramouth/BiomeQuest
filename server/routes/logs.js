import express from 'express';
import { query, queryOne, run } from '../db.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Log a plant intake
router.post('/', authenticateToken, (req, res) => {
  try {
    const { plantId } = req.body;
    const userId = req.user.userId;

    if (!plantId) {
      return res.status(400).json({ error: 'Plant ID is required' });
    }

    // Get plant details
    const plant = queryOne('SELECT * FROM plants WHERE id = ? AND is_active = 1', [plantId]);
    if (!plant) {
      return res.status(404).json({ error: 'Plant not found' });
    }

    // Check if user has eaten this plant before
    const userPlant = queryOne(
      'SELECT * FROM user_plants WHERE user_id = ? AND plant_id = ?',
      [userId, plantId]
    );

    const isFirstTime = !userPlant;
    const pointsEarned = isFirstTime ? plant.points : plant.repeat_points;
    const message = isFirstTime ? plant.first_time_message : plant.repeat_message;

    // Insert plant log
    run(
      'INSERT INTO plant_logs (user_id, plant_id, points_earned, is_first_time) VALUES (?, ?, ?, ?)',
      [userId, plantId, pointsEarned, isFirstTime ? 1 : 0]
    );

    // Update or insert user_plants record
    if (isFirstTime) {
      run(
        'INSERT INTO user_plants (user_id, plant_id) VALUES (?, ?)',
        [userId, plantId]
      );
    } else {
      run(
        'UPDATE user_plants SET times_eaten = times_eaten + 1 WHERE user_id = ? AND plant_id = ?',
        [userId, plantId]
      );
    }

    // Update streak
    updateStreak(userId);

    // Check for new badges
    const newBadges = checkAndAwardBadges(userId);

    // Get updated total points
    const totalPoints = queryOne(
      'SELECT SUM(points_earned) as total FROM plant_logs WHERE user_id = ?',
      [userId]
    );

    res.status(201).json({
      message,
      pointsEarned,
      isFirstTime,
      plant: {
        id: plant.id,
        name: plant.name,
        emoji: plant.emoji
      },
      totalPoints: totalPoints?.total || 0,
      newBadges
    });
  } catch (error) {
    console.error('Log plant error:', error);
    res.status(500).json({ error: 'Failed to log plant' });
  }
});

// Update user streak
function updateStreak(userId) {
  const user = queryOne('SELECT last_log_date, current_streak, longest_streak FROM users WHERE id = ?', [userId]);
  const today = new Date().toISOString().split('T')[0];

  if (!user.last_log_date) {
    // First log ever
    run(
      'UPDATE users SET last_log_date = ?, current_streak = 1, longest_streak = MAX(longest_streak, 1) WHERE id = ?',
      [today, userId]
    );
  } else {
    const lastLog = new Date(user.last_log_date);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate - lastLog) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Same day, no streak change
    } else if (diffDays === 1) {
      // Consecutive day, increment streak
      const newStreak = user.current_streak + 1;
      run(
        'UPDATE users SET last_log_date = ?, current_streak = ?, longest_streak = MAX(longest_streak, ?) WHERE id = ?',
        [today, newStreak, newStreak, userId]
      );
    } else {
      // Streak broken, reset to 1
      run(
        'UPDATE users SET last_log_date = ?, current_streak = 1 WHERE id = ?',
        [today, userId]
      );
    }
  }
}

// Check and award badges
function checkAndAwardBadges(userId) {
  const totalPoints = queryOne(
    'SELECT SUM(points_earned) as total FROM plant_logs WHERE user_id = ?',
    [userId]
  );
  const points = totalPoints?.total || 0;

  // Get all badges user hasn't unlocked yet
  const unlockedBadges = query(`
    SELECT b.* FROM badges b
    WHERE b.is_active = 1
      AND b.points_required <= ?
      AND b.id NOT IN (SELECT badge_id FROM user_badges WHERE user_id = ?)
    ORDER BY b.points_required
  `, [points, userId]);

  const newBadges = [];

  for (const badge of unlockedBadges) {
    run(
      'INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?)',
      [userId, badge.id]
    );
    newBadges.push({
      id: badge.id,
      name: badge.name,
      emoji: badge.emoji,
      description: badge.description
    });
  }

  return newBadges;
}

// Get user's logs for a specific day
router.get('/daily/:date', authenticateToken, (req, res) => {
  try {
    const logs = query(`
      SELECT
        pl.id,
        pl.points_earned,
        pl.is_first_time,
        pl.logged_at,
        p.id as plant_id,
        p.name as plant_name,
        p.emoji
      FROM plant_logs pl
      JOIN plants p ON pl.plant_id = p.id
      WHERE pl.user_id = ? AND DATE(pl.logged_at) = ?
      ORDER BY pl.logged_at DESC
    `, [req.user.userId, req.params.date]);

    const summary = queryOne(`
      SELECT
        COUNT(*) as plants_logged,
        SUM(points_earned) as points_earned
      FROM plant_logs
      WHERE user_id = ? AND DATE(logged_at) = ?
    `, [req.user.userId, req.params.date]);

    res.json({
      date: req.params.date,
      logs,
      summary: {
        plantsLogged: summary?.plants_logged || 0,
        pointsEarned: summary?.points_earned || 0
      }
    });
  } catch (error) {
    console.error('Get daily logs error:', error);
    res.status(500).json({ error: 'Failed to get daily logs' });
  }
});

// Get user's weekly summary (last 7 days)
router.get('/weekly', authenticateToken, (req, res) => {
  try {
    const logs = query(`
      SELECT
        DATE(logged_at) as date,
        COUNT(*) as plants_logged,
        SUM(points_earned) as points_earned,
        SUM(CASE WHEN is_first_time = 1 THEN 1 ELSE 0 END) as new_plants
      FROM plant_logs
      WHERE user_id = ? AND logged_at >= date('now', '-7 days')
      GROUP BY DATE(logged_at)
      ORDER BY DATE(logged_at) DESC
    `, [req.user.userId]);

    const summary = queryOne(`
      SELECT
        COUNT(*) as total_logs,
        SUM(points_earned) as total_points,
        COUNT(DISTINCT plant_id) as unique_plants
      FROM plant_logs
      WHERE user_id = ? AND logged_at >= date('now', '-7 days')
    `, [req.user.userId]);

    const user = queryOne('SELECT weekly_goal FROM users WHERE id = ?', [req.user.userId]);

    res.json({
      dailyBreakdown: logs,
      summary: {
        totalLogs: summary?.total_logs || 0,
        totalPoints: summary?.total_points || 0,
        uniquePlants: summary?.unique_plants || 0,
        weeklyGoal: user?.weekly_goal || 30,
        progress: Math.min(100, Math.round(((summary?.total_points || 0) / (user?.weekly_goal || 30)) * 100))
      }
    });
  } catch (error) {
    console.error('Get weekly logs error:', error);
    res.status(500).json({ error: 'Failed to get weekly logs' });
  }
});

// Get user's monthly summary (last 30 days)
router.get('/monthly', authenticateToken, (req, res) => {
  try {
    const logs = query(`
      SELECT
        DATE(logged_at) as date,
        COUNT(*) as plants_logged,
        SUM(points_earned) as points_earned
      FROM plant_logs
      WHERE user_id = ? AND logged_at >= date('now', '-30 days')
      GROUP BY DATE(logged_at)
      ORDER BY DATE(logged_at) DESC
    `, [req.user.userId]);

    const summary = queryOne(`
      SELECT
        COUNT(*) as total_logs,
        SUM(points_earned) as total_points,
        COUNT(DISTINCT plant_id) as unique_plants
      FROM plant_logs
      WHERE user_id = ? AND logged_at >= date('now', '-30 days')
    `, [req.user.userId]);

    const user = queryOne('SELECT monthly_goal FROM users WHERE id = ?', [req.user.userId]);

    res.json({
      dailyBreakdown: logs,
      summary: {
        totalLogs: summary?.total_logs || 0,
        totalPoints: summary?.total_points || 0,
        uniquePlants: summary?.unique_plants || 0,
        monthlyGoal: user?.monthly_goal || 120,
        progress: Math.min(100, Math.round(((summary?.total_points || 0) / (user?.monthly_goal || 120)) * 100))
      }
    });
  } catch (error) {
    console.error('Get monthly logs error:', error);
    res.status(500).json({ error: 'Failed to get monthly logs' });
  }
});

// Get user's top plants
router.get('/top-plants', authenticateToken, (req, res) => {
  try {
    const limit = req.query.limit || 5;
    const plants = query(`
      SELECT
        p.id,
        p.name,
        p.emoji,
        up.times_eaten,
        up.first_eaten_at
      FROM user_plants up
      JOIN plants p ON up.plant_id = p.id
      WHERE up.user_id = ?
      ORDER BY up.times_eaten DESC
      LIMIT ?
    `, [req.user.userId, limit]);

    res.json(plants);
  } catch (error) {
    console.error('Get top plants error:', error);
    res.status(500).json({ error: 'Failed to get top plants' });
  }
});

// Get all logs (with pagination)
router.get('/', authenticateToken, (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const logs = query(`
      SELECT
        pl.id,
        pl.points_earned,
        pl.is_first_time,
        pl.logged_at,
        p.id as plant_id,
        p.name as plant_name,
        p.emoji
      FROM plant_logs pl
      JOIN plants p ON pl.plant_id = p.id
      WHERE pl.user_id = ?
      ORDER BY pl.logged_at DESC
      LIMIT ? OFFSET ?
    `, [req.user.userId, limit, offset]);

    const total = queryOne(
      'SELECT COUNT(*) as count FROM plant_logs WHERE user_id = ?',
      [req.user.userId]
    );

    res.json({
      logs,
      pagination: {
        page,
        limit,
        total: total?.count || 0,
        totalPages: Math.ceil((total?.count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ error: 'Failed to get logs' });
  }
});

export default router;
