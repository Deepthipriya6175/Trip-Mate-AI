import { localStore, isUsingLiveSupabase, supabase } from '../config/db.js';

export const saveItinerary = async (req, res, next) => {
  try {
    const { title, destination, duration_days, budget_level, interests = [], itinerary_data, total_estimated_cost, currency = 'USD' } = req.body;

    const payload = {
      user_id: req.user.id,
      title,
      destination,
      duration_days,
      budget_level,
      interests,
      itinerary_data,
      total_estimated_cost,
      currency
    };

    let itinerary = null;
    if (isUsingLiveSupabase() && supabase) {
      const { data, error } = await supabase
        .from('itineraries')
        .insert([payload])
        .select()
        .single();
      if (error) throw error;
      itinerary = data;
    } else {
      itinerary = localStore.createItinerary(payload);
    }

    res.status(201).json({
      success: true,
      message: 'Itinerary saved to your travel vault.',
      data: itinerary
    });
  } catch (err) {
    next(err);
  }
};

export const listItineraries = async (req, res, next) => {
  try {
    let itineraries = [];

    if (isUsingLiveSupabase() && supabase) {
      const { data, error } = await supabase
        .from('itineraries')
        .select('*')
        .eq('user_id', req.user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      itineraries = data || [];
    } else {
      itineraries = localStore.getItineraries(req.user.id);
    }

    res.json({
      success: true,
      count: itineraries.length,
      data: itineraries
    });
  } catch (err) {
    next(err);
  }
};

