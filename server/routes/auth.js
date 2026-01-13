import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query, queryOne, run } from '../db.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'biomequest-secret-key-change-in-production';

// Generate random avatar seed
function generateAvatarSeed() {
  return Math.random().toString(36).substring(2, 15);
}

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = queryOne(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUser) {
      return res.status(409).json({ error: 'Username or email already exists' });
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
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = queryOne(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
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
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Middleware to verify JWT token
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// Get current user profile
router.get('/me', authenticateToken, (req, res) => {
  try {
    const user = queryOne(
      'SELECT * FROM users WHERE id = ?',
      [req.user.userId]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

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
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update user goals
router.patch('/goals', authenticateToken, (req, res) => {
  try {
    const { weeklyGoal, monthlyGoal } = req.body;

    if (weeklyGoal !== undefined) {
      run('UPDATE users SET weekly_goal = ? WHERE id = ?', [weeklyGoal, req.user.userId]);
    }

    if (monthlyGoal !== undefined) {
      run('UPDATE users SET monthly_goal = ? WHERE id = ?', [monthlyGoal, req.user.userId]);
    }

    res.json({ message: 'Goals updated successfully' });
  } catch (error) {
    console.error('Update goals error:', error);
    res.status(500).json({ error: 'Failed to update goals' });
  }
});

export default router;
