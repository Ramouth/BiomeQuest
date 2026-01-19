import express from 'express';
import { query, queryOne, run } from '../db.js';
import { authenticateToken } from './auth.js';
import { createError, validateRequiredFields } from '../utils/errors.js';

const router = express.Router();

// Submit a new plant request
router.post('/', authenticateToken, (req, res, next) => {
  try {
    const { plantName, suggestedEmoji, description } = req.body;

    if (!plantName || !plantName.trim()) {
      throw createError.missingFields(['plantName']);
    }

    const trimmedName = plantName.trim();

    // Check if plant already exists
    const existingPlant = queryOne(
      'SELECT id FROM plants WHERE LOWER(name) = LOWER(?)',
      [trimmedName]
    );

    if (existingPlant) {
      throw createError.badRequest('This plant already exists in the database');
    }

    // Check if there's already a pending request for this plant
    const existingRequest = queryOne(
      "SELECT id FROM plant_requests WHERE LOWER(plant_name) = LOWER(?) AND status = 'pending'",
      [trimmedName]
    );

    if (existingRequest) {
      throw createError.badRequest('A request for this plant is already pending');
    }

    // Insert request
    const result = run(
      'INSERT INTO plant_requests (user_id, plant_name, suggested_emoji, description) VALUES (?, ?, ?, ?)',
      [req.user.userId, trimmedName, suggestedEmoji || null, description || null]
    );

    res.status(201).json({
      message: 'Plant request submitted successfully',
      request: {
        id: result.lastInsertRowid,
        plantName: trimmedName,
        suggestedEmoji,
        description,
        status: 'pending'
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get user's own requests
router.get('/my-requests', authenticateToken, (req, res, next) => {
  try {
    const requests = query(`
      SELECT id, plant_name, suggested_emoji, description, status, admin_notes, created_at, reviewed_at
      FROM plant_requests
      WHERE user_id = ?
      ORDER BY created_at DESC
    `, [req.user.userId]);

    res.json(requests);
  } catch (error) {
    next(error);
  }
});

// Get all pending requests (admin only - for now, anyone can view)
router.get('/pending', authenticateToken, (req, res, next) => {
  try {
    const requests = query(`
      SELECT
        pr.id,
        pr.plant_name,
        pr.suggested_emoji,
        pr.description,
        pr.status,
        pr.created_at,
        u.username as requested_by
      FROM plant_requests pr
      JOIN users u ON pr.user_id = u.id
      WHERE pr.status = 'pending'
      ORDER BY pr.created_at ASC
    `);

    res.json(requests);
  } catch (error) {
    next(error);
  }
});

// Approve a plant request (admin only - simplified, no admin check for now)
router.post('/:id/approve', authenticateToken, (req, res, next) => {
  try {
    const { emoji, points, repeatPoints } = req.body;
    const requestId = req.params.id;

    // Validate request ID
    if (!requestId || isNaN(parseInt(requestId, 10))) {
      throw createError.badRequest('Invalid request ID');
    }

    // Get the request
    const request = queryOne(
      'SELECT * FROM plant_requests WHERE id = ?',
      [requestId]
    );

    if (!request) {
      throw createError.notFound('Plant request');
    }

    if (request.status !== 'pending') {
      throw createError.badRequest('Request has already been processed');
    }

    // Insert the new plant
    const plantEmoji = emoji || request.suggested_emoji || '🌱';
    const plantResult = run(
      'INSERT INTO plants (name, emoji, points, repeat_points) VALUES (?, ?, ?, ?)',
      [request.plant_name, plantEmoji, points || 5, repeatPoints || 1]
    );

    // Update request status
    run(
      "UPDATE plant_requests SET status = 'approved', reviewed_at = CURRENT_TIMESTAMP WHERE id = ?",
      [requestId]
    );

    res.json({
      message: 'Plant request approved',
      plant: {
        id: plantResult.lastInsertRowid,
        name: request.plant_name,
        emoji: plantEmoji
      }
    });
  } catch (error) {
    next(error);
  }
});

// Reject a plant request (admin only)
router.post('/:id/reject', authenticateToken, (req, res, next) => {
  try {
    const { adminNotes } = req.body;
    const requestId = req.params.id;

    // Validate request ID
    if (!requestId || isNaN(parseInt(requestId, 10))) {
      throw createError.badRequest('Invalid request ID');
    }

    // Get the request
    const request = queryOne(
      'SELECT * FROM plant_requests WHERE id = ?',
      [requestId]
    );

    if (!request) {
      throw createError.notFound('Plant request');
    }

    if (request.status !== 'pending') {
      throw createError.badRequest('Request has already been processed');
    }

    // Update request status
    run(
      "UPDATE plant_requests SET status = 'rejected', admin_notes = ?, reviewed_at = CURRENT_TIMESTAMP WHERE id = ?",
      [adminNotes || null, requestId]
    );

    res.json({ message: 'Plant request rejected' });
  } catch (error) {
    next(error);
  }
});

export default router;
