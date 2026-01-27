import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase } from './db.js';
import { errorHandler } from './utils/errors.js';

// ES module dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.js';
import plantRoutes from './routes/plants.js';
import logRoutes from './routes/logs.js';
import badgeRoutes from './routes/badges.js';
import requestRoutes from './routes/requests.js';
import feedbackRoutes from './routes/feedback.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Dynamic CORS origins based on environment
const getCorsOrigins = () => {
  const origins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://192.168.0.92:3000' // Mobile access via local network
  ];

  // Add production origins if configured
  if (process.env.FRONTEND_URL) {
    origins.push(process.env.FRONTEND_URL);
    // Also add HTTPS version
    if (process.env.FRONTEND_URL.startsWith('http://')) {
      origins.push(process.env.FRONTEND_URL.replace('http://', 'https://'));
    }
  }
  if (process.env.SERVER_IP) {
    origins.push(`http://${process.env.SERVER_IP}:${PORT}`);
    origins.push(`https://${process.env.SERVER_IP}`);
  }

  return origins;
};

app.use(cors({
  origin: getCorsOrigins(),
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
    app.use('/api/feedback', feedbackRoutes);

    // Root route - API info (development only, production serves React app)
    if (process.env.NODE_ENV !== 'production') {
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
    }

    // Health check
    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', message: 'BiomeQuest API is running' });
    });

    // Serve static files in production
    if (process.env.NODE_ENV === 'production') {
      const distPath = path.join(__dirname, '..', 'dist');
      app.use(express.static(distPath));

      // Catch-all route to serve index.html for React Router (Express 5 syntax)
      app.get('/{*splat}', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

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
