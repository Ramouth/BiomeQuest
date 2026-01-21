import express from 'express';
import { query, queryOne } from '../db.js';
import { authenticateToken } from './auth.js';
import { createError } from '../utils/errors.js';

const router = express.Router();

// Get all active plants
router.get('/', (req, res, next) => {
  try {
    const plants = query(
      'SELECT id, name, emoji, points, repeat_points, first_time_message, repeat_message, is_superfood FROM plants WHERE is_active = 1 ORDER BY name'
    );

    res.json(plants.map(p => ({ ...p, is_superfood: Boolean(p.is_superfood) })));
  } catch (error) {
    next(error);
  }
});

// Get single plant by ID
router.get('/:id', (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ID is a number
    if (!id || isNaN(parseInt(id, 10))) {
      throw createError.badRequest('Invalid plant ID');
    }

    const plant = queryOne(
      'SELECT id, name, emoji, points, repeat_points, first_time_message, repeat_message, is_superfood FROM plants WHERE id = ? AND is_active = 1',
      [id]
    );

    if (!plant) {
      throw createError.plantNotFound();
    }

    res.json({ ...plant, is_superfood: Boolean(plant.is_superfood) });
  } catch (error) {
    next(error);
  }
});

// Search plants by name
router.get('/search/:query', (req, res, next) => {
  try {
    const { query: searchTerm } = req.params;

    if (!searchTerm || searchTerm.trim().length === 0) {
      throw createError.badRequest('Search term is required');
    }

    // Sanitize and limit search term length
    const sanitizedTerm = searchTerm.trim().slice(0, 100);
    const searchQuery = `%${sanitizedTerm}%`;

    const plants = query(
      'SELECT id, name, emoji, points, repeat_points, is_superfood FROM plants WHERE is_active = 1 AND name LIKE ? ORDER BY name LIMIT 10',
      [searchQuery]
    );

    res.json(plants.map(p => ({ ...p, is_superfood: Boolean(p.is_superfood) })));
  } catch (error) {
    next(error);
  }
});

// Get plants with user's eaten status (requires auth)
router.get('/user/status', authenticateToken, (req, res, next) => {
  try {
    const plants = query(`
      SELECT
        p.id,
        p.name,
        p.emoji,
        p.points,
        p.repeat_points,
        p.first_time_message,
        p.repeat_message,
        p.is_superfood,
        CASE WHEN up.user_id IS NOT NULL THEN 1 ELSE 0 END as has_eaten,
        up.times_eaten,
        up.first_eaten_at
      FROM plants p
      LEFT JOIN user_plants up ON p.id = up.plant_id AND up.user_id = ?
      WHERE p.is_active = 1
      ORDER BY p.name
    `, [req.user.userId]);

    // Get user's total points
    const totalPointsResult = queryOne(
      'SELECT SUM(points_earned) as total FROM plant_logs WHERE user_id = ?',
      [req.user.userId]
    );

    res.json({
      plants: plants.map(p => ({ ...p, is_superfood: Boolean(p.is_superfood) })),
      totalPoints: totalPointsResult?.total || 0
    });
  } catch (error) {
    next(error);
  }
});

export default router;
