import {
  chatConcierge,
  generateTravelItinerary,
  classifyComplaint as classifyService,
  analyzeSentiment as sentimentService,
  detectExperienceGaps
} from '../services/geminiService.js';
import { getHotelContext } from '../services/hotelRetrievalService.js';
import { getGuestMemory } from '../services/memoryService.js';
import { localStore, isUsingLiveSupabase, supabase } from '../config/db.js';

export const handleChat = async (req, res, next) => {
  try {
    const { message, hotel_id, language = 'en', history = [] } = req.body;
    const userId = req.user?.id;

    // Retrieve verified hotel knowledge context
    const hotelContext = await getHotelContext(hotel_id || 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');

    // Retrieve guest memory (open tickets)
    const userMemory = await getGuestMemory(userId, hotelContext?.id);

    const result = await chatConcierge({
      userMessage: message,
      hotelContext,
      userMemory,
      language: language || req.user?.preferred_language || 'en',
      conversationHistory: history
    });

    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
};

export const handleItinerary = async (req, res, next) => {
  try {
    const {
      destination,
      duration_days = 3,
      budget_level = 'moderate',
      interests = [],
      currency = 'USD',
      travel_pace = 'balanced',
      language = 'en'
    } = req.body;

    const itinerary = await generateTravelItinerary({
      destination,
      durationDays: Number(duration_days),
      budgetLevel: budget_level,
      interests,
      currency,
      travelPace: travel_pace,
      language
    });

    res.json({
      success: true,
      data: itinerary
    });
  } catch (err) {
    next(err);
  }
};

export const handleClassifyComplaint = async (req, res, next) => {
  try {
    const { title, description, room_number = '' } = req.body;

    const classification = await classifyService({
      title,
      description,
      roomNumber: room_number
    });

    res.json({
      success: true,
      data: classification
    });
  } catch (err) {
    next(err);
  }
};

export const handleAnalyzeSentiment = async (req, res, next) => {
  try {
    const { comments, ratings = {} } = req.body;

    const analysis = await sentimentService({
      comments,
      ratings
    });

    res.json({
      success: true,
      data: analysis
    });
  } catch (err) {
    next(err);
  }
};

export const handleGapAnalysis = async (req, res, next) => {
  try {
    const hotel_id = req.query.hotel_id || req.body.hotel_id || 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    const hotelContext = await getHotelContext(hotel_id);

    let complaints = [];
    let feedback = [];

    if (isUsingLiveSupabase() && supabase) {
      const { data: cData } = await supabase.from('complaints').select('*').eq('hotel_id', hotel_id);
      const { data: fData } = await supabase.from('feedback').select('*').eq('hotel_id', hotel_id);
      if (cData) complaints = cData;
      if (fData) feedback = fData;
    } else {
      complaints = localStore.getComplaints({ hotel_id });
      feedback = localStore.getFeedback(hotel_id);
    }

    const gaps = await detectExperienceGaps({
      complaints,
      feedback,
      hotelName: hotelContext?.name || 'Grand Heritage Palace'
    });

    res.json({
      success: true,
      data: gaps
    });
  } catch (err) {
    next(err);
  }
};

