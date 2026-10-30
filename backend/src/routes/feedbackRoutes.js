import { Router } from 'express';
import { createFeedback, listFeedback } from '../controllers/feedbackController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validate.js';
import { createFeedbackSchema } from '../validators/feedbackValidators.js';

const router = Router();

// Publicly read hotel feedback
router.get('/', listFeedback);

// Submit feedback (Authenticated guests)
router.post('/', authenticateToken, validateBody(createFeedbackSchema), createFeedback);

export default router;

