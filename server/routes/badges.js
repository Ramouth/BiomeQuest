import express from 'express';
import { query, queryOne } from '../db.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Get all badges
router.get('/', (req, res, next) => {
  try {
    const badges = query(
      'SELECT id, name, emoji, description, points_required FROM badges WHERE is_active = 1 ORDER BY sort_order, points_required'
    );

    res.json(badges);
  } catch (error) {
    next(error);
  }
});

// Get user's badges with unlock status
router.get('/user', authenticateToken, (req, res, next) => {
  try {
    const badges = query(`
      SELECT
        b.id,
        b.name,
        b.emoji,
        b.description,
        b.points_required,
        CASE WHEN ub.user_id IS NOT NULL THEN 1 ELSE 0 END as unlocked,
        ub.unlocked_at
      FROM badges b
      LEFT JOIN user_badges ub ON b.id = ub.badge_id AND ub.user_id = ?
      WHERE b.is_active = 1
      ORDER BY b.sort_order, b.points_required
    `, [req.user.userId]);

    // Get user's total points
    const points = queryOne(
      'SELECT SUM(points_earned) as total FROM plant_logs WHERE user_id = ?',
      [req.user.userId]
    );

    // Find next badge to unlock
    const nextBadge = queryOne(`
      SELECT b.* FROM badges b
      WHERE b.is_active = 1
        AND b.id NOT IN (SELECT badge_id FROM user_badges WHERE user_id = ?)
      ORDER BY b.points_required
      LIMIT 1
    `, [req.user.userId]);

    res.json({
      badges,
      totalPoints: points?.total || 0,
      nextBadge: nextBadge ? {
        id: nextBadge.id,
        name: nextBadge.name,
        emoji: nextBadge.emoji,
        pointsRequired: nextBadge.points_required,
        pointsNeeded: nextBadge.points_required - (points?.total || 0)
      } : null
    });
  } catch (error) {
    next(error);
  }
});

export default router;
