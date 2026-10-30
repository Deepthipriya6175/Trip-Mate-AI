import { Router } from 'express';
import { register, login, getMe, demoLogin } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../validators/authValidators.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authRateLimiter, validateBody(registerSchema), register);
router.post('/login', authRateLimiter, validateBody(loginSchema), login);
router.post('/demo-login', authRateLimiter, demoLogin);
router.get('/me', authenticateToken, getMe);

export default router;

