import { Router } from 'express';
import {
  handleChat,
  handleItinerary,
  handleClassifyComplaint,
  handleAnalyzeSentiment,
  handleGapAnalysis
} from '../controllers/aiController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validate.js';
import {
  chatSchema,
  itinerarySchema,
  classifyComplaintSchema,
  analyzeSentimentSchema
} from '../validators/aiValidators.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Guest Concierge Chat (can be guest or authenticated)
router.post('/chat', aiRateLimiter, validateBody(chatSchema), handleChat);

// Personalized Travel Planner
router.post('/itinerary', aiRateLimiter, validateBody(itinerarySchema), handleItinerary);

// Smart Complaint Classifier
router.post('/classify-complaint', aiRateLimiter, validateBody(classifyComplaintSchema), handleClassifyComplaint);

// Review Sentiment Analyzer
router.post('/analyze-sentiment', aiRateLimiter, validateBody(analyzeSentimentSchema), handleAnalyzeSentiment);

// Experience Gap Detector
router.post('/gap-analysis', aiRateLimiter, handleGapAnalysis);
router.get('/gap-analysis', aiRateLimiter, handleGapAnalysis);

export default router;

