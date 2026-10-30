import rateLimit from 'express-rate-limit';

export const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 AI requests per minute
  message: {
    success: false,
    error: 'Too many AI requests. Please slow down and try again shortly.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per window
  message: {
    success: false,
    error: 'Too many authentication attempts. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

