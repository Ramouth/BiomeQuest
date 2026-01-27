import express from 'express';
import { query, queryOne, run } from '../db.js';
import { authenticateToken } from './auth.js';
import { createError } from '../utils/errors.js';

const router = express.Router();

// Submit beta feedback
router.post('/', authenticateToken, (req, res, next) => {
  try {
    const { rating, feedbackText } = req.body;
    const userId = req.user.userId;

    if (!rating || rating < 1 || rating > 5) {
      throw createError.badRequest('Rating must be between 1 and 5');
    }

    // Check if user already submitted feedback
    const existing = queryOne(
      'SELECT id FROM beta_feedback WHERE user_id = ?',
      [userId]
    );

    if (existing) {
      throw createError.badRequest('You have already submitted feedback');
    }

    const result = run(
      'INSERT INTO beta_feedback (user_id, rating, feedback_text) VALUES (?, ?, ?)',
      [userId, rating, feedbackText || null]
    );

    res.status(201).json({
      message: 'Thank you for your feedback!',
      id: result.lastInsertRowid
    });
  } catch (error) {
    next(error);
  }
});

// Check if user has submitted feedback
router.get('/status', authenticateToken, (req, res, next) => {
  try {
    const userId = req.user.userId;

    const feedback = queryOne(
      'SELECT id, created_at FROM beta_feedback WHERE user_id = ?',
      [userId]
    );

    res.json({
      hasSubmitted: !!feedback,
      submittedAt: feedback?.created_at || null
    });
  } catch (error) {
    next(error);
  }
});

// Get all feedback (admin only)
router.get('/all', authenticateToken, (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Check if user is admin
    const user = queryOne('SELECT is_admin FROM users WHERE id = ?', [userId]);
    if (!user?.is_admin) {
      throw createError.forbidden('Admin access required');
    }

    const feedback = query(`
      SELECT
        bf.id,
        bf.rating,
        bf.feedback_text,
        bf.app_version,
        bf.created_at,
        u.username,
        u.email,
        (SELECT COUNT(*) FROM plant_logs WHERE user_id = bf.user_id) as plants_logged,
        (SELECT SUM(points_earned) FROM plant_logs WHERE user_id = bf.user_id) as total_points
      FROM beta_feedback bf
      JOIN users u ON bf.user_id = u.id
      ORDER BY bf.created_at DESC
    `);

    // Calculate summary stats
    const stats = queryOne(`
      SELECT
        COUNT(*) as total_responses,
        AVG(rating) as avg_rating,
        SUM(CASE WHEN rating >= 4 THEN 1 ELSE 0 END) as positive_count,
        SUM(CASE WHEN rating <= 2 THEN 1 ELSE 0 END) as negative_count
      FROM beta_feedback
    `);

    res.json({
      feedback,
      stats: {
        totalResponses: stats?.total_responses || 0,
        avgRating: stats?.avg_rating ? Math.round(stats.avg_rating * 10) / 10 : 0,
        positiveCount: stats?.positive_count || 0,
        negativeCount: stats?.negative_count || 0
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
