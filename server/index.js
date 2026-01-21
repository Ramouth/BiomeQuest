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

// Middleware - CORS configured for mobile access
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://192.168.0.92:3000' // Mobile access via local network
  ],
  credentials: true
}));
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

    const HOST = '0.0.0.0'; // Listen on all network interfaces
    app.listen(PORT, HOST, () => {
      console.log(`✅ BiomeQuest server running on http://localhost:${PORT}`);
      console.log(`📱 Mobile access: http://192.168.0.92:${PORT}`);
      console.log(`🌐 Network: http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
