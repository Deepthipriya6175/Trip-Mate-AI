import { z } from 'zod';

export const createComplaintSchema = z.object({
  hotel_id: z.string().min(1, 'Hotel ID is required'),
  room_number: z.string().optional().default(''),
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().optional(),
  urgency: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  department: z.string().optional()
});

export const updateComplaintSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'resolved', 'escalated']).optional(),
  resolution_notes: z.string().optional(),
  assigned_staff_id: z.string().optional(),
  urgency: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  department: z.string().optional()
});

