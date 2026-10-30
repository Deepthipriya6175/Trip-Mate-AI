import { z } from 'zod';

export const chatSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
  hotel_id: z.string().optional(),
  language: z.string().default('en'),
  conversation_id: z.string().optional(),
  history: z.array(z.object({
    sender_role: z.enum(['user', 'assistant', 'system']),
    content: z.string()
  })).optional().default([])
});

export const itinerarySchema = z.object({
  destination: z.string().min(2, 'Destination must be at least 2 characters'),
  duration_days: z.number().int().min(1).max(14).default(3),
  budget_level: z.enum(['budget', 'moderate', 'luxury', 'ultra_luxury']).default('moderate'),
  interests: z.array(z.string()).default([]),
  currency: z.string().default('USD'),
  travel_pace: z.string().default('balanced'),
  language: z.string().default('en')
});

export const classifyComplaintSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  room_number: z.string().optional()
});

export const analyzeSentimentSchema = z.object({
  comments: z.string().min(5, 'Comments must be at least 5 characters'),
  ratings: z.object({
    overall: z.number().min(1).max(5).optional(),
    cleanliness: z.number().min(1).max(5).optional(),
    staff: z.number().min(1).max(5).optional(),
    food: z.number().min(1).max(5).optional(),
    amenities: z.number().min(1).max(5).optional()
  }).optional().default({})
});

