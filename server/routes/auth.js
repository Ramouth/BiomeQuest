import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query, queryOne, run } from '../db.js';
import { createError, validateUser, validateRequiredFields } from '../utils/errors.js';
import { getRandomAvatarId } from '../constants/avatars.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'biomequest-secret-key-change-in-production';

// Register new user
router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    validateRequiredFields(req.body, ['username', 'email', 'password']);

    // Check if user already exists
    const existingUser = queryOne(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUser) {
      throw createError.userExists();
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    const avatarSeed = getRandomAvatarId();

    // Insert user
    const result = run(
      `INSERT INTO users (username, email, password_hash, avatar_seed)
       VALUES (?, ?, ?, ?)`,
      [username, email, passwordHash, avatarSeed]
    );

    const userId = result.lastInsertRowid;
    if (userId === undefined || userId === null) {
      throw createError.database('save');
    }

    // Generate JWT token (new users are never admin)
    const token = jwt.sign({ userId, username, isAdmin: false }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: userId,
        username,
        email,
        avatarSeed,
        isAdmin: false
      },
      token
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    validateRequiredFields(req.body, ['email', 'password']);

    // Find user
    const user = queryOne(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (!user) {
      throw createError.invalidCredentials();
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      throw createError.invalidCredentials();
    }

    // Generate JWT token with admin flag
    const isAdmin = Boolean(user.is_admin);
    const token = jwt.sign(
      { userId: user.id, username: user.username, isAdmin },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatarSeed: user.avatar_seed,
        weeklyGoal: user.weekly_goal,
        monthlyGoal: user.monthly_goal,
        currentStreak: user.current_streak,
        longestStreak: user.longest_streak,
        createdAt: user.created_at,
        isAdmin
      },
      token
    });
  } catch (error) {
    next(error);
  }
});

// Middleware to verify JWT token
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    const error = createError.unauthorized();
    return res.status(error.statusCode).json(error.toJSON());
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      const error = createError.invalidToken();
      return res.status(error.statusCode).json(error.toJSON());
    }
    req.user = user;
    next();
  });
}

// Middleware to require admin access
export function requireAdmin(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Admin access required'
    });
  }
  next();
}

// Get current user profile
router.get('/me', authenticateToken, (req, res, next) => {
  try {
    const user = queryOne(
      'SELECT * FROM users WHERE id = ?',
      [req.user.userId]
    );

    validateUser(user, req.user.userId);

    // Get total points
    const points = queryOne(
      'SELECT SUM(points_earned) as total FROM plant_logs WHERE user_id = ?',
      [user.id]
    );

    // Get unique plants count
    const uniquePlants = queryOne(
      'SELECT COUNT(*) as count FROM user_plants WHERE user_id = ?',
      [user.id]
    );

    // Get unlocked badges count
    const badges = queryOne(
      'SELECT COUNT(*) as count FROM user_badges WHERE user_id = ?',
      [user.id]
    );

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      avatarSeed: user.avatar_seed,
      weeklyGoal: user.weekly_goal,
      monthlyGoal: user.monthly_goal,
      currentStreak: user.current_streak,
      longestStreak: user.longest_streak,
      createdAt: user.created_at,
      isAdmin: Boolean(user.is_admin),
      stats: {
        totalPoints: points?.total || 0,
        uniquePlants: uniquePlants?.count || 0,
        badgesUnlocked: badges?.count || 0
      }
    });
  } catch (error) {
    next(error);
  }
});

// Update user goals
router.patch('/goals', authenticateToken, (req, res, next) => {
  try {
    const { weeklyGoal, monthlyGoal } = req.body;

    // Verify user exists first
    const user = queryOne('SELECT id FROM users WHERE id = ?', [req.user.userId]);
    validateUser(user, req.user.userId);

    if (weeklyGoal !== undefined) {
      run('UPDATE users SET weekly_goal = ? WHERE id = ?', [weeklyGoal, req.user.userId]);
    }

    if (monthlyGoal !== undefined) {
      run('UPDATE users SET monthly_goal = ? WHERE id = ?', [monthlyGoal, req.user.userId]);
    }

    res.json({ message: 'Goals updated successfully' });
  } catch (error) {
    next(error);
  }
});

// Get all users (admin only)
router.get('/users', authenticateToken, requireAdmin, (req, res, next) => {
  try {
    const users = query(`
      SELECT
        u.id,
        u.username,
        u.email,
        u.avatar_seed,
        u.is_admin,
        u.created_at,
        COALESCE(p.total_points, 0) as total_points,
        COALESCE(up.unique_plants, 0) as unique_plants
      FROM users u
      LEFT JOIN (
        SELECT user_id, SUM(points_earned) as total_points
        FROM plant_logs
        GROUP BY user_id
      ) p ON u.id = p.user_id
      LEFT JOIN (
        SELECT user_id, COUNT(*) as unique_plants
        FROM user_plants
        GROUP BY user_id
      ) up ON u.id = up.user_id
      ORDER BY u.created_at DESC
    `);

    res.json(users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      avatarSeed: user.avatar_seed,
      isAdmin: Boolean(user.is_admin),
      createdAt: user.created_at,
      totalPoints: user.total_points,
      uniquePlants: user.unique_plants
    })));
  } catch (error) {
    next(error);
  }
});

// Delete a user (admin only)
router.delete('/users/:id', authenticateToken, requireAdmin, (req, res, next) => {
  try {
    const userId = parseInt(req.params.id, 10);

    if (isNaN(userId)) {
      throw createError.badRequest('Invalid user ID');
    }

    // Prevent admin from deleting themselves
    if (userId === req.user.userId) {
      throw createError.badRequest('Cannot delete your own account');
    }

    // Check if user exists
    const user = queryOne('SELECT id, is_admin FROM users WHERE id = ?', [userId]);
    if (!user) {
      throw createError.notFound('User');
    }

    // Prevent deleting other admins
    if (user.is_admin) {
      throw createError.badRequest('Cannot delete admin users');
    }

    // Delete user (cascades to related tables due to foreign keys)
    run('DELETE FROM users WHERE id = ?', [userId]);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
