import express from 'express';
import { query, queryOne } from '../db.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Get all active plants
router.get('/', (req, res) => {
  try {
    const plants = query(
      'SELECT id, name, emoji, points, repeat_points, first_time_message, repeat_message FROM plants WHERE is_active = 1 ORDER BY name'
    );

    res.json(plants);
  } catch (error) {
    console.error('Get plants error:', error);
    res.status(500).json({ error: 'Failed to get plants' });
  }
});

// Get single plant by ID
router.get('/:id', (req, res) => {
  try {
    const plant = queryOne(
      'SELECT id, name, emoji, points, repeat_points, first_time_message, repeat_message FROM plants WHERE id = ? AND is_active = 1',
      [req.params.id]
    );

    if (!plant) {
      return res.status(404).json({ error: 'Plant not found' });
    }

    res.json(plant);
  } catch (error) {
    console.error('Get plant error:', error);
    res.status(500).json({ error: 'Failed to get plant' });
  }
});

// Search plants by name
router.get('/search/:query', (req, res) => {
  try {
    const searchQuery = `%${req.params.query}%`;
    const plants = query(
      'SELECT id, name, emoji, points, repeat_points FROM plants WHERE is_active = 1 AND name LIKE ? ORDER BY name LIMIT 10',
      [searchQuery]
    );

    res.json(plants);
  } catch (error) {
    console.error('Search plants error:', error);
    res.status(500).json({ error: 'Failed to search plants' });
  }
});

// Get plants with user's eaten status (requires auth)
router.get('/user/status', authenticateToken, (req, res) => {
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
        CASE WHEN up.user_id IS NOT NULL THEN 1 ELSE 0 END as has_eaten,
        up.times_eaten,
        up.first_eaten_at
      FROM plants p
      LEFT JOIN user_plants up ON p.id = up.plant_id AND up.user_id = ?
      WHERE p.is_active = 1
      ORDER BY p.name
    `, [req.user.userId]);

    res.json(plants);
  } catch (error) {
    console.error('Get plants with status error:', error);
    res.status(500).json({ error: 'Failed to get plants' });
  }
});

export default router;
