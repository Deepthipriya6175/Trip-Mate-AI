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

// CORS configuration supporting local Vite dev & production frontend
const allowedOrigins = [
  ENV.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, postman)
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive for pairing
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'TripMate AI Backend API',
    version: '1.0.0',
    mode: process.env.NODE_ENV || 'development'
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

// Start server
const server = app.listen(ENV.PORT, () => {
  console.log(`=======================================================`);
  console.log(` TripMate AI Backend running on http://localhost:${ENV.PORT}`);
  console.log(` Health check: http://localhost:${ENV.PORT}/api/health`);
  console.log(` Environment: ${ENV.NODE_ENV}`);
  console.log(`=======================================================`);
});

export default app;

