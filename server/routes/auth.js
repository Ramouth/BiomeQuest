import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query, queryOne, run } from '../db.js';
import { createError, validateUser, validateRequiredFields } from '../utils/errors.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'biomequest-secret-key-change-in-production';

// Generate random avatar seed
function generateAvatarSeed() {
  return Math.random().toString(36).substring(2, 15);
}

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
    const avatarSeed = generateAvatarSeed();

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

    // Generate JWT token
    const token = jwt.sign({ userId, username }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: userId,
        username,
        email,
        avatarSeed
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

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
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
        createdAt: user.created_at
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

export default router;
