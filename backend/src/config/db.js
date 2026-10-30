import { createClient } from '@supabase/supabase-js';
import { ENV } from './env.js';
import {
  SEED_USERS,
  SEED_HOTELS,
  SEED_FAQS,
  SEED_COMPLAINTS,
  SEED_FEEDBACK,
  SEED_ITINERARIES,
  SEED_AI_INSIGHTS
} from '../utils/seedData.js';

let supabaseClient = null;
let isLiveSupabase = false;

if (ENV.SUPABASE_URL && (ENV.SUPABASE_SERVICE_ROLE_KEY || ENV.SUPABASE_ANON_KEY)) {
  try {
    const key = ENV.SUPABASE_SERVICE_ROLE_KEY || ENV.SUPABASE_ANON_KEY;
    supabaseClient = createClient(ENV.SUPABASE_URL, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    isLiveSupabase = true;
    console.log('[TripMate AI DB] Connected to live Supabase instance:', ENV.SUPABASE_URL);
  } catch (err) {
    console.warn('[TripMate AI DB] Live Supabase connection failed, falling back to local hybrid store:', err.message);
    isLiveSupabase = false;
  }
} else {
  console.log('[TripMate AI DB] Running in hybrid memory-persistent store mode (pre-seeded with verified hotel data).');
}

// Local in-memory store for out-of-the-box testing or offline dev
class LocalStore {
  constructor() {
    this.users = [...SEED_USERS];
    this.hotels = [...SEED_HOTELS];
    this.faqs = [...SEED_FAQS];
    this.complaints = [...SEED_COMPLAINTS];
    this.feedback = [...SEED_FEEDBACK];
    this.itineraries = [...SEED_ITINERARIES];
    this.insights = { ...SEED_AI_INSIGHTS };
    this.conversations = [];
    this.messages = [];
  }

  // Users / Profiles
  findUserByEmail(email) {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    return this.users.find(u => u.id === id);
  }

  createUser(userData) {
    const newUser = {
      id: userData.id || `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      email: userData.email,
      password_hash: userData.password_hash,
      full_name: userData.full_name,
      role: userData.role || 'tourist',
      preferred_language: userData.preferred_language || 'en',
      phone: userData.phone || '',
      created_at: new Date().toISOString()
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(id, updates) {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.users[idx] = { ...this.users[idx], ...updates, updated_at: new Date().toISOString() };
    return this.users[idx];
  }

  // Hotels
  getHotels() {
    return this.hotels;
  }

  getHotelById(id) {
    return this.hotels.find(h => h.id === id || h.slug === id);
  }

  // FAQs
  getFaqs(hotelId) {
    if (!hotelId) return this.faqs;
    return this.faqs.filter(f => f.hotel_id === hotelId);
  }

  // Complaints
  getComplaints(filters = {}) {
    let list = [...this.complaints];
    if (filters.hotel_id) {
      list = list.filter(c => c.hotel_id === filters.hotel_id);
    }
    if (filters.user_id) {
      list = list.filter(c => c.user_id === filters.user_id);
    }
    if (filters.status) {
      list = list.filter(c => c.status === filters.status);
    }
    if (filters.department) {
      list = list.filter(c => c.department === filters.department);
    }
    if (filters.urgency) {
      list = list.filter(c => c.urgency === filters.urgency);
    }
    return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  getComplaintById(id) {
    return this.complaints.find(c => c.id === id);
  }

  createComplaint(data) {
    const newComplaint = {
      id: `c-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: data.user_id,
      hotel_id: data.hotel_id,
      room_number: data.room_number || '',
      title: data.title,
      description: data.description,
      category: data.category || 'general_service',
      urgency: data.urgency || 'medium',
      department: data.department || 'front_desk',
      status: 'pending',
      ai_confidence: data.ai_confidence || 0.95,
      resolution_notes: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      guest_name: data.guest_name || 'Guest',
      guest_email: data.guest_email || ''
    };
    this.complaints.unshift(newComplaint);
    return newComplaint;
  }

  updateComplaint(id, updates) {
    const idx = this.complaints.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.complaints[idx] = {
      ...this.complaints[idx],
      ...updates,
      updated_at: new Date().toISOString()
    };
    if (updates.status === 'resolved' && !this.complaints[idx].resolved_at) {
      this.complaints[idx].resolved_at = new Date().toISOString();
    }
    return this.complaints[idx];
  }

  // Feedback
  getFeedback(hotelId) {
    let list = [...this.feedback];
    if (hotelId) {
      list = list.filter(f => f.hotel_id === hotelId);
    }
    return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  createFeedback(data) {
    const newFeedback = {
      id: `f-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: data.user_id,
      hotel_id: data.hotel_id,
      rating_overall: data.rating_overall,
      rating_cleanliness: data.rating_cleanliness || data.rating_overall,
      rating_staff: data.rating_staff || data.rating_overall,
      rating_food: data.rating_food || data.rating_overall,
      rating_amenities: data.rating_amenities || data.rating_overall,
      comments: data.comments,
      sentiment: data.sentiment || 'positive',
      sentiment_score: data.sentiment_score || 0.85,
      key_positives: data.key_positives || [],
      key_improvements: data.key_improvements || [],
      guest_name: data.guest_name || 'Guest',
      created_at: new Date().toISOString()
    };
    this.feedback.unshift(newFeedback);
    return newFeedback;
  }

  // Itineraries
  getItineraries(userId) {
    let list = [...this.itineraries];
    if (userId) {
      list = list.filter(it => it.user_id === userId);
    }
    return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  createItinerary(data) {
    const newItinerary = {
      id: `it-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: data.user_id,
      title: data.title,
      destination: data.destination,
      duration_days: data.duration_days,
      budget_level: data.budget_level,
      interests: data.interests || [],
      itinerary_data: data.itinerary_data,
      total_estimated_cost: data.total_estimated_cost,
      currency: data.currency || 'USD',
      created_at: new Date().toISOString()
    };
    this.itineraries.unshift(newItinerary);
    return newItinerary;
  }

  // AI Insights
  getInsights(hotelId) {
    return this.insights;
  }

  updateInsights(hotelId, newInsights) {
    this.insights = { ...this.insights, ...newInsights, analysis_date: new Date().toISOString().split('T')[0] };
    return this.insights;
  }
}

export const localStore = new LocalStore();
export const supabase = supabaseClient;
export const isUsingLiveSupabase = () => isLiveSupabase;

