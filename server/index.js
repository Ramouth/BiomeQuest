import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './db.js';
import { errorHandler } from './utils/errors.js';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.js';
import plantRoutes from './routes/plants.js';
import logRoutes from './routes/logs.js';
import badgeRoutes from './routes/badges.js';
import requestRoutes from './routes/requests.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database before starting server
async function startServer() {
  try {
    await initDatabase();
    console.log('Database initialized successfully');

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/plants', plantRoutes);
    app.use('/api/logs', logRoutes);
    app.use('/api/badges', badgeRoutes);
    app.use('/api/requests', requestRoutes);

    // Root route
    app.get('/', (req, res) => {
      res.json({
        name: 'BiomeQuest API',
        version: '1.0.0',
        endpoints: {
          health: '/api/health',
          auth: '/api/auth',
          plants: '/api/plants',
          logs: '/api/logs',
          badges: '/api/badges',
          requests: '/api/requests'
        }
      });
    });

    // Health check
    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', message: 'BiomeQuest API is running' });
    });

    // Error handling middleware - provides user-friendly error messages
    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`BiomeQuest server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
