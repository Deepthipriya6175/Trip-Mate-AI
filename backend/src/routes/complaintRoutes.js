import { Router } from 'express';
import {
  createComplaint,
  listComplaints,
  getComplaintById,
  updateComplaintStatus
} from '../controllers/complaintController.js';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validate.js';
import { createComplaintSchema, updateComplaintSchema } from '../validators/complaintValidators.js';

const router = Router();

router.use(authenticateToken);

// Create new ticket (Tourist or Staff)
router.post('/', validateBody(createComplaintSchema), createComplaint);

// List tickets (Role-aware: Tourist sees own, Staff sees hotel's, Admin sees all)
router.get('/', listComplaints);

// Get single ticket detail
router.get('/:id', getComplaintById);

// Update ticket status / notes (Staff or Admin)
router.patch('/:id', requireRole(['hotel_staff', 'admin']), validateBody(updateComplaintSchema), updateComplaintStatus);

export default router;

