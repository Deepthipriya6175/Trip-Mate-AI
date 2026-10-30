import { localStore, isUsingLiveSupabase, supabase } from '../config/db.js';
import { analyzeSentiment as sentimentService } from '../services/geminiService.js';

export const createFeedback = async (req, res, next) => {
  try {
    const {
      hotel_id,
      rating_overall,
      rating_cleanliness,
      rating_staff,
      rating_food,
      rating_amenities,
      comments
    } = req.body;

    // AI Sentiment Analysis
    let sentiment = 'positive';
    let sentiment_score = 0.85;
    let key_positives = [];
    let key_improvements = [];

    try {
      const sentimentResult = await sentimentService({
        comments,
        ratings: {
          overall: rating_overall,
          cleanliness: rating_cleanliness,
          staff: rating_staff,
          food: rating_food,
          amenities: rating_amenities
        }
      });
      sentiment = sentimentResult.sentiment;
      sentiment_score = sentimentResult.sentiment_score;
      key_positives = sentimentResult.key_positives || [];
      key_improvements = sentimentResult.key_improvements || [];
    } catch (err) {
      sentiment = rating_overall >= 4 ? 'positive' : (rating_overall <= 2 ? 'negative' : 'neutral');
    }

    const feedbackData = {
      user_id: req.user.id,
      hotel_id,
      rating_overall,
      rating_cleanliness: rating_cleanliness || rating_overall,
      rating_staff: rating_staff || rating_overall,
      rating_food: rating_food || rating_overall,
      rating_amenities: rating_amenities || rating_overall,
      comments,
      sentiment,
      sentiment_score,
      key_positives,
      key_improvements,
      guest_name: req.user.full_name
    };

    let feedbackRecord = null;
    if (isUsingLiveSupabase() && supabase) {
      const { data, error } = await supabase
        .from('feedback')
        .insert([feedbackData])
        .select()
        .single();
      if (error) throw error;
      feedbackRecord = data;
    } else {
      feedbackRecord = localStore.createFeedback(feedbackData);
    }

    res.status(201).json({
      success: true,
      message: 'Feedback submitted and analyzed successfully.',
      data: feedbackRecord
    });
  } catch (err) {
    next(err);
  }
};

export const listFeedback = async (req, res, next) => {
  try {
    const { hotel_id } = req.query;
    let feedbackList = [];

    if (isUsingLiveSupabase() && supabase) {
      let query = supabase.from('feedback').select('*').order('created_at', { ascending: false });
      if (hotel_id) query = query.eq('hotel_id', hotel_id);
      const { data, error } = await query;
      if (error) throw error;
      feedbackList = data || [];
    } else {
      feedbackList = localStore.getFeedback(hotel_id);
    }

    res.json({
      success: true,
      count: feedbackList.length,
      data: feedbackList
    });
  } catch (err) {
    next(err);
  }
};

