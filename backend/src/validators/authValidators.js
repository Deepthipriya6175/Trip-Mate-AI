import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  role: z.enum(['tourist', 'hotel_staff', 'admin']).default('tourist'),
  preferred_language: z.string().default('en'),
  phone: z.string().optional().default(''),
  hotel_id: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

