import { z } from 'zod';

export const createFeedbackSchema = z.object({
  hotel_id: z.string().min(1, 'Hotel ID is required'),
  rating_overall: z.number().int().min(1).max(5),
  rating_cleanliness: z.number().int().min(1).max(5).optional(),
  rating_staff: z.number().int().min(1).max(5).optional(),
  rating_food: z.number().int().min(1).max(5).optional(),
  rating_amenities: z.number().int().min(1).max(5).optional(),
  comments: z.string().min(5, 'Review comments must be at least 5 characters')
});

