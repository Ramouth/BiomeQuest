import express from 'express';
import { query, queryOne, run } from '../db.js';
import { authenticateToken } from './auth.js';
import { createError, validateUser, validateRequiredFields } from '../utils/errors.js';

const router = express.Router();

// Log a plant intake
router.post('/', authenticateToken, (req, res, next) => {
  try {
    const { plantId } = req.body;
    const userId = req.user.userId;

    if (!plantId) {
      throw createError.missingFields(['plantId']);
    }

    // Verify user exists in database
    const userExists = queryOne('SELECT id FROM users WHERE id = ?', [userId]);
    validateUser(userExists, userId);

    // Get plant details
    const plant = queryOne('SELECT * FROM plants WHERE id = ? AND is_active = 1', [plantId]);
    if (!plant) {
      throw createError.plantNotFound();
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
    next(error);
  }
});

// Update user streak
function updateStreak(userId) {
  const user = queryOne('SELECT last_log_date, current_streak, longest_streak FROM users WHERE id = ?', [userId]);
  const today = new Date().toISOString().split('T')[0];

  if (!user) {
    console.error('updateStreak: User not found for userId:', userId);
    return;
  }

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
router.get('/daily/:date', authenticateToken, (req, res, next) => {
  try {
    const { date } = req.params;

    // Validate date format
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw createError.badRequest('Invalid date format. Please use YYYY-MM-DD');
    }

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
    `, [req.user.userId, date]);

    const summary = queryOne(`
      SELECT
        COUNT(*) as plants_logged,
        SUM(points_earned) as points_earned
      FROM plant_logs
      WHERE user_id = ? AND DATE(logged_at) = ?
    `, [req.user.userId, date]);

    res.json({
      date,
      logs,
      summary: {
        plantsLogged: summary?.plants_logged || 0,
        pointsEarned: summary?.points_earned || 0
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get user's weekly summary (last 7 days)
router.get('/weekly', authenticateToken, (req, res, next) => {
  try {
    // Verify user exists
    const user = queryOne('SELECT weekly_goal FROM users WHERE id = ?', [req.user.userId]);
    if (!user) {
      throw createError.userNotFound();
    }

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

    // Get all-time total points for plant growth visualization
    const allTimePoints = queryOne(
      'SELECT SUM(points_earned) as total FROM plant_logs WHERE user_id = ?',
      [req.user.userId]
    );

    const weeklyGoal = user.weekly_goal || 30;

    res.json({
      dailyBreakdown: logs,
      summary: {
        totalLogs: summary?.total_logs || 0,
        weeklyPoints: summary?.total_points || 0,
        allTimePoints: allTimePoints?.total || 0,
        uniquePlants: summary?.unique_plants || 0,
        weeklyGoal,
        progress: Math.min(100, Math.round(((summary?.total_points || 0) / weeklyGoal) * 100))
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get user's monthly summary (last 30 days)
router.get('/monthly', authenticateToken, (req, res, next) => {
  try {
    // Verify user exists
    const user = queryOne('SELECT monthly_goal FROM users WHERE id = ?', [req.user.userId]);
    if (!user) {
      throw createError.userNotFound();
    }

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

    const monthlyGoal = user.monthly_goal || 120;

    res.json({
      dailyBreakdown: logs,
      summary: {
        totalLogs: summary?.total_logs || 0,
        totalPoints: summary?.total_points || 0,
        uniquePlants: summary?.unique_plants || 0,
        monthlyGoal,
        progress: Math.min(100, Math.round(((summary?.total_points || 0) / monthlyGoal) * 100))
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get user's top plants
router.get('/top-plants', authenticateToken, (req, res, next) => {
  try {
    // Validate and sanitize limit parameter
    let limit = parseInt(req.query.limit, 10);
    if (isNaN(limit) || limit < 1) limit = 5;
    if (limit > 50) limit = 50; // Cap at reasonable maximum

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
    next(error);
  }
});

// Get all logs (with pagination)
router.get('/', authenticateToken, (req, res, next) => {
  try {
    // Validate and sanitize pagination parameters
    let page = parseInt(req.query.page, 10);
    let limit = parseInt(req.query.limit, 10);

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 20;
    if (limit > 100) limit = 100; // Cap at reasonable maximum

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
    next(error);
  }
});

export default router;
