import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { ENV } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';
import itineraryRoutes from './routes/itineraryRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

const app = express();

// Security and middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// CORS configuration supporting local dev, Vercel deployments, and custom domains
const allowedOrigins = [
  ENV.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (mobile, server-to-server, curl)
    if (!origin) return callback(null, true);
    
    // Allow listed origins, localhost, or any vercel.app preview/production deployment
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1')
    ) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive for initial cloud pairing
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

if (ENV.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Root service welcome route (for cloud pingers and manual checks)
app.get('/', (req, res) => {
  res.json({
    service: 'TripMate AI Backend API',
    status: 'online',
    version: '1.0.0',
    environment: ENV.NODE_ENV,
    endpoints: {
      health: '/api/health',
      hotels: '/api/hotels',
      auth: '/api/auth',
      ai: '/api/ai',
      complaints: '/api/complaints',
      feedback: '/api/feedback',
      analytics: '/api/analytics'
    }
  });
});

// Health check endpoint (Render zero-downtime healthCheckPath)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'TripMate AI Backend API',
    version: '1.0.0',
    mode: ENV.NODE_ENV
  });
});

// API Mount points
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/itineraries', itineraryRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint not found: ${req.method} ${req.originalUrl}`
  });
});

// Centralized error handler
app.use(errorHandler);

// Start server on all interfaces (0.0.0.0) for Render / cloud container support
const HOST = '0.0.0.0';
const PORT = Number(ENV.PORT) || 5000;

const server = app.listen(PORT, HOST, () => {
  console.log(`=======================================================`);
  console.log(` TripMate AI Backend running on http://${HOST}:${PORT}`);
  console.log(` Health check: http://${HOST}:${PORT}/api/health`);
  console.log(` Environment: ${ENV.NODE_ENV}`);
  console.log(`=======================================================`);
});

export default app;
