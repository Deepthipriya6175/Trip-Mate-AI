import { Router } from 'express';
import { getHotels, getHotelById, getHotelFaqs } from '../controllers/hotelController.js';

const router = Router();

router.get('/', getHotels);
router.get('/:id', getHotelById);
router.get('/:id/faqs', getHotelFaqs);

export default router;

