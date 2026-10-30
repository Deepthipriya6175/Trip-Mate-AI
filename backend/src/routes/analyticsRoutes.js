import { Router } from 'express';
import { getDashboardAnalytics } from '../controllers/analyticsController.js';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateToken);
router.get('/', requireRole(['hotel_staff', 'admin']), getDashboardAnalytics);

export default router;

