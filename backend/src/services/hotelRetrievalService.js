import { supabase, isUsingLiveSupabase, localStore } from '../config/db.js';

export const getHotelContext = async (hotelId) => {
  if (isUsingLiveSupabase() && supabase) {
    try {
      const { data: hotel, error: hotelErr } = await supabase
        .from('hotels')
        .select('*')
        .eq('id', hotelId)
        .single();

      if (!hotelErr && hotel) {
        const { data: faqs } = await supabase
          .from('hotel_faqs')
          .select('*')
          .eq('hotel_id', hotelId)
          .eq('is_active', true);

        return {
          ...hotel,
          faqs: faqs || []
        };
      }
    } catch (err) {
      console.warn('Supabase retrieval error, using local fallback:', err.message);
    }
  }

  // Local store retrieval
  const hotel = localStore.getHotelById(hotelId) || localStore.getHotels()[0];
  const faqs = localStore.getFaqs(hotel?.id);
  return {
    ...hotel,
    faqs
  };
};

export const listAllHotels = async () => {
  if (isUsingLiveSupabase() && supabase) {
    try {
      const { data, error } = await supabase.from('hotels').select('*');
      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase hotel listing error:', err.message);
    }
  }
  return localStore.getHotels();
};

export const listHotelFaqs = async (hotelId) => {
  if (isUsingLiveSupabase() && supabase) {
    try {
      const { data, error } = await supabase
        .from('hotel_faqs')
        .select('*')
        .eq('hotel_id', hotelId)
        .eq('is_active', true);
      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase faqs listing error:', err.message);
    }
  }
  return localStore.getFaqs(hotelId);
};

