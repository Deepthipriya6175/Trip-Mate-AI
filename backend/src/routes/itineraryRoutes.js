import { Router } from 'express';
import { saveItinerary, listItineraries } from '../controllers/itineraryController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateToken);

router.post('/', saveItinerary);
router.get('/', listItineraries);

export default router;

